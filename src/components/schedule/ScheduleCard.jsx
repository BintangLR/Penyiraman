import React from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { Pencil, MoreVertical, Copy, Trash2, Clock, Droplets } from 'lucide-react';

const ALL_DAYS = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];

/**
 * Satu baris jadwal — desktop list row + mobile card
 */
export function ScheduleCard({ schedule, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Tampilkan hari sesuai urutan Sen–Min agar tidak berubah-ubah saat data diedit.
  const selectedDays = ALL_DAYS.filter(day => schedule.days.includes(day));
  const freq = selectedDays.length === 7 ? 'Setiap hari' : selectedDays.join(', ');

  return (
    <div className={`sched-card ${schedule.active ? '' : 'sched-card-inactive'}`}>
      {/* Thumbnail */}
      <div className="sched-thumb">
        <img src={schedule.image} alt={schedule.plant} loading="lazy"
          onError={e => { e.target.style.display = 'none'; }} />
        <span className="sched-zone-badge">Z{schedule.zoneId}</span>
      </div>

      {/* Zone + plant */}
      <div className="sched-info">
        <div className="sched-zone-name">{schedule.zoneName} – {schedule.plant}</div>
        <div className="sched-plant-type">{schedule.plantType}</div>
      </div>

      {/* Time */}
      <div className="sched-col sched-time-col">
        <span className="sched-time" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={13} strokeWidth={1.8} style={{ color: '#779185', flexShrink: 0 }} />
          {schedule.time}
        </span>
        <span className="sched-freq">{freq}</span>
      </div>

      {/* Duration + water */}
      <div className="sched-col">
        <span className="sched-duration" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Droplets size={13} strokeWidth={1.8} style={{ color: '#2878d6', flexShrink: 0 }} />
          {schedule.duration} menit
        </span>
        <span className="sched-water">± {schedule.estimatedWater} Liter</span>
      </div>

      {/* Days chips */}
      <div className="sched-days">
        {ALL_DAYS.map(d => (
          <span
            key={d}
            className={selectedDays.includes(d) ? 'sched-day-chip active' : 'sched-day-chip'}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Toggle */}
      <div className="sched-col sched-toggle-col">
        <ToggleSwitch
          id={`toggle-sched-${schedule.id}`}
          checked={schedule.active}
          onChange={() => onToggle(schedule.id)}
          label={`${schedule.zoneName} ${schedule.active ? 'aktif' : 'nonaktif'}`}
        />
      </div>

      {/* Actions */}
      <div className="sched-actions" ref={menuRef}>
        <button
          className="sched-action-icon"
          onClick={() => onEdit(schedule)}
          title="Edit jadwal"
          aria-label={`Edit jadwal ${schedule.zoneName}`}
        >
          <Pencil size={15} strokeWidth={1.8} />
        </button>
        <div style={{ position: 'relative' }}>
          <button
            className="sched-action-icon"
            onClick={() => setMenuOpen(v => !v)}
            title="Opsi lainnya"
            aria-label="Opsi lainnya"
          >
            <MoreVertical size={15} strokeWidth={1.8} />
          </button>
          {menuOpen && (
            <div className="sched-dropdown">
              <button className="sched-dropdown-item" onClick={() => { onEdit(schedule); setMenuOpen(false); }}>
                <Pencil size={13} strokeWidth={1.8} style={{ marginRight: 8 }} />Edit
              </button>
              <button className="sched-dropdown-item" onClick={() => setMenuOpen(false)}>
                <Copy size={13} strokeWidth={1.8} style={{ marginRight: 8 }} />Duplikat
              </button>
              <button className="sched-dropdown-item danger" onClick={() => { onDelete(schedule.id); setMenuOpen(false); }}>
                <Trash2 size={13} strokeWidth={1.8} style={{ marginRight: 8 }} />Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
