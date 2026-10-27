/**
 * Data konfigurasi zona lahan.
 * Struktur ini dirancang agar mudah diganti dengan data Firebase nantinya.
 * Admin dapat mengubah jenis tanaman, kelembapan target, dll
 * tanpa mengubah source code komponen.
 */

export const ZONES_CONFIG = [
  {
    id: 1,
    name: 'Zona 1',
    plant: 'Kopi',
    moisture: 38,
    status: 'Kering', // 'Kering' | 'Normal' | 'Basah'
    sensors: [
      { id: 'S1-1', label: 'Sensor 1', value: 35, status: 'Normal' },
      { id: 'S1-2', label: 'Sensor 2', value: 38, status: 'Normal' },
      { id: 'S1-3', label: 'Sensor 3', value: 41, status: 'Normal' },
    ],
    deviceStatus: 'Online', // 'Online' | 'Offline'
    soilTemp: 28.5,
    lastUpdated: '5 menit lalu',
    area: '30 m²',
    soilType: 'Lempung',
    waterNeed: 'Sedang',
    targetMoistureMin: 50,
    targetMoistureMax: 70,
    moistureMin: 30,
    moistureMid: 60,
    moistureMax: 80,
    irrigationDuration: 10, // menit
    estimatedWater: 12, // liter
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1509564551897-0b8e39c74e9e?w=300&q=70',
      'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=300&q=70',
    ],
    moistureHistory: [42, 39, 46, 38, 41, 35, 38],
  },
  {
    id: 2,
    name: 'Zona 2',
    plant: 'Cabai',
    moisture: 62,
    status: 'Normal',
    sensors: [
      { id: 'S2-1', label: 'Sensor 1', value: 60, status: 'Normal' },
      { id: 'S2-2', label: 'Sensor 2', value: 63, status: 'Normal' },
      { id: 'S2-3', label: 'Sensor 3', value: 63, status: 'Normal' },
    ],
    deviceStatus: 'Online',
    soilTemp: 27.2,
    lastUpdated: '3 menit lalu',
    area: '30 m²',
    soilType: 'Lempung Berpasir',
    waterNeed: 'Sedang',
    targetMoistureMin: 55,
    targetMoistureMax: 75,
    moistureMin: 30,
    moistureMid: 65,
    moistureMax: 85,
    irrigationDuration: 8,
    estimatedWater: 9,
    image: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=300&q=70',
    ],
    moistureHistory: [58, 61, 64, 59, 63, 65, 62],
  },
  {
    id: 3,
    name: 'Zona 3',
    plant: 'Tomat',
    moisture: 35,
    status: 'Kering',
    sensors: [
      { id: 'S3-1', label: 'Sensor 1', value: 33, status: 'Normal' },
      { id: 'S3-2', label: 'Sensor 2', value: 36, status: 'Normal' },
      { id: 'S3-3', label: 'Sensor 3', value: 36, status: 'Bermasalah' },
    ],
    deviceStatus: 'Online',
    soilTemp: 29.1,
    lastUpdated: '8 menit lalu',
    area: '30 m²',
    soilType: 'Lempung',
    waterNeed: 'Tinggi',
    targetMoistureMin: 60,
    targetMoistureMax: 80,
    moistureMin: 40,
    moistureMid: 70,
    moistureMax: 90,
    irrigationDuration: 15,
    estimatedWater: 18,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80',
    additionalImages: [],
    moistureHistory: [45, 40, 38, 42, 36, 37, 35],
  },
  {
    id: 4,
    name: 'Zona 4',
    plant: 'Sawi',
    moisture: 58,
    status: 'Normal',
    sensors: [
      { id: 'S4-1', label: 'Sensor 1', value: 56, status: 'Normal' },
      { id: 'S4-2', label: 'Sensor 2', value: 59, status: 'Normal' },
      { id: 'S4-3', label: 'Sensor 3', value: 59, status: 'Normal' },
    ],
    deviceStatus: 'Online',
    soilTemp: 26.8,
    lastUpdated: '2 menit lalu',
    area: '30 m²',
    soilType: 'Tanah Humus',
    waterNeed: 'Sedang',
    targetMoistureMin: 50,
    targetMoistureMax: 70,
    moistureMin: 30,
    moistureMid: 60,
    moistureMax: 80,
    irrigationDuration: 7,
    estimatedWater: 8,
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=600&q=80',
    additionalImages: [],
    moistureHistory: [52, 55, 57, 53, 59, 61, 58],
  },
  {
    id: 5,
    name: 'Zona 5',
    plant: 'Selada',
    moisture: 66,
    status: 'Normal',
    sensors: [
      { id: 'S5-1', label: 'Sensor 1', value: 64, status: 'Normal' },
      { id: 'S5-2', label: 'Sensor 2', value: 67, status: 'Normal' },
      { id: 'S5-3', label: 'Sensor 3', value: 67, status: 'Normal' },
    ],
    deviceStatus: 'Online',
    soilTemp: 25.6,
    lastUpdated: '1 menit lalu',
    area: '30 m²',
    soilType: 'Tanah Humus',
    waterNeed: 'Tinggi',
    targetMoistureMin: 60,
    targetMoistureMax: 80,
    moistureMin: 40,
    moistureMid: 70,
    moistureMax: 90,
    irrigationDuration: 6,
    estimatedWater: 7,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    additionalImages: [],
    moistureHistory: [61, 63, 65, 68, 64, 67, 66],
  },
  {
    id: 6,
    name: 'Zona 6',
    plant: 'Jagung',
    moisture: 72,
    status: 'Basah',
    sensors: [
      { id: 'S6-1', label: 'Sensor 1', value: 70, status: 'Normal' },
      { id: 'S6-2', label: 'Sensor 2', value: 73, status: 'Normal' },
      { id: 'S6-3', label: 'Sensor 3', value: 73, status: 'Normal' },
    ],
    deviceStatus: 'Online',
    soilTemp: 26.3,
    lastUpdated: '4 menit lalu',
    area: '30 m²',
    soilType: 'Lempung Berdebu',
    waterNeed: 'Tinggi',
    targetMoistureMin: 55,
    targetMoistureMax: 75,
    moistureMin: 40,
    moistureMid: 65,
    moistureMax: 85,
    irrigationDuration: 0,
    estimatedWater: 0,
    image: 'https://images.unsplash.com/photo-1601472544100-0b8e2a96e5e4?w=600&q=80',
    additionalImages: [],
    moistureHistory: [65, 68, 71, 69, 73, 74, 72],
  },
  {
    id: 7,
    name: 'Zona 7',
    plant: 'Kubis',
    moisture: 55,
    status: 'Normal',
    sensors: [
      { id: 'S7-1', label: 'Sensor 1', value: 53, status: 'Normal' },
      { id: 'S7-2', label: 'Sensor 2', value: 56, status: 'Normal' },
      { id: 'S7-3', label: 'Sensor 3', value: 56, status: 'Normal' },
    ],
    deviceStatus: 'Online',
    soilTemp: 27.0,
    lastUpdated: '6 menit lalu',
    area: '30 m²',
    soilType: 'Lempung',
    waterNeed: 'Sedang',
    targetMoistureMin: 50,
    targetMoistureMax: 70,
    moistureMin: 30,
    moistureMid: 60,
    moistureMax: 80,
    irrigationDuration: 9,
    estimatedWater: 10,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
    additionalImages: [],
    moistureHistory: [50, 53, 55, 52, 57, 54, 55],
  },
  {
    id: 8,
    name: 'Zona 8',
    plant: 'Wortel',
    moisture: 49,
    status: 'Normal',
    sensors: [
      { id: 'S8-1', label: 'Sensor 1', value: 47, status: 'Normal' },
      { id: 'S8-2', label: 'Sensor 2', value: 50, status: 'Normal' },
      { id: 'S8-3', label: 'Sensor 3', value: 50, status: 'Offline' },
    ],
    deviceStatus: 'Online',
    soilTemp: 27.8,
    lastUpdated: '7 menit lalu',
    area: '30 m²',
    soilType: 'Lempung Berpasir',
    waterNeed: 'Sedang',
    targetMoistureMin: 45,
    targetMoistureMax: 65,
    moistureMin: 30,
    moistureMid: 55,
    moistureMax: 75,
    irrigationDuration: 11,
    estimatedWater: 13,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80',
    additionalImages: [],
    moistureHistory: [46, 48, 51, 47, 50, 52, 49],
  },
  {
    id: 9,
    name: 'Zona 9',
    plant: 'Kentang',
    moisture: 61,
    status: 'Normal',
    sensors: [
      { id: 'S9-1', label: 'Sensor 1', value: 59, status: 'Normal' },
      { id: 'S9-2', label: 'Sensor 2', value: 62, status: 'Normal' },
      { id: 'S9-3', label: 'Sensor 3', value: 62, status: 'Normal' },
    ],
    deviceStatus: 'Online',
    soilTemp: 26.5,
    lastUpdated: '2 menit lalu',
    area: '30 m²',
    soilType: 'Tanah Berhumus',
    waterNeed: 'Sedang',
    targetMoistureMin: 55,
    targetMoistureMax: 75,
    moistureMin: 35,
    moistureMid: 65,
    moistureMax: 85,
    irrigationDuration: 8,
    estimatedWater: 10,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
    additionalImages: [],
    moistureHistory: [57, 59, 62, 60, 63, 64, 61],
  },
];

