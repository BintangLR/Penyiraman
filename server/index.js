import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import mysql from 'mysql2/promise';
import crypto from 'node:crypto';
import 'dotenv/config';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = (key, fallback) => process.env[key] || fallback;
const dbName = env('MYSQL_DATABASE', 'irigasi_cerdas').replace(/[^a-zA-Z0-9_]/g, '');
const apiPort = Number(env('API_PORT', 3001));
const load = file => import(pathToFileURL(path.join(root, file)));
const [{ ZONES_CONFIG }, { SCHEDULE_DATA }, { NOTIFICATION_DATA }, { HISTORY_DATA }, graph] = await Promise.all([
  load('src/data/zonesData.js'), load('src/data/scheduleData.js'), load('src/data/notificationData.js'),
  load('src/data/historyData.js'), load('src/data/graphData.js'),
]);
const seed = { zones: ZONES_CONFIG, schedules: SCHEDULE_DATA, notifications: NOTIFICATION_DATA, history: HISTORY_DATA,
  graphics: Object.fromEntries(Object.entries(graph).filter(([key]) => key !== 'ZONE_COLORS')),
  settings: { account: { name: 'Michael Sonda', email: 'admin@irigasicerdas.id', password: '••••••••••••' }, system: { language: 'Bahasa Indonesia', timezone: 'WITA (UTC+8)', theme: 'Terang', autoRefresh: '5 menit' }, watering: { defaultDuration: '10 menit', flowRate: '1.2 Liter/menit', moistureMin: 30, moistureOptimal: 70 }, notifs: { lowMoisture: true, wateringDone: true, deviceOffline: true, highWater: true, skipSched: true } } };
const connection = { host: env('MYSQL_HOST', '127.0.0.1'), port: Number(env('MYSQL_PORT', 3306)), user: env('MYSQL_USER', 'root'), password: env('MYSQL_PASSWORD', '') };
let pool;

