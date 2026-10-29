import React from 'react';
import { HistoryRow, HistoryMobileCard } from './HistoryRow';
import { Download, Check } from 'lucide-react';
import { Pagination } from './Pagination';

/** Tabel riwayat (desktop) + card list (mobile) + pagination */
export function HistoryTable({ data, totalItems, currentPage, perPage, onPageChange, onPerPageChange, onDetail, onExport, exportDone, loading }) {
  return (
    <div className="graph-card" style={{ padding: 0 }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: '1px solid #f0f5f2', flexWrap: 'wrap' }}>
        <div>
          <h2 className="graph-card-title">Daftar Riwayat Penyiraman</h2>
          <p className="graph-card-sub">{loading ? 'Memuat riwayat...' : `${totalItems} total record ditemukan`}</p>
        </div>
        <button
          id="btn-export-riwayat"
          className="secondary-btn"
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, padding: '8px 14px' }}
          onClick={onExport}
        >
          {exportDone 
            ? <><Check size={14} strokeWidth={2} /> Diekspor!</>
            : <><Download size={18} strokeWidth={1.8} /> Export Data</>}
        </button>
      </div>

      {/* ── Desktop table ─────────────────────────────────────────────── */}
      <div className="hist-table-wrap">
        <table className="history-table hist-table-desktop">
          <thead>
            <tr>
              <th style={{ width: 40 }}>No</th>
              <th>Tanggal &amp; Waktu</th>
              <th>Zona</th>
              <th>Jenis Tanaman</th>
              <th>Kelembapan Sebelum</th>
              <th>Durasi</th>
              <th>Volume Air</th>
              <th>Status</th>
              <th style={{ width: 50, textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} role="status" style={{ textAlign: 'center', padding: '36px 0', color: '#557267', fontSize: 12 }}>Memuat riwayat penyiraman...</td></tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px 0', color: '#95a8a0', fontSize: 12 }}>
                  Tidak ada data yang sesuai filter.
                </td>
              </tr>
            ) : data.map((row, i) => (
              <HistoryRow
                key={row.id}
                row={row}
                index={(currentPage - 1) * perPage + i + 1}
                onDetail={onDetail}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ─────────────────────────────────────────────── */}
      <div className="hist-mobile-list">
        {loading ? (
          <div role="status" style={{ textAlign: 'center', padding: '36px 0', color: '#557267', fontSize: 12 }}>Memuat riwayat penyiraman...</div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#95a8a0', fontSize: 12 }}>
            Tidak ada data yang sesuai filter.
          </div>
        ) : data.map(row => (
          <HistoryMobileCard key={row.id} row={row} onDetail={onDetail} />
        ))}
      </div>

      {/* ── Pagination ────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #f0f5f2', padding: '14px 20px' }}>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      </div>
    </div>
  );
}
