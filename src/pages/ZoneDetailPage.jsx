import React from 'react';
import { useApi, api } from '../services/api';
import { ZoneStatusBadge, MoistureBar, DeviceBadge } from '../components/ZoneStatusBadge';
import { SensorCard } from '../components/SensorCard';
import { WateringRecommendation } from '../components/WateringRecommendation';
import { PlantInformation } from '../components/PlantInformation';
import { MoistureChart } from '../components/MoistureChart';
import { EditZoneModal } from '../components/EditZoneModal';
import { getPlantGalleryImages, getPlantImage, getPlantImageFallback } from '../data/plantImages';
import { ArrowLeft, Pencil, Droplets, Thermometer, Clock, Sprout } from 'lucide-react';

/**
 * Halaman detail untuk satu zona.
 * Menampilkan: info zona, sensor, rekomendasi, kontrol, grafik, edit modal.
 */
export function ZoneDetailPage({ zoneId, onBack, onZoneUpdate, onNavigate }) {
  // Data zona dibaca dari API MySQL melalui useApi.
  const { data: zone, setData: setZone, loading, error } = useApi(`/zone/${zoneId}`, null);
  const [irrigating, setIrrigating] = React.useState(false);
  const [wateringRunId, setWateringRunId] = React.useState(null);
  const [wateringSaving, setWateringSaving] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  // Data zona datang secara asynchronous. Jangan membaca zone.image sebelum API selesai.
  const [activeImg, setActiveImg] = React.useState('');
  const [imgError, setImgError] = React.useState(false);
  const [usingFallbackImage, setUsingFallbackImage] = React.useState(false);

  // Sinkronkan jika zoneId berubah
  React.useEffect(() => {
    if (zone) {
      setActiveImg(getPlantImage(zone));
      setImgError(false);
      setUsingFallbackImage(false);
    }
  }, [zoneId, zone]);

  function handleSave(updated) {
    return api.put(`/zone/${zoneId}`, updated).then(saved => {
      setZone(saved);
      setShowEdit(false);
      if (onZoneUpdate) onZoneUpdate(saved);
      return saved;
    });
  }

  async function handleWaterToggle() {
    setWateringSaving(true);
    try {
      if (!irrigating) {
        const result = await api.post('/irrigation/start', { zoneId });
        setWateringRunId(result.id);
        setIrrigating(true);
      } else if (wateringRunId) {
        await api.put(`/irrigation/${wateringRunId}/stop`, {});
        setWateringRunId(null);
        setIrrigating(false);
      }
    } catch (err) {
      window.alert(err.message || 'Kontrol penyiraman gagal disimpan.');
    } finally {
      setWateringSaving(false);
    }
  }

  if (loading) return <section className="content"><div className="empty-state">Memuat detail zona dari database...</div></section>;
  if (error || !zone) return <section className="content"><div className="empty-state">Data zona tidak ditemukan: {error}</div></section>;

  const preferredImage = getPlantImage(zone);
  const configuredFallback = getPlantImageFallback(zone);
  const fallbackImage = configuredFallback || (zone.image && zone.image !== preferredImage ? zone.image : '');
  const allImages = [preferredImage, ...getPlantGalleryImages(zone)]
    .filter(Boolean)
    .filter((image, index, images) => images.indexOf(image) === index);
  const sensors = Array.isArray(zone.sensors) ? zone.sensors : [];
  const moistureHistory = Array.isArray(zone.moistureHistory) && zone.moistureHistory.length > 1
    ? zone.moistureHistory
    : [Number(zone.moisture) || 0, Number(zone.moisture) || 0];

  return (
    <section className="content">
      {/* Back navigation */}
      <button
        className="back-btn"
        onClick={onBack}
        id="btn-back-to-zones"
      >
        <ArrowLeft size={15} strokeWidth={2} /> Zona Lahan
      </button>

      {/* Page header */}
      <div className="detail-page-header">
        <div className="detail-page-title-row">
          <div>
            <div className="eyebrow">DETAIL ZONA</div>
            <h1 style={{ marginBottom: 6 }}>{zone.name} — {zone.plant}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <ZoneStatusBadge status={zone.status} size="lg" />
              <DeviceBadge status={zone.deviceStatus} />
              <span style={{ fontSize: 10, color: '#779185' }}>
                Diperbarui {zone.lastUpdated}
              </span>
            </div>
          </div>
          <button
            id="btn-edit-zona"
            className="secondary-btn"
            onClick={() => setShowEdit(true)}
            style={{ alignSelf: 'flex-start', whiteSpace: 'nowrap', width: 'auto', gap: 6 }}
          >
            <Pencil size={14} strokeWidth={1.8} /> Edit Zona
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="detail-layout">
        {/* Left column */}
        <div className="detail-left">

          {/* Hero photo */}
          <div className="detail-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="detail-img-hero">
              {!imgError ? (
                <img
                  src={activeImg}
                  alt={`Tanaman ${zone.plant}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={() => {
                    if (fallbackImage && !usingFallbackImage) {
                      setUsingFallbackImage(true);
                      setActiveImg(fallbackImage);
                    } else {
                      setImgError(true);
                    }
                  }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%', background: '#eef8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0F8A63',
                }}><Sprout size={48} strokeWidth={1.5} /></div>
              )}
              <div className="detail-img-overlay">
                <span className="zone-badge-label">{zone.name}</span>
                <ZoneStatusBadge status={zone.status} />
              </div>
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="detail-img-thumbs">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`detail-thumb${activeImg === img ? ' active' : ''}`}
                    onClick={() => { setActiveImg(img); setImgError(false); }}
                    aria-label={`Foto ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail tanaman ${zone.plant}`}
                      onError={e => {
                        const fallback = img === fallbackImage
                          ? (zone.image && zone.image !== img ? zone.image : preferredImage)
                          : fallbackImage;
                        if (fallback && fallback !== img) {
                          e.currentTarget.onerror = () => { e.currentTarget.style.display = 'none'; };
                          e.currentTarget.src = fallback;
                        } else {
                          e.currentTarget.style.display = 'none';
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kondisi Saat Ini */}
          <div className="detail-card">
            <h3 className="detail-section-title">Kondisi Saat Ini</h3>
            <div className="condition-grid">
              <ConditionItem
                icon={<Droplets size={16} strokeWidth={1.8} />}
                label="Kelembapan Tanah"
                value={`${zone.moisture}%`}
                valueColor={zone.status === 'Kering' ? '#e55353' : zone.status === 'Basah' ? '#2878d6' : '#10a67a'}
                sub={zone.status}
              />
              <ConditionItem
                icon={<Thermometer size={16} strokeWidth={1.8} />}
                label="Suhu Tanah"
                value={`${zone.soilTemp}°C`}
                valueColor="#f59e0b"
                sub="Rata-rata"
              />
              <ConditionItem
                icon={<Clock size={16} strokeWidth={1.8} />}
                label="Terakhir Diperbarui"
                value={zone.lastUpdated}
                valueColor="#779185"
                sub="Real-time"
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <MoistureBar value={zone.moisture} status={zone.status} height={8} showLabel />
            </div>
          </div>

          {/* Grafik */}
          <MoistureChart
            history={moistureHistory}
            zoneName={zone.name}
            status={zone.status}
          />
        </div>

        {/* Right column */}
        <div className="detail-right">

          {/* Sensor cards */}
          <div className="detail-card">
            <div className="detail-card-header" style={{ marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 750, letterSpacing: '-.02em' }}>
                  Data Sensor
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 10, color: '#779185' }}>
                  {sensors.length} sensor tanah aktif
                </p>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, color: '#11855f',
                background: '#e7f7ee', padding: '3px 9px', borderRadius: 999,
              }}>
                {sensors.filter(s => s.status === 'Normal').length}/{sensors.length} Normal
              </span>
            </div>
            <div className="sensor-grid">
              {sensors.map(sensor => (
                <SensorCard key={sensor.id} sensor={sensor} />
              ))}
            </div>
          </div>

          {/* Rekomendasi penyiraman */}
          <WateringRecommendation
            zone={zone}
            irrigating={irrigating}
            setIrrigating={setIrrigating}
            onWater={handleWaterToggle}
            saving={wateringSaving}
            onSchedule={() => onNavigate && onNavigate('Jadwal')}
          />

          {/* Informasi tanaman */}
          <PlantInformation zone={zone} onEdit={() => setShowEdit(true)} />

        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <EditZoneModal
          zone={zone}
          onSave={handleSave}
          onClose={() => setShowEdit(false)}
        />
      )}
    </section>
  );
}

function ConditionItem({ icon, label, value, valueColor, sub }) {
  return (
    <div className="condition-item">
      <div className="condition-icon">{icon}</div>
      <div>
        <div className="condition-label">{label}</div>
        <div className="condition-value" style={{ color: valueColor }}>{value}</div>
        <div className="condition-sub">{sub}</div>
      </div>
    </div>
  );
}

function ZoneQuickLink({ zone, onClick }) {
  return (
    <button className="zone-quick-link" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <div className="zone-quick-badge">{zone.id}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>{zone.name}</div>
          <div style={{ fontSize: 9, color: '#779185' }}>{zone.plant} · {zone.moisture}%</div>
        </div>
      </div>
      <ZoneStatusBadge status={zone.status} />
    </button>
  );
}
