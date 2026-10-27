import React from 'react';

/** Tabel riwayat penyiraman terjadwal di bagian bawah halaman */
export function ScheduledHistory({ history = [], onViewAll }) {
  const scheduled = history.filter(row => row.method === 'Otomatis').slice(0, 10).map(row => ({
    id: row.id,
    datetime: `${row.date} ${row.time}`,
    zone: row.zoneName,
    plant: row.plant,
    duration: `${row.duration ?? 0} menit`,
    volume: `${row.waterVolume ?? 0} Liter`,
    status: row.status,
  }));
  return (
    <div className="history-card" style={{ marginTop: 20 }}>
      <div className="history-header">
        <div>
          <h2 className="history-title">Riwayat Penyiraman Terjadwal</h2>
          <p style={{ margin: '3px 0 0', fontSize: 10, color: '#779185' }}>
            Aktivitas penyiraman dari jadwal otomatis
          </p>
        </div>
        <button className="text-button" onClick={onViewAll} id="btn-lihat-semua-jadwal">
          Lihat Semua →
        </button>
      </div>
      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>Tanggal &amp; Waktu</th>
              <th>Zona</th>
              <th>Jenis Tanaman</th>
              <th>Durasi</th>
              <th>Volume Air</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduled.map(row => (
              <tr key={row.id} className="history-row">
                <td className="history-datetime">{row.datetime}</td>
                <td><strong style={{ fontSize: 11 }}>{row.zone}</strong></td>
                <td style={{ fontSize: 11 }}>{row.plant}</td>
                <td style={{ fontSize: 11 }}>{row.duration}</td>
                <td style={{ fontSize: 11 }}>{row.volume}</td>
                <td><span className="history-status-badge">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