// Helper: get status color class
export function getStatusColor(status) {
  if (status === 'Kering') return 'danger';
  if (status === 'Basah') return 'blue';
  return 'success';
}

// Helper: get moisture bar color
export function getMoistureBarColor(status) {
  if (status === 'Kering') return '#e55353';
  if (status === 'Basah') return '#2878d6';
  return '#10a67a';
}

// Helper: generate watering recommendation
export function getWateringRecommendation(zone) {
  if (zone.status === 'Kering') {
    return {
      message: 'Tanah dalam kondisi kering. Disarankan melakukan penyiraman sekarang.',
      urgency: 'high',
      reason: `Kelembapan tanah ${zone.moisture}% berada di bawah target minimum ${zone.targetMoistureMin}%. Tanaman ${zone.plant} membutuhkan kelembapan yang cukup untuk pertumbuhan optimal.`,
    };
  }
  if (zone.status === 'Basah') {
    return {
      message: 'Tanah sudah cukup lembap. Tidak perlu penyiraman saat ini.',
      urgency: 'low',
      reason: `Kelembapan tanah ${zone.moisture}% sudah berada di atas target ${zone.targetMoistureMax}%. Penyiraman dapat ditunda.`,
    };
  }
  return {
    message: 'Kondisi tanah normal. Pantau secara berkala.',
    urgency: 'medium',
    reason: `Kelembapan tanah ${zone.moisture}% berada dalam rentang ideal ${zone.targetMoistureMin}%–${zone.targetMoistureMax}%.`,
  };
}
