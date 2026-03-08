'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Globe, Leaf, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimingObject {
  open: string;
  close: string;
  is24h: boolean;
}

interface DayData {
  dateStr: string;       // YYYY-MM-DD
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holidayName: string | null;
  isClosed: boolean;
  timing: TimingObject | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayStr(): string {
  const d = new Date();
  return toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function shortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn(
        'w-12 h-6 rounded-full p-1 transition-all duration-300 relative flex-shrink-0',
        on ? 'bg-[#00FFCC]' : 'bg-slate-700'
      )}
    >
      <div className={cn(
        'w-4 h-4 rounded-full transition-transform duration-300',
        on ? 'translate-x-6 bg-slate-950' : 'translate-x-0 bg-white'
      )} />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScheduleCalendar() {
  const today = todayStr();
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());

  // State model per spec
  const [publicHolidays, setPublicHolidays] = useState<Record<string, string>>({});
  const [adminClosures, setAdminClosures] = useState<Set<string>>(new Set());
  const [dayTimings, setDayTimings] = useState<Record<string, TimingObject>>({});
  const [weekendDays, setWeekendDays] = useState({ saturday: true, sunday: true });
  const [declareToday, setDeclareToday] = useState(false);
  const [defaultTiming, setDefaultTiming] = useState<TimingObject>({ open: '06:00', close: '22:00', is24h: false });

  // Modal state
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [modalTiming, setModalTiming] = useState<TimingObject>({ open: '06:00', close: '22:00', is24h: false });

