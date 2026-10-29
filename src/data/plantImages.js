// Plant-specific images used by the Zona menu. API-provided images remain the
// fallback so existing zone data and editing flows are not changed.
export const PLANT_IMAGE_OVERRIDES = {
  Kopi: 'https://www.nescafe.com/id/sites/default/files/styles/image_webp_conversion/public/2023-08/Daya%20Tarik%20Kopi%20Toraja%2C%20Jenis%20Kopi%20di%20Indonesia%20yang%20Melegenda_desk.jpg.webp?itok=6FRk2BaT',
  Cabai: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=600&q=80',
  Kubis: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKFctaEHI6rMMU6DLl8gGdwtWJoQMvc7x3PHIaHmfnTFouC6kcoppjDAo&s=10',
  Jagung: 'https://png.pngtree.com/thumb_back/fw800/background/20260507/pngtree-golden-cornfield-at-sunset-rural-landscape-image_21789723.webp',
  Sawi: 'https://digitani.ipb.ac.id/wp-content/uploads/2024/08/Rahel-Article-Cover-2-1024x724.png',
  Selada: 'https://asset.kompas.com/crops/IP77o50s0HFSMn04fCTMHAUDPHI=/0x0:1000x667/1200x800/data/photo/2023/03/20/64183d1651605.jpg',
};

export const PLANT_IMAGE_FALLBACKS = {
  Kopi: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkYAQ4wknDz_dkX_7d67_eGXvZOljyG1OL1K0FfXmMDZ5NQ4y1Uz31RU10&s=10',
};

export const PLANT_GALLERY_OVERRIDES = {
  Kopi: [PLANT_IMAGE_FALLBACKS.Kopi],
};

export function getPlantImage(zone) {
  return PLANT_IMAGE_OVERRIDES[zone?.plant] || zone?.image || '';
}

export function getPlantImageFallback(zone) {
  return PLANT_IMAGE_FALLBACKS[zone?.plant] || '';
}

export function getPlantGalleryImages(zone) {
  // Kopi memakai galeri terkurasi agar foto tambahan dari API yang bukan kopi
  // tidak ikut tampil pada Detail Zona 1.
  if (PLANT_GALLERY_OVERRIDES[zone?.plant]) {
    return PLANT_GALLERY_OVERRIDES[zone.plant];
  }

  return [
    ...(Array.isArray(zone?.additionalImages) ? zone.additionalImages : []),
  ];
}
