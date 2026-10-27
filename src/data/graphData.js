/**
 * Data dummy untuk halaman Grafik.
 * Struktur ini mudah diganti dengan data Firebase nantinya.
 */

// ── Warna unik per zona ──────────────────────────────────────────────────────
export const ZONE_COLORS = [
  '#10a67a', // Z1 – hijau
  '#e55353', // Z2 – merah
  '#2878d6', // Z3 – biru
  '#f59e0b', // Z4 – kuning
  '#8b5cf6', // Z5 – ungu
  '#f97316', // Z6 – oranye
  '#06b6d4', // Z7 – cyan
  '#ec4899', // Z8 – pink
  '#84cc16', // Z9 – lime
  '#64748b', // avg – abu
];

// ── Label hari (7 hari) ───────────────────────────────────────────────────────
export const DAYS_7 = ['14 Sep', '15 Sep', '16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep'];

// ── Data kelembapan 7 hari per zona ──────────────────────────────────────────
export const MOISTURE_HISTORY = [
  { zoneId: 1, label: 'Zona 1', data: [42, 40, 44, 39, 38, 37, 38] },
  { zoneId: 2, label: 'Zona 2', data: [58, 61, 63, 65, 62, 60, 62] },
  { zoneId: 3, label: 'Zona 3', data: [40, 38, 37, 36, 35, 34, 35] },
  { zoneId: 4, label: 'Zona 4', data: [52, 55, 57, 56, 58, 57, 58] },
  { zoneId: 5, label: 'Zona 5', data: [62, 64, 66, 65, 67, 65, 66] },
  { zoneId: 6, label: 'Zona 6', data: [68, 70, 73, 72, 74, 71, 72] },
  { zoneId: 7, label: 'Zona 7', data: [50, 53, 55, 54, 56, 54, 55] },
  { zoneId: 8, label: 'Zona 8', data: [46, 48, 50, 49, 50, 48, 49] },
  { zoneId: 9, label: 'Zona 9', data: [57, 59, 62, 61, 63, 60, 61] },
];

// Hitung rata-rata harian
export const AVG_MOISTURE = DAYS_7.map((_, di) => {
  const sum = MOISTURE_HISTORY.reduce((acc, z) => acc + z.data[di], 0);
  return Math.round(sum / MOISTURE_HISTORY.length);
});

// ── Data penyiraman harian ───────────────────────────────────────────────────
export const WATERING_DATA = {
  labels: DAYS_7,
  count:    [5, 3, 6, 4, 5, 3, 2],   // jumlah penyiraman
  duration: [55, 35, 70, 45, 60, 35, 25], // menit
};

// ── Data suhu tanah harian ───────────────────────────────────────────────────
export const TEMPERATURE_DATA = {
  labels: DAYS_7,
  values: [24, 28, 31, 32, 27, 28, 29],
};

// ── Data zona (ringkasan) ─────────────────────────────────────────────────────
export const ZONES_SUMMARY = [
  { id:1, name:'Zona 1', plant:'Kopi',    moisture:38, status:'Kering', image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70' },
  { id:2, name:'Zona 2', plant:'Cabai',   moisture:62, status:'Normal', image:'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70' },
  { id:3, name:'Zona 3', plant:'Tomat',   moisture:35, status:'Kering', image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70' },
  { id:4, name:'Zona 4', plant:'Sawi',    moisture:58, status:'Normal', image:'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70' },
  { id:5, name:'Zona 5', plant:'Selada',  moisture:66, status:'Normal', image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70' },
  { id:6, name:'Zona 6', plant:'Terong',  moisture:72, status:'Basah',  image:'https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70' },
  { id:7, name:'Zona 7', plant:'Kubis',   moisture:55, status:'Normal', image:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70' },
  { id:8, name:'Zona 8', plant:'Wortel',  moisture:49, status:'Normal', image:'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70' },
  { id:9, name:'Zona 9', plant:'Kentang', moisture:61, status:'Normal', image:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70' },
];

// ── KPI summary ───────────────────────────────────────────────────────────────
export const KPI_DATA = [
  { id:'humidity',  icon:'💧', label:'Rata-rata Kelembapan', value:'56%',      change:'+12%', up:true,  sub:'Dari minggu lalu' },
  { id:'watering',  icon:'🚿', label:'Total Penyiraman',     value:'28 kali',  change:'+4',   up:true,  sub:'Dari minggu lalu' },
  { id:'water',     icon:'🪣', label:'Total Air Digunakan',  value:'340 Liter',change:'+12%', up:true,  sub:'Dari minggu lalu' },
  { id:'duration',  icon:'⏱', label:'Durasi Penyiraman',    value:'280 menit',change:'-8%',  up:false, sub:'Dari minggu lalu' },
];

// ── Riwayat penyiraman ────────────────────────────────────────────────────────
export const WATERING_HISTORY = [
  { datetime:'20 Sep 2025 08:15', zone:'Zona 1', plant:'Kopi',   moistureBefore:'35%', duration:'10 menit', volume:'12 Liter', status:'Selesai' },
  { datetime:'20 Sep 2025 06:30', zone:'Zona 3', plant:'Tomat',  moistureBefore:'33%', duration:'15 menit', volume:'15 Liter', status:'Selesai' },
  { datetime:'19 Sep 2025 17:20', zone:'Zona 6', plant:'Terong', moistureBefore:'45%', duration:'10 menit', volume:'14 Liter', status:'Selesai' },
  { datetime:'19 Sep 2025 15:10', zone:'Zona 2', plant:'Cabai',  moistureBefore:'42%', duration:'8 menit',  volume:'10 Liter', status:'Selesai' },
  { datetime:'19 Sep 2025 06:40', zone:'Zona 7', plant:'Kubis',  moistureBefore:'38%', duration:'10 menit', volume:'12 Liter', status:'Selesai' },
  { datetime:'18 Sep 2025 08:00', zone:'Zona 1', plant:'Kopi',   moistureBefore:'34%', duration:'12 menit', volume:'13 Liter', status:'Selesai' },
  { datetime:'18 Sep 2025 07:15', zone:'Zona 3', plant:'Tomat',  moistureBefore:'32%', duration:'14 menit', volume:'16 Liter', status:'Selesai' },
];

// ── Distribusi status zona ────────────────────────────────────────────────────
export const DISTRIBUTION_DATA = [
  { label:'Zona Kering', count:2, pct:22, color:'#e55353' },
  { label:'Zona Normal', count:5, pct:56, color:'#10a67a' },
  { label:'Zona Basah',  count:2, pct:22, color:'#2878d6' },
];

// ── Period options ────────────────────────────────────────────────────────────
export const PERIOD_OPTIONS = [
  { value:'7d',  label:'7 Hari Terakhir' },
  { value:'14d', label:'14 Hari Terakhir' },
  { value:'30d', label:'30 Hari Terakhir' },
  { value:'90d', label:'3 Bulan Terakhir' },
];

export const DATA_TYPE_OPTIONS = [
  { value:'moisture',    label:'Kelembapan Tanah' },
  { value:'temperature', label:'Suhu Tanah' },
  { value:'watering',   label:'Penyiraman' },
];

export const ZONE_OPTIONS = [
  { value:'all', label:'Semua Zona (1–9)' },
  ...Array.from({ length: 9 }, (_, i) => ({
    value: String(i + 1),
    label: `Zona ${i + 1}`,
  })),
];
