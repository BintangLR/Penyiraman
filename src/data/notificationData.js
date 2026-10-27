/**
 * Data dummy notifikasi — 22 records.
 * Struktur siap diganti dengan Firebase Realtime Database.
 */

export const NOTIFICATION_DATA = [
  // Peringatan
  { id:1,  type:'warning',  category:'Peringatan',    title:'Kelembapan Tanah Rendah',  description:'Zona 3 – Tomat (28%) di bawah ambang batas 30%',             zoneId:3, zoneName:'Zona 3', plant:'Tomat',   plantType:'Tomat Merah',  moisture:28, threshold:30,  image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70', date:'20 Sep 2025', time:'08:15', read:false },
  { id:2,  type:'watering', category:'Penyiraman',    title:'Penyiraman Selesai',        description:'Zona 1 – Kopi telah selesai disiram (12 Liter, 10 menit)',     zoneId:1, zoneName:'Zona 1', plant:'Kopi',    plantType:'Kopi Arabika', moisture:62, threshold:30,  image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70', date:'20 Sep 2025', time:'08:00', read:false },
  { id:3,  type:'schedule', category:'Penyiraman',    title:'Waktu Penyiraman',          description:'Zona 2 – Cabai akan disiram dalam 15 menit',                   zoneId:2, zoneName:'Zona 2', plant:'Cabai',   plantType:'Cabai Merah',  moisture:40, threshold:30,  image:'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70', date:'20 Sep 2025', time:'06:45', read:false },
  { id:4,  type:'normal',   category:'Kondisi Lahan', title:'Kelembapan Normal',         description:'Zona 5 – Selada (65%) dalam kondisi optimal',                  zoneId:5, zoneName:'Zona 5', plant:'Selada',  plantType:'Selada',       moisture:65, threshold:30,  image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70', date:'19 Sep 2025', time:'17:30', read:true  },
  { id:5,  type:'system',   category:'Sistem',        title:'Perangkat Online Kembali',  description:'Sensor Zona 6 – Terong sudah kembali online',                   zoneId:6, zoneName:'Zona 6', plant:'Terong',  plantType:'Terong',       moisture:55, threshold:30,  image:'https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70', date:'19 Sep 2025', time:'16:20', read:true  },
  { id:6,  type:'warning',  category:'Peringatan',    title:'Volume Air Tinggi',         description:'Zona 8 – Wortel menggunakan air lebih banyak (20 Liter)',       zoneId:8, zoneName:'Zona 8', plant:'Wortel',  plantType:'Wortel',       moisture:48, threshold:30,  image:'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70', date:'19 Sep 2025', time:'14:10', read:true  },
  { id:7,  type:'watering', category:'Penyiraman',    title:'Penyiraman Selesai',        description:'Zona 4 – Sawi telah selesai disiram (10 Liter, 8 menit)',       zoneId:4, zoneName:'Zona 4', plant:'Sawi',    plantType:'Sawi Hijau',   moisture:58, threshold:30,  image:'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70', date:'19 Sep 2025', time:'08:00', read:true  },
  { id:8,  type:'skip',     category:'Sistem',        title:'Jadwal Dilewati',           description:'Zona 7 – Kubis tidak disiram karena kelembapan cukup',          zoneId:7, zoneName:'Zona 7', plant:'Kubis',   plantType:'Kubis',        moisture:60, threshold:30,  image:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70', date:'19 Sep 2025', time:'06:00', read:true  },
  { id:9,  type:'warning',  category:'Peringatan',    title:'Kelembapan Tanah Rendah',   description:'Zona 9 – Kentang (27%) di bawah ambang batas 30%',              zoneId:9, zoneName:'Zona 9', plant:'Kentang', plantType:'Kentang',      moisture:27, threshold:30,  image:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70', date:'18 Sep 2025', time:'17:45', read:true  },
  { id:10, type:'normal',   category:'Kondisi Lahan', title:'Kelembapan Kembali Normal', description:'Zona 3 – Tomat (52%) setelah penyiraman selesai',               zoneId:3, zoneName:'Zona 3', plant:'Tomat',   plantType:'Tomat Merah',  moisture:52, threshold:30,  image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70', date:'18 Sep 2025', time:'08:45', read:true  },
  { id:11, type:'system',   category:'Sistem',        title:'Sensor Offline',            description:'Sensor Zona 2 – Cabai tidak mengirim data selama 10 menit',     zoneId:2, zoneName:'Zona 2', plant:'Cabai',   plantType:'Cabai Merah',  moisture:null, threshold:30, image:'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&q=70', date:'18 Sep 2025', time:'07:30', read:true  },
  { id:12, type:'watering', category:'Penyiraman',    title:'Penyiraman Selesai',        description:'Zona 9 – Kentang telah selesai disiram (12 Liter, 10 menit)',   zoneId:9, zoneName:'Zona 9', plant:'Kentang', plantType:'Kentang',      moisture:64, threshold:30,  image:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&q=70', date:'17 Sep 2025', time:'09:30', read:true  },
  { id:13, type:'normal',   category:'Kondisi Lahan', title:'Kondisi Optimal',           description:'Zona 1 – Kopi (68%) dalam kondisi sangat baik',                 zoneId:1, zoneName:'Zona 1', plant:'Kopi',    plantType:'Kopi Arabika', moisture:68, threshold:30,  image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&q=70', date:'17 Sep 2025', time:'08:00', read:true  },
  { id:14, type:'schedule', category:'Penyiraman',    title:'Waktu Penyiraman',          description:'Zona 5 – Selada akan disiram dalam 10 menit',                   zoneId:5, zoneName:'Zona 5', plant:'Selada',  plantType:'Selada',       moisture:38, threshold:30,  image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70', date:'17 Sep 2025', time:'07:20', read:true  },
  { id:15, type:'system',   category:'Sistem',        title:'Koneksi ESP32 Stabil',      description:'Semua sensor kembali terhubung dengan sistem',                  zoneId:null, zoneName:null, plant:null,    plantType:null,           moisture:null, threshold:null, image:null, date:'16 Sep 2025', time:'14:00', read:true  },
  { id:16, type:'watering', category:'Penyiraman',    title:'Penyiraman Selesai',        description:'Zona 6 – Terong telah selesai disiram (14 Liter, 10 menit)',    zoneId:6, zoneName:'Zona 6', plant:'Terong',  plantType:'Terong',       moisture:67, threshold:30,  image:'https://images.unsplash.com/photo-1566702438542-f7e4b7cf7c36?w=80&q=70', date:'16 Sep 2025', time:'09:00', read:true  },
  { id:17, type:'normal',   category:'Kondisi Lahan', title:'Kelembapan Normal',         description:'Zona 4 – Sawi (61%) dalam kondisi optimal',                     zoneId:4, zoneName:'Zona 4', plant:'Sawi',    plantType:'Sawi Hijau',   moisture:61, threshold:30,  image:'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=80&q=70', date:'16 Sep 2025', time:'08:30', read:true  },
  { id:18, type:'skip',     category:'Sistem',        title:'Jadwal Dilewati',           description:'Zona 5 – Selada tidak disiram karena kelembapan sudah optimal', zoneId:5, zoneName:'Zona 5', plant:'Selada',  plantType:'Selada',       moisture:66, threshold:30,  image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=70', date:'15 Sep 2025', time:'08:30', read:true  },
  { id:19, type:'warning',  category:'Peringatan',    title:'Suhu Tinggi Terdeteksi',    description:'Zona 8 – Wortel terdeteksi suhu tanah 34°C di atas batas normal',zoneId:8, zoneName:'Zona 8', plant:'Wortel',  plantType:'Wortel',       moisture:42, threshold:30,  image:'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&q=70', date:'15 Sep 2025', time:'13:00', read:true  },
  { id:20, type:'normal',   category:'Kondisi Lahan', title:'Kelembapan Normal',         description:'Zona 7 – Kubis (55%) dalam kondisi baik',                       zoneId:7, zoneName:'Zona 7', plant:'Kubis',   plantType:'Kubis',        moisture:55, threshold:30,  image:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&q=70', date:'15 Sep 2025', time:'07:00', read:true  },
  { id:21, type:'watering', category:'Penyiraman',    title:'Penyiraman Dimulai',        description:'Zona 3 – Tomat mulai disiram secara otomatis',                  zoneId:3, zoneName:'Zona 3', plant:'Tomat',   plantType:'Tomat Merah',  moisture:29, threshold:30,  image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=70', date:'14 Sep 2025', time:'06:30', read:true  },
  { id:22, type:'system',   category:'Sistem',        title:'Sistem Restart',            description:'Sistem irigasi berhasil direstart dan berjalan normal',          zoneId:null, zoneName:null, plant:null,    plantType:null,           moisture:null, threshold:null, image:null, date:'14 Sep 2025', time:'05:00', read:true  },
];

// Config kategori: icon, warna, label
export const NOTIF_TYPE_CONFIG = {
  warning:  { icon:'⚠', bg:'#fdeeee', color:'#d63f3f', label:'Peringatan'    },
  watering: { icon:'💧', bg:'#e9f3ff', color:'#2878d6', label:'Penyiraman'   },
  schedule: { icon:'⏰', bg:'#fff4e5', color:'#b45309', label:'Jadwal'       },
  normal:   { icon:'🌱', bg:'#e9f7ef', color:'#10a67a', label:'Kondisi Lahan'},
  system:   { icon:'⚙', bg:'#f3f0ff', color:'#7c3aed', label:'Sistem'       },
  skip:     { icon:'⏭', bg:'#f0f5f2', color:'#5a7a6e', label:'Sistem'       },
};

// Tab filter options
export const NOTIF_TABS = [
  { key:'all',          label:'Semua',        category:null            },
  { key:'Peringatan',   label:'Peringatan',   category:'Peringatan'   },
  { key:'Penyiraman',   label:'Penyiraman',   category:'Penyiraman'   },
  { key:'Kondisi Lahan',label:'Kondisi Lahan',category:'Kondisi Lahan'},
  { key:'Sistem',       label:'Sistem',       category:'Sistem'       },
];

export const SORT_OPTIONS = [
  { value:'newest', label:'Terbaru' },
  { value:'oldest', label:'Terlama' },
  { value:'unread', label:'Belum Dibaca' },
];
export const STATUS_OPTIONS = [
  { value:'all',    label:'Semua Status' },
  { value:'unread', label:'Belum Dibaca' },
  { value:'read',   label:'Sudah Dibaca' },
];
