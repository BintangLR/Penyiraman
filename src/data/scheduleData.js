/**
 * Data dummy jadwal penyiraman.
 * Struktur siap diganti dengan data Firebase.
 */

const FLOW_RATE = 1.2; // Liter per menit (dummy)

export const SCHEDULE_DATA = [
  {
    id: 1, zoneId: 1, zoneName: 'Zona 1', plant: 'Kopi',    plantType: 'Kopi Arabika',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70',
    time: '06:00', duration: 10, flowRate: FLOW_RATE, estimatedWater: 12,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
  {
    id: 2, zoneId: 2, zoneName: 'Zona 2', plant: 'Cabai',   plantType: 'Cabai Merah',
    image: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70',
    time: '07:00', duration: 8,  flowRate: FLOW_RATE, estimatedWater: 10,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
  {
    id: 3, zoneId: 3, zoneName: 'Zona 3', plant: 'Tomat',   plantType: 'Tomat',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70',
    time: '06:30', duration: 10, flowRate: FLOW_RATE, estimatedWater: 15,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
  {
    id: 4, zoneId: 4, zoneName: 'Zona 4', plant: 'Sawi',    plantType: 'Sawi Hijau',
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70',
    time: '08:00', duration: 8,  flowRate: FLOW_RATE, estimatedWater: 10,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
  {
    id: 5, zoneId: 5, zoneName: 'Zona 5', plant: 'Selada',  plantType: 'Selada',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70',
    time: '08:30', duration: 8,  flowRate: FLOW_RATE, estimatedWater: 10,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
  {
    id: 6, zoneId: 6, zoneName: 'Zona 6', plant: 'Terong',  plantType: 'Terong',
    image: 'https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70',
    time: '09:00', duration: 10, flowRate: FLOW_RATE, estimatedWater: 14,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
  {
    id: 7, zoneId: 7, zoneName: 'Zona 7', plant: 'Kubis',   plantType: 'Kubis',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70',
    time: '06:00', duration: 8,  flowRate: FLOW_RATE, estimatedWater: 12,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
  {
    id: 8, zoneId: 8, zoneName: 'Zona 8', plant: 'Wortel',  plantType: 'Wortel',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70',
    time: '07:30', duration: 10, flowRate: FLOW_RATE, estimatedWater: 15,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: false, mode: 'Manual',
  },
  {
    id: 9, zoneId: 9, zoneName: 'Zona 9', plant: 'Kentang', plantType: 'Kentang',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70',
    time: '09:30', duration: 10, flowRate: FLOW_RATE, estimatedWater: 12,
    days: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], active: true,  mode: 'Otomatis',
  },
];

// Dummy water usage hari ini per zona
export const WATER_USAGE_TODAY = [
  { zoneId:1, zoneName:'Zona 1 – Kopi',    used:24, color:'#10a67a' },
  { zoneId:2, zoneName:'Zona 2 – Cabai',   used:20, color:'#e55353' },
  { zoneId:3, zoneName:'Zona 3 – Tomat',   used:30, color:'#2878d6' },
  { zoneId:4, zoneName:'Zona 4 – Sawi',    used:18, color:'#f59e0b' },
  { zoneId:5, zoneName:'Zona 5 – Selada',  used:16, color:'#8b5cf6' },
  { zoneId:6, zoneName:'Zona 6 – Terong',  used:20, color:'#f97316' },
  { zoneId:7, zoneName:'Zona 7 – Kubis',   used:20, color:'#06b6d4' },
  { zoneId:8, zoneName:'Zona 8 – Wortel',  used:15, color:'#ec4899' },
  { zoneId:9, zoneName:'Zona 9 – Kentang', used:14, color:'#84cc16' },
];

export const TOTAL_USED_TODAY = WATER_USAGE_TODAY.reduce((s, z) => s + z.used, 0);
export const TOTAL_ESTIMATED  = 420;

// Riwayat terjadwal (dummy)
export const SCHEDULED_HISTORY = [
  { id:1, datetime:'20 Sep 2025 06:00', zone:'Zona 1', plant:'Kopi',   duration:'10 menit', volume:'12 Liter', status:'Selesai' },
  { id:2, datetime:'20 Sep 2025 07:00', zone:'Zona 2', plant:'Cabai',  duration:'8 menit',  volume:'10 Liter', status:'Selesai' },
  { id:3, datetime:'20 Sep 2025 06:30', zone:'Zona 3', plant:'Tomat',  duration:'10 menit', volume:'15 Liter', status:'Selesai' },
  { id:4, datetime:'20 Sep 2025 08:00', zone:'Zona 4', plant:'Sawi',   duration:'8 menit',  volume:'10 Liter', status:'Selesai' },
  { id:5, datetime:'20 Sep 2025 08:30', zone:'Zona 5', plant:'Selada', duration:'8 menit',  volume:'10 Liter', status:'Selesai' },
];

export const ALL_DAYS = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
export const ALL_ZONES = SCHEDULE_DATA.map(s => ({
  value: s.zoneId,
  label: `${s.zoneName} – ${s.plant}`,
  plant: s.plant,
  plantType: s.plantType,
  image: s.image,
}));

export const SORT_OPTIONS = [
  { value:'zone-asc',  label:'Zona 1 – 9' },
  { value:'zone-desc', label:'Zona 9 – 1' },
  { value:'time-asc',  label:'Waktu paling pagi' },
  { value:'time-desc', label:'Waktu paling malam' },
];