async function initializeDatabase() {
  const admin = await mysql.createConnection(connection);
  if (process.argv.includes('--reset-only')) await admin.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await admin.end();
  pool = mysql.createPool({ ...connection, database: dbName, waitForConnections: true, connectionLimit: 10 });
  await pool.query(`CREATE TABLE IF NOT EXISTS zones (id INT PRIMARY KEY, name VARCHAR(100), plant VARCHAR(100), moisture DECIMAL(5,2), status VARCHAR(30), device_status VARCHAR(30), soil_temp DECIMAL(5,2), last_updated VARCHAR(50), area VARCHAR(50), soil_type VARCHAR(100), water_need VARCHAR(50), target_moisture_min INT, target_moisture_max INT, moisture_min INT, moisture_mid INT, moisture_max INT, irrigation_duration INT, estimated_water DECIMAL(8,2), image TEXT)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS zone_images (id INT AUTO_INCREMENT PRIMARY KEY, zone_id INT NOT NULL, image_url TEXT NOT NULL, sort_order INT NOT NULL, FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS sensors (id VARCHAR(50) PRIMARY KEY, zone_id INT NOT NULL, label VARCHAR(100), value DECIMAL(6,2), status VARCHAR(30), FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS moisture_history (id INT AUTO_INCREMENT PRIMARY KEY, zone_id INT NOT NULL, day_index INT NOT NULL, value DECIMAL(6,2), measured_at DATETIME(3) NULL, FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE)`);
  const [moistureMeasuredAt] = await pool.query("SHOW COLUMNS FROM moisture_history LIKE 'measured_at'");
  if (!moistureMeasuredAt.length) await pool.query('ALTER TABLE moisture_history ADD COLUMN measured_at DATETIME(3) NULL AFTER value');
  await pool.query(`CREATE TABLE IF NOT EXISTS temperature_history (id INT AUTO_INCREMENT PRIMARY KEY, zone_id INT NOT NULL, value DECIMAL(6,2) NOT NULL, measured_at DATETIME(3) NOT NULL, INDEX ix_temperature_history_zone_time (zone_id, measured_at), FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS schedules (id INT PRIMARY KEY AUTO_INCREMENT, zone_id INT, zone_name VARCHAR(100), plant VARCHAR(100), plant_type VARCHAR(100), image TEXT, time_text VARCHAR(10), duration INT, flow_rate DECIMAL(8,2), estimated_water DECIMAL(8,2), active BOOLEAN, mode VARCHAR(30))`);
  await pool.query(`CREATE TABLE IF NOT EXISTS schedule_days (schedule_id INT NOT NULL, day_name VARCHAR(10) NOT NULL, PRIMARY KEY(schedule_id, day_name), FOREIGN KEY(schedule_id) REFERENCES schedules(id) ON DELETE CASCADE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS notifications (id INT PRIMARY KEY, type VARCHAR(30), category VARCHAR(50), title VARCHAR(255), description TEXT, zone_id INT NULL, zone_name VARCHAR(100), plant VARCHAR(100), plant_type VARCHAR(100), moisture DECIMAL(6,2) NULL, threshold DECIMAL(6,2) NULL, image TEXT, event_date VARCHAR(30), time_text VARCHAR(10), is_read BOOLEAN)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS history (id INT PRIMARY KEY, event_date VARCHAR(30), time_text VARCHAR(10), zone_id INT, zone_name VARCHAR(100), plant VARCHAR(100), image TEXT, moisture_before DECIMAL(6,2), moisture_after DECIMAL(6,2), duration INT, water_volume DECIMAL(8,2), method VARCHAR(30), status VARCHAR(30))`);
  const [historyStartedAt] = await pool.query("SHOW COLUMNS FROM history LIKE 'started_at'");
  if (!historyStartedAt.length) await pool.query('ALTER TABLE history ADD COLUMN started_at DATETIME NULL AFTER status');
  await pool.query(`CREATE TABLE IF NOT EXISTS app_data (data_key VARCHAR(40) PRIMARY KEY, data JSON NOT NULL)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(80) UNIQUE NOT NULL, email VARCHAR(150) UNIQUE, password_hash VARCHAR(128) NOT NULL, password_salt VARCHAR(64) NOT NULL, name VARCHAR(150) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'Operator', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  const [[count]] = await pool.query('SELECT COUNT(*) total FROM zones');
  if (count.total === 0) await seedDatabase();
  await restoreReferenceData();
  const [[userCount]] = await pool.query('SELECT COUNT(*) total FROM users');
  if (userCount.total === 0) await createUser('admin', 'admin@irigasicerdas.id', 'admin123', 'Michael Sonda', 'Administrator');
}

function passwordHash(password, salt) { return crypto.scryptSync(password, salt, 64).toString('hex'); }
async function createUser(username, email, password, name, role = 'Operator') {
  const salt = crypto.randomBytes(16).toString('hex');
  await pool.query('INSERT INTO users (username,email,password_hash,password_salt,name,role) VALUES (?,?,?,?,?,?)', [username, email || null, passwordHash(password, salt), salt, name, role]);
}
async function authenticate(username, password) {
  const [result] = await pool.query('SELECT id,username,email,password_hash,password_salt,name,role FROM users WHERE username=? OR email=? LIMIT 1', [username, username]);
  const user = result[0];
  if (!user) return null;
  const actual = Buffer.from(passwordHash(password, user.password_salt), 'hex');
  const expected = Buffer.from(user.password_hash, 'hex');
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
  return { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role };
}

async function seedDatabase() {
  for (const z of seed.zones) {
    await pool.query('INSERT INTO zones VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [z.id,z.name,z.plant,z.moisture,z.status,z.deviceStatus,z.soilTemp,z.lastUpdated,z.area,z.soilType,z.waterNeed,z.targetMoistureMin,z.targetMoistureMax,z.moistureMin,z.moistureMid,z.moistureMax,z.irrigationDuration,z.estimatedWater,z.image]);
    for (const [sort_order, image_url] of [z.image, ...(z.additionalImages || [])].map((image_url, i) => [i, image_url])) await pool.query('INSERT INTO zone_images (zone_id, image_url, sort_order) VALUES (?, ?, ?)', [z.id,image_url,sort_order]);
    for (const s of z.sensors || []) await pool.query('INSERT INTO sensors VALUES (?, ?, ?, ?, ?)', [s.id,z.id,s.label,s.value,s.status]);
    for (const [day_index, value] of (z.moistureHistory || []).entries()) await pool.query('INSERT INTO moisture_history (zone_id, day_index, value, measured_at) VALUES (?, ?, ?, NULL)', [z.id,day_index,value]);
  }
  for (const s of seed.schedules) { await pool.query('INSERT INTO schedules VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [s.id,s.zoneId,s.zoneName,s.plant,s.plantType,s.image,s.time,s.duration,s.flowRate,s.estimatedWater,s.active,s.mode]); for (const day of s.days || []) await pool.query('INSERT INTO schedule_days VALUES (?, ?)', [s.id,day]); }
  for (const n of seed.notifications) await pool.query('INSERT INTO notifications VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [n.id,n.type,n.category,n.title,n.description,n.zoneId,n.zoneName,n.plant,n.plantType,n.moisture,n.threshold,n.image,n.date,n.time,n.read]);
  
  for (const h of seed.history) {
    await pool.query(
      `INSERT INTO history (
        id, event_date, time_text, zone_id, zone_name, plant, image,
        moisture_before, moisture_after, duration, water_volume, method, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        h.id, h.date, h.time, h.zoneId, h.zoneName, h.plant, h.image,
        h.moistureBefore, h.moistureAfter, h.duration, h.waterVolume,
        h.method, h.status
      ]
    );
  }

  for (const [key, value] of [['graphics', seed.graphics], ['settings', seed.settings]]) await pool.query('INSERT INTO app_data VALUES (?, ?)', [key, JSON.stringify(value)]);
}