  // Holiday fetch with localStorage cache
  const fetchHolidays = useCallback(async (year: number) => {
    const cacheKey = `holidays_IN_${year}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setPublicHolidays(JSON.parse(cached));
      return;
    }
    try {
      const res = await fetch(`/api/holidays?year=${year}`);
      if (!res.ok) throw new Error('API request failed');
      const map = await res.json();

      localStorage.setItem(cacheKey, JSON.stringify(map));
      setPublicHolidays(map);
    } catch (e) {
      console.error('Failed to fetch holidays:', e);
    }
  }, []);

  useEffect(() => {
    fetchHolidays(currentYear);
  }, [currentYear, fetchHolidays]);

  // ─── Calendar grid generation ───────────────────────────────────────────────

  const buildGrid = (): DayData[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Mon-based: Mon=0 … Sun=6
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const cells: DayData[] = [];

    // Leading cells from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const ds = toDateStr(y, m, d);
      cells.push(makeCell(ds, d, false, y, m));
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = toDateStr(currentYear, currentMonth, d);
      cells.push(makeCell(ds, d, true, currentYear, currentMonth));
    }

    // Trailing cells to fill 6 rows (42 cells)
    let trail = 1;
    while (cells.length < 42) {
      const m = currentMonth === 11 ? 0 : currentMonth + 1;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const ds = toDateStr(y, m, trail);
      cells.push(makeCell(ds, trail, false, y, m));
      trail++;
    }

    return cells;
  };

  const makeCell = (ds: string, day: number, isCurrentMonth: boolean, y: number, m: number): DayData => {
    const dow = new Date(y, m, day).getDay(); // 0=Sun, 6=Sat
    const isWeekend = (dow === 6 && weekendDays.saturday) || (dow === 0 && weekendDays.sunday);
    const isAdminClosed = adminClosures.has(ds);
    const isDeclaredClosed = declareToday && ds === today;
    return {
      dateStr: ds,
      day,
      isCurrentMonth,
      isToday: ds === today,
      isWeekend,
      holidayName: publicHolidays[ds] ?? null,
      isClosed: isAdminClosed || isDeclaredClosed,
      timing: dayTimings[ds] ?? null,
    };
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────

  const navigate = (delta: number) => {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  // ─── Day modal ──────────────────────────────────────────────────────────────

  const openModal = (cell: DayData) => {
    setSelectedDay(cell);
    setModalClosed(cell.isClosed);
    setModalTiming(dayTimings[cell.dateStr] ?? { ...defaultTiming });
    setDayModalOpen(true);
  };

  const saveModal = () => {
    if (!selectedDay) return;
    const ds = selectedDay.dateStr;
    if (modalClosed) {
      setAdminClosures(prev => new Set([...prev, ds]));
      setDayTimings(prev => { const n = { ...prev }; delete n[ds]; return n; });
    } else {
      setAdminClosures(prev => { const n = new Set(prev); n.delete(ds); return n; });
      setDayTimings(prev => ({ ...prev, [ds]: modalTiming }));
    }
    setDayModalOpen(false);
  };

  // ─── Upcoming closures ───────────────────────────────────────────────────────

  const upcomingClosures = (() => {
    const now = new Date();
    const limit = new Date(now);
    limit.setDate(limit.getDate() + 90);
    const results: { date: string; label: string; type: 'holiday' | 'admin' }[] = [];

    const check = new Date(now);
    while (check <= limit && results.length < 6) {
      const ds = toDateStr(check.getFullYear(), check.getMonth(), check.getDate());
      const holiday = publicHolidays[ds];
      const isAdmin = adminClosures.has(ds);
      const dow = check.getDay();
      const isWknd = (dow === 6 && weekendDays.saturday) || (dow === 0 && weekendDays.sunday);
      if (!isWknd) {
        if (holiday) results.push({ date: ds, label: holiday, type: 'holiday' });
        else if (isAdmin) results.push({ date: ds, label: 'Admin Closure', type: 'admin' });
      }
      check.setDate(check.getDate() + 1);
    }
    return results;
  })();

  // ─── Cell styling ────────────────────────────────────────────────────────────

  const cellClass = (cell: DayData) => {
    if (!cell.isCurrentMonth) return 'bg-slate-950/20 border-slate-800/30 opacity-30';
    if (cell.isClosed) return 'bg-red-500/10 border-red-500/50';
    if (cell.holidayName) return 'bg-yellow-500/10 border-yellow-500/50';
    if (cell.isWeekend) return 'bg-emerald-500/5 border-emerald-500/40';
    if (cell.isToday) return 'bg-[#00FFCC]/5 border-[#00FFCC]/60';
    return 'bg-slate-900/30 border-slate-800/60';
  };

  const grid = buildGrid();

  // ─── Modal day status ────────────────────────────────────────────────────────

  const modalStatus = selectedDay
    ? selectedDay.isClosed || modalClosed ? 'Closed'
      : selectedDay.holidayName ? 'Holiday'
        : selectedDay.isWeekend ? 'Weekend'
          : 'Open'
    : 'Open';

  const statusColor = modalStatus === 'Closed' ? 'text-red-400 bg-red-500/10 border-red-500/20'
    : modalStatus === 'Holiday' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-6 h-full">

      {/* ── Calendar Column ─────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <h2 className="text-xl font-bold text-white">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#00FFCC]/20 border border-[#00FFCC]/60" />Today</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-500/10 border border-yellow-500/50" />Public Holiday</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/10 border border-red-500/50" />Closed</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/5 border border-emerald-500/40" />Weekend</span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-xs text-slate-500 uppercase font-bold py-2">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell, i) => (
            <button
              key={i}
              onClick={() => cell.isCurrentMonth && openModal(cell)}
              className={cn(
                'relative rounded-xl border text-left p-2 min-h-[80px] transition-all duration-150 group',
                cellClass(cell),
                cell.isCurrentMonth ? 'hover:brightness-125 cursor-pointer' : 'cursor-default'
              )}
            >
              <span className={cn(
                'text-sm font-bold',
                cell.isToday ? 'text-[#00FFCC]' : cell.isClosed ? 'text-red-400' : cell.holidayName ? 'text-yellow-400' : 'text-slate-300'
              )}>
                {cell.day}
              </span>

              <div className="mt-0.5 space-y-0.5">
                {cell.isClosed && (
                  <div className="text-[9px] font-bold text-red-400 flex items-center gap-0.5">
                    <span>🔴</span> Closed
                  </div>
                )}
                {!cell.isClosed && cell.holidayName && (
                  <div className="text-[9px] font-bold text-yellow-400 leading-tight truncate flex items-center gap-0.5">
                    <span>🎉</span> {cell.holidayName}
                  </div>
                )}
                {!cell.isClosed && cell.isWeekend && (
                  <div className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                    <span>🌿</span> Weekend
                  </div>
                )}
                {!cell.isClosed && cell.timing && (
                  <div className="text-[9px] text-blue-400 font-mono">
                    {cell.timing.is24h ? '24h' : `${cell.timing.open}-${cell.timing.close}`}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div className="w-[280px] flex-shrink-0 space-y-4">

        {/* Global Settings */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Globe size={16} className="text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Global Settings</div>
              <div className="text-xs text-slate-500">Facility-wide overrides</div>
            </div>
          </div>

          {/* Declare Holiday */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-white">Declare Holiday</div>
              <div className="text-xs text-slate-500">Close facility for today</div>
            </div>
            <Toggle on={declareToday} onChange={setDeclareToday} />
          </div>

          {/* Default hours */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Default Opening Hours
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Toggle
                on={defaultTiming.is24h}
                onChange={v => setDefaultTiming(p => ({ ...p, is24h: v }))}
              />
              <span className="text-sm text-slate-300">Open 24 / 7</span>
            </div>
            {!defaultTiming.is24h && (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={defaultTiming.open}
                  onChange={e => setDefaultTiming(p => ({ ...p, open: e.target.value }))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#00FFCC]/50"
                />
                <span className="text-slate-500 text-xs">to</span>
                <input
                  type="time"
                  value={defaultTiming.close}
                  onChange={e => setDefaultTiming(p => ({ ...p, close: e.target.value }))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#00FFCC]/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Weekend Days */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Leaf size={16} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Weekend Days</div>
              <div className="text-xs text-slate-500">Recurring weekend closures</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-300">Every Saturday</span>
              <Toggle on={weekendDays.saturday} onChange={v => setWeekendDays(p => ({ ...p, saturday: v }))} />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-300">Every Sunday</span>
              <Toggle on={weekendDays.sunday} onChange={v => setWeekendDays(p => ({ ...p, sunday: v }))} />
            </div>
          </div>
        </div>

        {/* Upcoming Closures */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Calendar size={16} className="text-red-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Upcoming Closures</div>
              <div className="text-xs text-slate-500">Public holidays &amp; admin closures only</div>
            </div>
          </div>

          {upcomingClosures.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No closures in the next 90 days</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingClosures.map(c => (
                <div key={c.date} className="flex items-start gap-2.5">
                  <span className={cn(
                    'w-2 h-2 rounded-full mt-1 flex-shrink-0',
                    c.type === 'holiday' ? 'bg-yellow-400' : 'bg-red-400'
                  )} />
                  <div>
                    <div className="text-sm font-medium text-white">{c.label}</div>
                    <div className="text-xs text-slate-500">{shortDate(c.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Day Modal ───────────────────────────────────────── */}
      {dayModalOpen && selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDayModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setDayModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                {formatDisplayDate(selectedDay.dateStr).split(',')[0]}
              </p>
              <h3 className="text-lg font-bold text-white mb-2">
                {formatDisplayDate(selectedDay.dateStr).replace(/^\w+,\s*/, '')}
              </h3>
              <span className={cn('text-xs font-bold px-2 py-1 rounded border', statusColor)}>
                {modalClosed ? 'Closed' : selectedDay.holidayName ? `Holiday — ${selectedDay.holidayName}` : selectedDay.isWeekend ? 'Weekend' : 'Open'}
              </span>
            </div>

            {/* Mark as Closed */}
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800 mb-4">
              <div>
                <div className="text-sm font-semibold text-white">Mark as Closed</div>
                <div className="text-xs text-slate-500">Override for this day only</div>
              </div>
              <Toggle on={modalClosed} onChange={setModalClosed} />
            </div>

            {modalClosed && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 text-xs text-red-400">
                This day will be marked as closed. Members will see the facility as unavailable.
              </div>
            )}

            {/* Opening Hours */}
            {!modalClosed && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Opening Hours for This Day
                </div>

                <div className="flex items-center gap-3">
                  <Toggle
                    on={modalTiming.is24h}
                    onChange={v => setModalTiming(p => ({ ...p, is24h: v }))}
                  />
                  <span className="text-sm text-slate-300">Open 24 Hours</span>
                </div>

                {!modalTiming.is24h && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">Opens</label>
                      <input
                        type="time"
                        value={modalTiming.open}
                        onChange={e => setModalTiming(p => ({ ...p, open: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FFCC]/50"
                      />
                    </div>
                    <div className="text-slate-600 mt-5">→</div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">Closes</label>
                      <input
                        type="time"
                        value={modalTiming.close}
                        onChange={e => setModalTiming(p => ({ ...p, close: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FFCC]/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDayModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#00FFCC] text-slate-950 hover:bg-[#00e6b8] transition-colors shadow-lg shadow-[#00FFCC]/20"
              >
                Save Hours for This Day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
