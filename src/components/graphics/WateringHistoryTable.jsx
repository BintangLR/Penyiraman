import React from 'react';
import { WATERING_HISTORY } from '../../data/graphData';

/**
 * Tabel riwayat penyiraman 7 hari terakhir
 */
export function WateringHistoryTable({ data = WATERING_HISTORY, onViewAll }) {
  return (
    <div className="history-card">
      <div className="history-header">
        <div>
          <h2 className="history-title">Riwayat Penyiraman <span className="history-period">(7 Hari Terakhir)</span></h2>
        </div>
        <button className="text-button" onClick={onViewAll} id="btn-lihat-semua-riwayat">
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
              <th>Kelembapan Sebelum</th>
              <th>Durasi</th>
              <th>Volume Air</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="history-row">
                <td className="history-datetime">{row.datetime}</td>
                <td><strong style={{ fontSize: 11 }}>{row.zone}</strong></td>
                <td>{row.plant}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 40, height: 4, background: '#eef2ef', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: row.moistureBefore,
                        background: parseInt(row.moistureBefore) < 40 ? '#e55353' : '#10a67a',
                        borderRadius: 999,
                      }} />
                    </div>
                    <span style={{ fontSize: 11 }}>{row.moistureBefore}</span>
                  </div>
                </td>
                <td style={{ fontSize: 11 }}>{row.duration}</td>
                <td style={{ fontSize: 11 }}>{row.volume}</td>
                <td>
                  <span className="history-status-badge">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
