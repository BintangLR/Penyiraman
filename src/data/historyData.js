/**
 * Dummy data riwayat penyiraman.
 * Struktur ini mudah diganti dengan data Firebase nantinya.
 */

const PLANTS = [
  { zone: 1, plant: 'Kopi',    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=60&q=70' },
  { zone: 2, plant: 'Cabai',   image: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=60&q=70' },
  { zone: 3, plant: 'Tomat',   image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=60&q=70' },
  { zone: 4, plant: 'Sawi',    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=60&q=70' },
  { zone: 5, plant: 'Selada',  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=60&q=70' },
  { zone: 6, plant: 'Terong',  image: 'https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=60&q=70' },
  { zone: 7, plant: 'Kubis',   image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=60&q=70' },
  { zone: 8, plant: 'Wortel',  image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=60&q=70' },
  { zone: 9, plant: 'Kentang', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=60&q=70' },
];

function getPlant(zoneId) { return PLANTS.find(p => p.zone === zoneId); }

// 30 dummy records
export const HISTORY_DATA = [
  { id:1,  date:'20 Sep 2025', time:'08:15', zoneId:1, zoneName:'Zona 1', plant:'Kopi',    image:getPlant(1).image, moistureBefore:35, moistureAfter:62, duration:10, waterVolume:12, method:'Otomatis', status:'Selesai' },
  { id:2,  date:'20 Sep 2025', time:'06:30', zoneId:3, zoneName:'Zona 3', plant:'Tomat',   image:getPlant(3).image, moistureBefore:33, moistureAfter:61, duration:10, waterVolume:15, method:'Otomatis', status:'Selesai' },
  { id:3,  date:'19 Sep 2025', time:'17:20', zoneId:6, zoneName:'Zona 6', plant:'Terong',  image:getPlant(6).image, moistureBefore:45, moistureAfter:68, duration:10, waterVolume:14, method:'Otomatis', status:'Selesai' },
  { id:4,  date:'19 Sep 2025', time:'15:10', zoneId:2, zoneName:'Zona 2', plant:'Cabai',   image:getPlant(2).image, moistureBefore:42, moistureAfter:64, duration:8,  waterVolume:10, method:'Manual',   status:'Selesai' },
  { id:5,  date:'19 Sep 2025', time:'06:40', zoneId:7, zoneName:'Zona 7', plant:'Kubis',   image:getPlant(7).image, moistureBefore:38, moistureAfter:60, duration:10, waterVolume:12, method:'Otomatis', status:'Selesai' },
  { id:6,  date:'18 Sep 2025', time:'18:25', zoneId:5, zoneName:'Zona 5', plant:'Selada',  image:getPlant(5).image, moistureBefore:40, moistureAfter:65, duration:10, waterVolume:13, method:'Otomatis', status:'Selesai' },
  { id:7,  date:'18 Sep 2025', time:'07:10', zoneId:4, zoneName:'Zona 4', plant:'Sawi',    image:getPlant(4).image, moistureBefore:36, moistureAfter:58, duration:8,  waterVolume:10, method:'Manual',   status:'Selesai' },
  { id:8,  date:'17 Sep 2025', time:'16:05', zoneId:8, zoneName:'Zona 8', plant:'Wortel',  image:getPlant(8).image, moistureBefore:48, moistureAfter:66, duration:10, waterVolume:15, method:'Otomatis', status:'Selesai' },
  { id:9,  date:'17 Sep 2025', time:'06:20', zoneId:9, zoneName:'Zona 9', plant:'Kentang', image:getPlant(9).image, moistureBefore:44, moistureAfter:63, duration:10, waterVolume:12, method:'Otomatis', status:'Selesai' },
  { id:10, date:'16 Sep 2025', time:'17:45', zoneId:1, zoneName:'Zona 1', plant:'Kopi',    image:getPlant(1).image, moistureBefore:37, moistureAfter:60, duration:10, waterVolume:12, method:'Otomatis', status:'Selesai' },
  { id:11, date:'16 Sep 2025', time:'08:00', zoneId:3, zoneName:'Zona 3', plant:'Tomat',   image:getPlant(3).image, moistureBefore:34, moistureAfter:62, duration:12, waterVolume:16, method:'Otomatis', status:'Selesai' },
  { id:12, date:'15 Sep 2025', time:'17:30', zoneId:6, zoneName:'Zona 6', plant:'Terong',  image:getPlant(6).image, moistureBefore:43, moistureAfter:67, duration:10, waterVolume:14, method:'Otomatis', status:'Selesai' },
  { id:13, date:'15 Sep 2025', time:'07:15', zoneId:2, zoneName:'Zona 2', plant:'Cabai',   image:getPlant(2).image, moistureBefore:40, moistureAfter:63, duration:9,  waterVolume:11, method:'Manual',   status:'Selesai' },
  { id:14, date:'14 Sep 2025', time:'16:50', zoneId:5, zoneName:'Zona 5', plant:'Selada',  image:getPlant(5).image, moistureBefore:38, moistureAfter:62, duration:10, waterVolume:13, method:'Otomatis', status:'Selesai' },
  { id:15, date:'14 Sep 2025', time:'08:30', zoneId:7, zoneName:'Zona 7', plant:'Kubis',   image:getPlant(7).image, moistureBefore:35, moistureAfter:59, duration:10, waterVolume:12, method:'Otomatis', status:'Selesai' },
  { id:16, date:'13 Sep 2025', time:'17:00', zoneId:4, zoneName:'Zona 4', plant:'Sawi',    image:getPlant(4).image, moistureBefore:37, moistureAfter:57, duration:8,  waterVolume:9,  method:'Manual',   status:'Selesai' },
  { id:17, date:'13 Sep 2025', time:'07:40', zoneId:8, zoneName:'Zona 8', plant:'Wortel',  image:getPlant(8).image, moistureBefore:46, moistureAfter:64, duration:10, waterVolume:14, method:'Otomatis', status:'Selesai' },
  { id:18, date:'12 Sep 2025', time:'18:10', zoneId:9, zoneName:'Zona 9', plant:'Kentang', image:getPlant(9).image, moistureBefore:42, moistureAfter:62, duration:11, waterVolume:13, method:'Otomatis', status:'Selesai' },
  { id:19, date:'12 Sep 2025', time:'08:20', zoneId:1, zoneName:'Zona 1', plant:'Kopi',    image:getPlant(1).image, moistureBefore:33, moistureAfter:61, duration:10, waterVolume:12, method:'Otomatis', status:'Selesai' },
  { id:20, date:'11 Sep 2025', time:'17:55', zoneId:3, zoneName:'Zona 3', plant:'Tomat',   image:getPlant(3).image, moistureBefore:32, moistureAfter:60, duration:12, waterVolume:15, method:'Otomatis', status:'Selesai' },
  { id:21, date:'11 Sep 2025', time:'07:00', zoneId:2, zoneName:'Zona 2', plant:'Cabai',   image:getPlant(2).image, moistureBefore:44, moistureAfter:65, duration:8,  waterVolume:10, method:'Manual',   status:'Dibatalkan' },
  { id:22, date:'10 Sep 2025', time:'16:30', zoneId:6, zoneName:'Zona 6', plant:'Terong',  image:getPlant(6).image, moistureBefore:41, moistureAfter:66, duration:10, waterVolume:14, method:'Otomatis', status:'Selesai' },
  { id:23, date:'10 Sep 2025', time:'08:45', zoneId:5, zoneName:'Zona 5', plant:'Selada',  image:getPlant(5).image, moistureBefore:36, moistureAfter:61, duration:10, waterVolume:13, method:'Otomatis', status:'Selesai' },
  { id:24, date:'09 Sep 2025', time:'17:10', zoneId:7, zoneName:'Zona 7', plant:'Kubis',   image:getPlant(7).image, moistureBefore:39, moistureAfter:60, duration:9,  waterVolume:11, method:'Otomatis', status:'Gagal'   },
  { id:25, date:'09 Sep 2025', time:'07:20', zoneId:4, zoneName:'Zona 4', plant:'Sawi',    image:getPlant(4).image, moistureBefore:35, moistureAfter:56, duration:8,  waterVolume:9,  method:'Manual',   status:'Selesai' },
  { id:26, date:'08 Sep 2025', time:'17:40', zoneId:8, zoneName:'Zona 8', plant:'Wortel',  image:getPlant(8).image, moistureBefore:47, moistureAfter:65, duration:10, waterVolume:14, method:'Otomatis', status:'Selesai' },
  { id:27, date:'08 Sep 2025', time:'08:55', zoneId:9, zoneName:'Zona 9', plant:'Kentang', image:getPlant(9).image, moistureBefore:43, moistureAfter:63, duration:11, waterVolume:13, method:'Otomatis', status:'Selesai' },
  { id:28, date:'07 Sep 2025', time:'16:15', zoneId:1, zoneName:'Zona 1', plant:'Kopi',    image:getPlant(1).image, moistureBefore:34, moistureAfter:60, duration:10, waterVolume:12, method:'Otomatis', status:'Berjalan' },
  { id:29, date:'07 Sep 2025', time:'07:30', zoneId:3, zoneName:'Zona 3', plant:'Tomat',   image:getPlant(3).image, moistureBefore:31, moistureAfter:59, duration:13, waterVolume:16, method:'Otomatis', status:'Selesai' },
  { id:30, date:'06 Sep 2025', time:'18:00', zoneId:6, zoneName:'Zona 6', plant:'Terong',  image:getPlant(6).image, moistureBefore:40, moistureAfter:65, duration:10, waterVolume:14, method:'Otomatis', status:'Selesai' },
];

// Summary stats
export const HISTORY_SUMMARY = [
  { id:'total',   icon:'💧', value:'128 kali',    label:'Total Penyiraman',    change:'+12%', up:true,  sub:'Dari bulan lalu' },
  { id:'water',   icon:'🪣', value:'1.540 Liter', label:'Total Air Digunakan', change:'+8%',  up:true,  sub:'Dari bulan lalu' },
  { id:'duration',icon:'⏱', value:'1.280 menit', label:'Total Durasi',        change:'+6%',  up:true,  sub:'Dari bulan lalu' },
  { id:'avg',     icon:'📅', value:'18 kali',     label:'Rata-rata per Hari',  change:'+10%', up:true,  sub:'Dari bulan lalu' },
];

// Filter options
export const ZONE_OPTIONS = [
  'Semua Zona', 'Zona 1', 'Zona 2', 'Zona 3', 'Zona 4', 'Zona 5', 'Zona 6', 'Zona 7', 'Zona 8', 'Zona 9',
];
export const PLANT_OPTIONS = [
  'Semua Tanaman', 'Kopi', 'Cabai', 'Tomat', 'Sawi', 'Selada', 'Terong', 'Kubis', 'Wortel', 'Kentang',
];
export const STATUS_OPTIONS = [
  'Semua Status', 'Selesai', 'Berjalan', 'Gagal', 'Dibatalkan',
];
export const PER_PAGE_OPTIONS = [10, 20, 30];
