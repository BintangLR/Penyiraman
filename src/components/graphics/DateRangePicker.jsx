import React from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { safeTimezone } from '../../services/preferences';

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: safeTimezone(localStorage.getItem('ics-timezone')),
  }).format(date);
}

function monthDays(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => new Date(date.getFullYear(), date.getMonth(), index + 1)),
  ];
}

export function DateRangePicker({ startDate, endDate, onApply, buttonId }) {
  const [open, setOpen] = React.useState(false);
  const [draftStart, setDraftStart] = React.useState(startDate);
  const [draftEnd, setDraftEnd] = React.useState(endDate);
  const [visibleMonth, setVisibleMonth] = React.useState(startDate);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function openPicker() {
    setDraftStart(startDate);
    setDraftEnd(endDate);
    setVisibleMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    setOpen(true);
  }

  function selectDate(date) {
    if (!draftStart || draftEnd) {
      setDraftStart(date);
      setDraftEnd(null);
      return;
    }
    if (date < draftStart) {
      setDraftEnd(draftStart);
      setDraftStart(date);
      return;
    }
    setDraftEnd(date);
  }

  function changeMonth(amount) {
    setVisibleMonth(month => new Date(month.getFullYear(), month.getMonth() + amount, 1));
  }

  return (
    <div
      className="date-range-picker"
      ref={containerRef}
      onKeyDown={event => {
        if (event.key === 'Escape') setOpen(false);
      }}
    >
      <button
        type="button"
        id={buttonId}
        className="date-range-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => open ? setOpen(false) : openPicker()}
      >
        <CalendarDays size={18} strokeWidth={1.8} aria-hidden="true" />
        <span>{formatDate(startDate)} – {formatDate(endDate)}</span>
        <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <div className="date-range-popover" role="dialog" aria-label="Pilih rentang tanggal">
          <div className="date-picker-heading">
            <div>
              <strong>Pilih rentang tanggal</strong>
              <span>{draftStart ? formatDate(draftStart) : 'Tanggal mulai'} – {draftEnd ? formatDate(draftEnd) : 'Tanggal selesai'}</span>
            </div>
            <div className="date-picker-month-nav">
              <button type="button" aria-label="Bulan sebelumnya" onClick={() => changeMonth(-1)}>
                <ChevronLeft size={17} />
              </button>
              <strong>{new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(visibleMonth)}</strong>
              <button type="button" aria-label="Bulan berikutnya" onClick={() => changeMonth(1)}>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          <div className="date-picker-calendar">
            {WEEKDAYS.map(day => <span className="date-picker-weekday" key={day}>{day}</span>)}
            {monthDays(visibleMonth).map((date, index) => {
              if (!date) return <span className="date-picker-empty" key={`empty-${index}`} />;
              const dateKey = toDateKey(date);
              const startKey = draftStart ? toDateKey(draftStart) : '';
              const endKey = draftEnd ? toDateKey(draftEnd) : '';
              const inRange = startKey && endKey && dateKey > startKey && dateKey < endKey;
              const isSelected = dateKey === startKey || dateKey === endKey;
              const isToday = dateKey === toDateKey(new Date());
              const classes = [
                'date-picker-day',
                isSelected ? 'selected' : '',
                inRange ? 'in-range' : '',
                isToday ? 'today' : '',
              ].filter(Boolean).join(' ');
              return (
                <button
                  type="button"
                  key={dateKey}
                  className={classes}
                  aria-pressed={isSelected}
                  aria-label={formatDate(date)}
                  onClick={() => selectDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="date-picker-hint">
            {draftStart && !draftEnd ? 'Pilih tanggal selesai untuk melengkapi rentang.' : 'Pilih tanggal mulai dan selesai.'}
          </div>
          <div className="date-picker-actions">
            <button type="button" className="date-picker-cancel" onClick={() => setOpen(false)}>Batal</button>
            <button
              type="button"
              className="date-picker-apply"
              disabled={!draftStart || !draftEnd}
              onClick={() => {
                onApply(draftStart, draftEnd);
                setOpen(false);
              }}
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