function parseReferenceTuples(statement) {
  const valuesStart = statement.indexOf('VALUES');
  if (valuesStart < 0) return [];
  const text = statement.slice(valuesStart + 6).replace(/;\s*$/, '');
  const tuples = [];
  let tuple = null; let token = ''; let quoted = false; let escaped = false;
  const pushToken = () => { tuple.push(token); token = ''; };
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (escaped) { token += char; escaped = false; continue; }
      if (char === '\\') { escaped = true; continue; }
      if (char === "'") { quoted = false; continue; }
      token += char;
      continue;
    }
    if (char === "'") { quoted = true; continue; }
    if (char === '(') { tuple = []; token = ''; continue; }
    if (char === ',' && tuple) { pushToken(); continue; }
    if (char === ')' && tuple) { pushToken(); tuples.push(tuple); tuple = null; continue; }
    if (tuple) token += char;
  }
  return tuples.map(values => values.map(value => {
    const trimmed = value.trim();
    if (trimmed.toUpperCase() === 'NULL') return null;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    return trimmed.replace(/\\([\\'"nrt])/g, (_, escapedChar) => ({ n: '\n', r: '\r', t: '\t' }[escapedChar] || escapedChar));
  }));
}

async function restoreReferenceData() {
  const dumpPath = path.join(root, 'database', 'irigasi_cerdas_export.sql');
  const dump = fs.readFileSync(dumpPath, 'utf8');
  const historyStatement = dump.match(/INSERT INTO `history` VALUES[\s\S]*?;/)?.[0];
  const referenceHistory = historyStatement ? parseReferenceTuples(historyStatement) : [];
  const [existingRows] = await pool.query('SELECT event_date,time_text,zone_id,status,duration,water_volume FROM history');
  const historyKey = row => [row.event_date, row.time_text, row.zone_id, row.status, row.duration, row.water_volume].map((value, index) => index >= 4 ? Number(value) : value).join('|');
  const existingKeys = new Set(existingRows.map(historyKey));
  for (const row of referenceHistory) {
    const [id, eventDate, timeText, zoneId, zoneName, plant, image, moistureBefore, moistureAfter, duration, waterVolume, method, status, startedAt] = row;
    const key = historyKey({ event_date: eventDate, time_text: timeText, zone_id: zoneId, status, duration, water_volume: waterVolume });
    if (existingKeys.has(key)) continue;
    const [[idRow]] = await pool.query('SELECT id FROM history WHERE id=?', [id]);
    if (idRow) {
      const [[maxRow]] = await pool.query('SELECT COALESCE(MAX(id),0) maxId FROM history');
      await pool.query('INSERT INTO history (id,event_date,time_text,zone_id,zone_name,plant,image,moisture_before,moisture_after,duration,water_volume,method,status,started_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [Number(maxRow.maxId) + 1, eventDate, timeText, zoneId, zoneName, plant, image, moistureBefore, moistureAfter, duration, waterVolume, method, status, startedAt]);
    } else {
      await pool.query('INSERT INTO history (id,event_date,time_text,zone_id,zone_name,plant,image,moisture_before,moisture_after,duration,water_volume,method,status,started_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', row);
    }
    existingKeys.add(key);
  }
  const [[graphicsRow]] = await pool.query('SELECT data_key FROM app_data WHERE data_key=?', ['graphics']);
  if (!graphicsRow) await pool.query('INSERT INTO app_data (data_key,data) VALUES (?,?)', ['graphics', JSON.stringify(seed.graphics)]);
  const [[settingsRow]] = await pool.query('SELECT data_key FROM app_data WHERE data_key=?', ['settings']);
  if (!settingsRow) await pool.query('INSERT INTO app_data (data_key,data) VALUES (?,?)', ['settings', JSON.stringify(seed.settings)]);
}

async function zones() { const [result] = await pool.query('SELECT * FROM zones ORDER BY id'); for (const z of result) { const [images] = await pool.query('SELECT image_url FROM zone_images WHERE zone_id=? ORDER BY sort_order', [z.id]); const [sensors] = await pool.query('SELECT id,label,value,status FROM sensors WHERE zone_id=?', [z.id]); const [history] = await pool.query('SELECT day_index, value, measured_at measuredAt FROM moisture_history WHERE zone_id=? ORDER BY day_index', [z.id]); z.deviceStatus=z.device_status; z.soilTemp=z.soil_temp; z.lastUpdated=z.last_updated; z.targetMoistureMin=z.target_moisture_min; z.targetMoistureMax=z.target_moisture_max; z.moistureMin=z.moisture_min; z.moistureMid=z.moisture_mid; z.moistureMax=z.moisture_max; z.irrigationDuration=z.irrigation_duration; z.estimatedWater=z.estimated_water; z.additionalImages=images.slice(1).map(i=>i.image_url); z.image=images[0]?.image_url || z.image; z.sensors=sensors; z.moistureHistory=history.map(h=>h.value); z.moistureHistoryPoints=history.map(h=>({ dayIndex:h.day_index, value:h.value, measuredAt:h.measuredAt })); delete z.device_status; delete z.soil_temp; delete z.last_updated; delete z.target_moisture_min; delete z.target_moisture_max; delete z.moisture_min; delete z.moisture_mid; delete z.moisture_max; delete z.irrigation_duration; delete z.estimated_water; } return result; }
function utcSqlDate(value) { const date = new Date(value); if (!value || Number.isNaN(date.getTime())) return null; return date.toISOString().slice(0, 23).replace('T', ' '); }
async function graphicsData(url) {
  const conditions = ['measured_at IS NOT NULL']; const params = [];
  const start = utcSqlDate(url.searchParams.get('start')); const end = utcSqlDate(url.searchParams.get('end'));
  if (start) { conditions.push('measured_at >= ?'); params.push(start); }
  if (end) { conditions.push('measured_at < ?'); params.push(end); }
  const zoneId = Number(url.searchParams.get('zoneId'));
  if (Number.isInteger(zoneId) && zoneId > 0) { conditions.push('zone_id = ?'); params.push(zoneId); }
  const where = conditions.join(' AND ');
  const [moisture] = await pool.query(`SELECT zone_id zoneId, value, DATE_FORMAT(measured_at, '%Y-%m-%dT%H:%i:%s.%fZ') measuredAt FROM moisture_history WHERE ${where} ORDER BY measured_at, zone_id`, params);
  const [temperature] = await pool.query(`SELECT zone_id zoneId, value, DATE_FORMAT(measured_at, '%Y-%m-%dT%H:%i:%s.%fZ') measuredAt FROM temperature_history WHERE ${where} ORDER BY measured_at, zone_id`, params);
  return { moisture, temperature };
}
async function schedules() { const [result] = await pool.query('SELECT id,zone_id zoneId,zone_name zoneName,plant,plant_type plantType,image,time_text time,duration,flow_rate flowRate,estimated_water estimatedWater,active,mode FROM schedules ORDER BY id'); for (const s of result) { const [days] = await pool.query('SELECT day_name FROM schedule_days WHERE schedule_id=?', [s.id]); s.days=days.map(d=>d.day_name); } return result; }
async function notifications() { const [r] = await pool.query('SELECT id,type,category,title,description,zone_id zoneId,zone_name zoneName,plant,plant_type plantType,moisture,threshold,image,event_date date,time_text time,is_read `read` FROM notifications ORDER BY id'); return r; }
async function history() { const [r] = await pool.query('SELECT id,event_date date,time_text time,zone_id zoneId,zone_name zoneName,plant,image,moisture_before moistureBefore,moisture_after moistureAfter,duration,water_volume waterVolume,method,status FROM history ORDER BY id DESC'); return r; }
async function appData(key) { const [r] = await pool.query('SELECT data FROM app_data WHERE data_key=?', [key]); return r[0] ? (typeof r[0].data === 'string' ? JSON.parse(r[0].data) : r[0].data) : null; }
function send(res,status,value) { res.writeHead(status,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}); res.end(value === null ? '' : JSON.stringify(value)); }
async function body(req) { let value=''; for await (const chunk of req) value+=chunk; return value ? JSON.parse(value) : {}; }

const server=http.createServer(async (req,res)=>{ if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'});return res.end();} const parts=new URL(req.url,'http://localhost').pathname.slice(5).split('/').filter(Boolean); const resource=parts[0], id=parts[1], action=parts[2]; try {
  if(req.method==='GET'){if(resource==='dashboard')return send(res,200,{zones:await zones(),graphics:await appData('graphics')});if(resource==='zone'&&id)return send(res,200,(await zones()).find(z=>String(z.id)===id)||null);if(resource==='zones')return send(res,200,await zones());if(resource==='schedules')return send(res,200,await schedules());if(resource==='notifications')return send(res,200,await notifications());if(resource==='history')return send(res,200,await history());if(resource==='graphics-data')return send(res,200,await graphicsData(new URL(req.url,'http://localhost')));if(resource==='users'){const [r]=await pool.query('SELECT id,username,email,name,role,created_at createdAt FROM users ORDER BY id');return send(res,200,r);}if(resource==='graphics'||resource==='settings')return send(res,200,await appData(resource));}
  if(req.method==='POST'&&resource==='auth'&&id==='login'){const v=await body(req);const user=await authenticate(v.username,v.password);return user?send(res,200,{user}):send(res,401,{message:'Username atau password salah.'});}
  if(req.method==='POST'&&resource==='auth'&&id==='register'){const v=await body(req);if(!v.username||!v.password)return send(res,400,{message:'Username dan password wajib diisi.'});try{const name=v.username.split(/[\s_-]+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');await createUser(v.username,v.email,v.password,name,'Operator');const user=await authenticate(v.username,v.password);return send(res,201,{user});}catch(error){if(error.code==='ER_DUP_ENTRY')return send(res,409,{message:'Username atau email sudah digunakan.'});throw error;}}
  if(req.method==='POST'&&resource==='sensor-readings'){
    const v=await body(req); const zoneId=Number(v.zoneId); const moisture=v.moisture === undefined || v.moisture === null ? null : Number(v.moisture); const soilTemp=v.soilTemp === undefined || v.soilTemp === null ? null : Number(v.soilTemp);
    if(!Number.isInteger(zoneId)||zoneId<1||(!Number.isFinite(moisture)&&!Number.isFinite(soilTemp))||(moisture !== null && (moisture < 0 || moisture > 100))||(soilTemp !== null && (soilTemp < -50 || soilTemp > 100))) return send(res,400,{message:'zoneId dan nilai sensor dalam rentang yang valid wajib diisi.'});
    const measuredAt=utcSqlDate(v.measuredAt)||new Date().toISOString().slice(0,23).replace('T',' '); const connection=await pool.getConnection();
    try { await connection.beginTransaction(); const [[zone]]=await connection.query('SELECT id FROM zones WHERE id=?',[zoneId]); if(!zone){await connection.rollback();return send(res,404,{message:'Zona tidak ditemukan.'});}
      if(Number.isFinite(moisture)){const [[last]]=await connection.query('SELECT COALESCE(MAX(day_index),-1) dayIndex FROM moisture_history WHERE zone_id=?',[zoneId]); await connection.query('INSERT INTO moisture_history (zone_id,day_index,value,measured_at) VALUES (?,?,?,?)',[zoneId,Number(last.dayIndex)+1,moisture,measuredAt]); await connection.query('UPDATE zones SET moisture=?,last_updated=? WHERE id=?',[moisture,measuredAt,zoneId]);}
      if(Number.isFinite(soilTemp)){await connection.query('INSERT INTO temperature_history (zone_id,value,measured_at) VALUES (?,?,?)',[zoneId,soilTemp,measuredAt]); await connection.query('UPDATE zones SET soil_temp=?,last_updated=? WHERE id=?',[soilTemp,measuredAt,zoneId]);}
      await connection.commit(); return send(res,201,{zoneId,measuredAt:`${measuredAt.replace(' ','T')}Z`,moisture,soilTemp});
    } catch(error) { await connection.rollback(); throw error; } finally { connection.release(); }
  }
  if(req.method==='POST'&&resource==='irrigation'&&id==='start'){const v=await body(req);const zone=(await zones()).find(z=>String(z.id)===String(v.zoneId));if(!zone)return send(res,404,{message:'Zona tidak ditemukan.'});const [[maxRow]]=await pool.query('SELECT COALESCE(MAX(id),0) maxId FROM history');const runId=Number(maxRow.maxId)+1;const now=new Date();const date=now.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});const time=now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});await pool.query('INSERT INTO history (id,event_date,time_text,zone_id,zone_name,plant,image,moisture_before,moisture_after,duration,water_volume,method,status,started_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())',[runId,date,time,zone.id,zone.name,zone.plant,zone.image,zone.moisture,null,0,0,'Manual','Berjalan']);return send(res,201,{id:runId,zoneId:zone.id,status:'Berjalan'});}
  if(req.method==='PUT'&&resource==='irrigation'&&action==='stop'&&id){const [result]=await pool.query("UPDATE history h JOIN zones z ON z.id=h.zone_id SET h.status='Selesai', h.moisture_after=z.moisture, h.duration=GREATEST(1,CEIL(TIMESTAMPDIFF(SECOND,COALESCE(h.started_at,NOW()),NOW())/60)), h.water_volume=ROUND(GREATEST(1,CEIL(TIMESTAMPDIFF(SECOND,COALESCE(h.started_at,NOW()),NOW())/60))*COALESCE(z.estimated_water/NULLIF(z.irrigation_duration,0),0),2) WHERE h.id=? AND h.status='Berjalan'",[id]);if(!result.affectedRows)return send(res,404,{message:'Sesi penyiraman tidak ditemukan atau sudah selesai.'});const [[finished]]=await pool.query('SELECT duration,water_volume FROM history WHERE id=?',[id]);return send(res,200,{id:Number(id),status:'Selesai',duration:finished.duration,waterVolume:finished.water_volume});}
  if(req.method==='PUT'&&resource==='zone'&&id){const v=await body(req);await pool.query('UPDATE zones SET name=COALESCE(?,name),plant=COALESCE(?,plant),area=COALESCE(?,area),moisture=COALESCE(?,moisture),status=COALESCE(?,status),soil_type=COALESCE(?,soil_type),water_need=COALESCE(?,water_need),target_moisture_min=COALESCE(?,target_moisture_min),target_moisture_max=COALESCE(?,target_moisture_max),moisture_min=COALESCE(?,moisture_min),moisture_max=COALESCE(?,moisture_max),irrigation_duration=COALESCE(?,irrigation_duration),image=COALESCE(?,image) WHERE id=?',[v.name,v.plant,v.area,v.moisture,v.status,v.soilType,v.waterNeed,v.targetMoistureMin,v.targetMoistureMax,v.moistureMin,v.moistureMax,v.irrigationDuration,v.image,id]);return send(res,200,(await zones()).find(z=>String(z.id)===id));}
  if(req.method==='PUT'&&resource==='users'&&id){const v=await body(req);const fields=[];const values=[];if(v.name !== undefined){fields.push('name=?');values.push(v.name);}if(v.email !== undefined){fields.push('email=?');values.push(v.email);}if(v.role !== undefined){fields.push('role=?');values.push(v.role);}if(v.password && !v.password.includes('•')){const salt=crypto.randomBytes(16).toString('hex');fields.push('password_hash=?','password_salt=?');values.push(passwordHash(v.password,salt),salt);}if(fields.length){values.push(id);await pool.query(`UPDATE users SET ${fields.join(',')} WHERE id=?`,values);}const [r]=await pool.query('SELECT id,username,email,name,role FROM users WHERE id=?',[id]);return send(res,200,r[0]||null);}
  if(req.method==='POST'&&resource==='users'){const v=await body(req);if(!v.username||!v.password)return send(res,400,{message:'Username dan password wajib diisi.'});try{const name=v.name||v.username;await createUser(v.username,v.email,v.password,name,v.role||'Operator');const [r]=await pool.query('SELECT id,username,email,name,role FROM users WHERE username=?',[v.username]);return send(res,201,r[0]);}catch(error){if(error.code==='ER_DUP_ENTRY')return send(res,409,{message:'Username atau email sudah digunakan.'});throw error;}}
  if(req.method==='POST'&&resource==='zones'){const v=await body(req);if(!v.name||!v.plant)return send(res,400,{message:'Nama zona dan tanaman wajib diisi.'});const [[maxRow]]=await pool.query('SELECT COALESCE(MAX(id),0) maxId FROM zones');const zoneId=Number(maxRow.maxId)+1;await pool.query('INSERT INTO zones (id,name,plant,moisture,status,device_status,soil_temp,last_updated,area,soil_type,water_need,target_moisture_min,target_moisture_max,moisture_min,moisture_mid,moisture_max,irrigation_duration,estimated_water,image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[zoneId,v.name,v.plant,50,'Normal','Online',24,'Baru ditambahkan',v.area||'30 m²','Lempung','Sedang',30,70,30,50,70,10,10,null]);return send(res,201,(await zones()).find(z=>z.id===zoneId));}
  if(req.method==='DELETE'&&resource==='users'&&id){if(String(id)==='1')return send(res,409,{message:'User administrator utama tidak dapat dihapus.'});await pool.query('DELETE FROM users WHERE id=?',[id]);return send(res,204,null);}
  if(req.method==='PUT'&&resource==='notification'&&id){const v=await body(req);await pool.query('UPDATE notifications SET is_read=COALESCE(?,is_read) WHERE id=?',[v.read,id]);return send(res,200,(await notifications()).find(n=>String(n.id)===id));}
  if(req.method==='PUT'&&resource==='settings'){const current=await appData('settings');const incoming=await body(req);const v={...current,...incoming,account:{...current.account,...(incoming.account||{}),password:'••••••••••••'}};await pool.query('UPDATE app_data SET data=? WHERE data_key="settings"',[JSON.stringify(v)]);return send(res,200,v);}
  if(req.method==='POST'&&resource==='schedules'){const v=await body(req);const [r]=await pool.query('INSERT INTO schedules (zone_id,zone_name,plant,plant_type,image,time_text,duration,flow_rate,estimated_water,active,mode) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[v.zoneId,v.zoneName,v.plant,v.plantType,v.image,v.time,v.duration,v.flowRate,v.estimatedWater,v.active,v.mode]);for(const d of v.days||[])await pool.query('INSERT INTO schedule_days VALUES (?,?)',[r.insertId,d]);return send(res,201,(await schedules()).find(s=>s.id===r.insertId));}
  if(req.method==='PUT'&&resource==='schedules'&&id){const v=await body(req);await pool.query('UPDATE schedules SET time_text=COALESCE(?,time_text),duration=COALESCE(?,duration),active=COALESCE(?,active),mode=COALESCE(?,mode) WHERE id=?',[v.time,v.duration,v.active,v.mode,id]);if(v.days){await pool.query('DELETE FROM schedule_days WHERE schedule_id=?',[id]);for(const d of v.days)await pool.query('INSERT INTO schedule_days VALUES (?,?)',[id,d]);}return send(res,200,(await schedules()).find(s=>String(s.id)===id));}
  if(req.method==='DELETE'&&resource==='schedules'&&id){await pool.query('DELETE FROM schedules WHERE id=?',[id]);return send(res,204,null);}send(res,404,{message:'Endpoint not found'});
 }catch(error){console.error(error);send(res,500,{message:error.message});}});

await initializeDatabase();
if(process.argv.includes('--seed-only')||process.argv.includes('--reset-only')){console.log(`Database ${dbName} berhasil dibuat dan diisi.`);await pool.end();process.exit(0);}
server.listen(apiPort,()=>console.log(`API MySQL berjalan di http://localhost:${apiPort} (database: ${dbName})`));
