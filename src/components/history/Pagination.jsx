import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PER_PAGE_OPTIONS } from '../../data/historyData';

/**
 * Komponen pagination interaktif.
 * Props: currentPage, totalItems, perPage, onPageChange, onPerPageChange
 */
export function Pagination({ currentPage, totalItems, perPage, onPageChange, onPerPageChange }) {
  const totalPages = Math.ceil(totalItems / perPage);
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalItems);

  // Build page numbers to display
  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="pagination-bar">
      <span className="pagination-info">
        Menampilkan <strong>{from}–{to}</strong> dari <strong>{totalItems}</strong> data
      </span>

      <div className="pagination-controls">
        {/* Prev */}
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>

        {/* Pages */}
        {getPages().map((p, i) =>
          p === '...'
            ? <span key={`dots-${i}`} className="page-dots">...</span>
            : <button
                key={p}
                className={currentPage === p ? 'page-btn active' : 'page-btn'}
                onClick={() => onPageChange(p)}
                aria-label={`Halaman ${p}`}
                aria-current={currentPage === p ? 'page' : undefined}
              >
                {p}
              </button>
        )}

        {/* Next */}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Per-page selector */}
      <div className="per-page-wrap">
        <select
          id="per-page-select"
          className="hist-filter-select"
          style={{ width: 'auto', padding: '6px 28px 6px 10px' }}
          value={perPage}
          onChange={e => { onPerPageChange(Number(e.target.value)); onPageChange(1); }}
        >
          {PER_PAGE_OPTIONS.map(n => (
            <option key={n} value={n}>{n} per halaman</option>
          ))}
        </select>
      </div>
    </div>
  );
}
