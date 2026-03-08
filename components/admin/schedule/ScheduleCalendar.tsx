'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Globe, Leaf, Calendar, Plus, Trash2, Edit2, KeySquare, Settings2, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimingObject {
  open: string;
  close: string;
  is24h: boolean;
}

interface EventData {
  id: number;
  title: string;
  type: 'class' | 'event' | 'workshop';
  startTime: string;
  endTime: string;
  instructor?: string;
  capacity?: string;
  dateStr?: string;
}

interface DayData {
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holidayName: string | null;
  isClosed: boolean;
  closureReason: string;
  timing: TimingObject;
  events: EventData[];
  isDraftChosen: boolean;
  isBulkChosen: boolean;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const EVENT_TYPES = [
  { id: 'class', label: 'Class', color: 'text-purple-400', bg: 'bg-purple-400/15', border: 'border-purple-400/30', hex: '#a78bfa' },
  { id: 'event', label: 'Event', color: 'text-orange-400', bg: 'bg-orange-400/15', border: 'border-orange-400/30', hex: '#fb923c' },
  { id: 'workshop', label: 'Workshop', color: 'text-pink-400', bg: 'bg-pink-400/15', border: 'border-pink-400/30', hex: '#f472b6' },
] as const;

function getET(id: string) { return EVENT_TYPES.find((t) => t.id === id) || EVENT_TYPES[0]; }

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function fmtDate(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }
function todayStr() { const t = new Date(); return fmtDate(t.getFullYear(), t.getMonth(), t.getDate()); }
function tomorrowStr() { const t = new Date(); t.setDate(t.getDate() + 1); return fmtDate(t.getFullYear(), t.getMonth(), t.getDate()); }
function thisWeekDates() {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push(fmtDate(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  return out;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={cn('w-11 h-6 rounded-full p-1 transition-all duration-200 relative flex-shrink-0', value ? 'bg-green-600' : 'bg-slate-700')}>
      <div className={cn('w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm', value ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  );
}

export default function ScheduleCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [publicHolidays, setPublicHolidays] = useState<Record<string, string>>({});
  const [markedHolidays, setMarkedHolidays] = useState<Set<string>>(new Set());
  const [adminClosures, setAdminClosures] = useState<Record<string, { reason: string }>>({});
  const [dayTimings, setDayTimings] = useState<Record<string, TimingObject>>({});
  const [weekendDays, setWeekendDays] = useState({ saturday: true, sunday: true });
  const [operationalMode, setOperationalMode] = useState<'flexible' | '24_7'>('flexible');
  const [defaultTiming, setDefaultTiming] = useState<TimingObject>({ open: '06:00', close: '22:00', is24h: false });
  const [events, setEvents] = useState<Record<string, EventData[]>>({});
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [holidaySelectMode, setHolidaySelectMode] = useState(false);
  const [holidayDraft, setHolidayDraft] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'this_week'>('today');
  const [editingOpMode, setEditingOpMode] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(`/api/holidays?year=${currentYear}`);
        if (res.ok) {
          const map = await res.json();
          setPublicHolidays(map);
        }
      } catch (e) { console.error('Failed to fetch holidays:', e); }
    };
    fetchHolidays();
  }, [currentYear]);

  const isWeekendFn = (y: number, m: number, d: number) => {
    const dow = new Date(y, m, d).getDay();
    return (weekendDays.saturday && dow === 6) || (weekendDays.sunday && dow === 0);
  };
  const isTodayFn = (y: number, m: number, d: number) => y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
  const prevMonth = () => { currentMonth === 0 ? (setCurrentMonth(11), setCurrentYear((y) => y - 1)) : setCurrentMonth((m) => m - 1); };
  const nextMonth = () => { currentMonth === 11 ? (setCurrentMonth(0), setCurrentYear((y) => y + 1)) : setCurrentMonth((m) => m + 1); };

  const enterHolidayMode = () => { setHolidayDraft(new Set(markedHolidays)); setHolidaySelectMode(true); setBulkMode(false); setBulkSelected(new Set()); };
  const confirmHolidayMode = () => { setMarkedHolidays(new Set(holidayDraft)); setHolidaySelectMode(false); };
  const cancelHolidayMode = () => { setHolidaySelectMode(false); setHolidayDraft(new Set()); };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const ds = fmtDate(currentYear, currentMonth, day);

    if (holidaySelectMode) {
      if (!publicHolidays[ds]) return;
      setHolidayDraft((prev) => { const n = new Set(prev); n.has(ds) ? n.delete(ds) : n.add(ds); return n; });
      return;
    }

    if (bulkMode) {
      setBulkSelected((prev) => { const n = new Set(prev); n.has(ds) ? n.delete(ds) : n.add(ds); return n; });
      return;
    }

    setSelectedDay({
      day, ds, publicHolidayName: publicHolidays[ds], isAdminClosed: !!adminClosures[ds] || markedHolidays.has(ds),
      closureReason: adminClosures[ds]?.reason || (markedHolidays.has(ds) ? publicHolidays[ds] : ''),
      isWeekend: isWeekendFn(currentYear, currentMonth, day),
      dow: new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'long' }),
      timing: dayTimings[ds] || { ...defaultTiming, is24h: operationalMode === '24_7' }, dayEvents: events[ds] || [],
    });
    setDayModalOpen(true);
  };

  const toggleClosure = (ds: string, reason: string) => {
    if (markedHolidays.has(ds)) {
      setMarkedHolidays((prev) => { const n = new Set(prev); n.delete(ds); return n; });
      return;
    }
    setAdminClosures((prev) => { const n = { ...prev }; n[ds] ? delete n[ds] : (n[ds] = { reason: reason || '' }); return n; });
  };

  const applyBulkClose = (reason: string) => {
    setAdminClosures((prev) => { const n = { ...prev }; bulkSelected.forEach((d) => { n[d] = { reason: reason || '' }; }); return n; });
    setBulkSelected(new Set()); setBulkMode(false); setBulkModalOpen(false);
  };

  const saveEvent = (ds: string, ev: EventData) => { setEvents((p) => ({ ...p, [ds]: [...(p[ds] || []), { ...ev, id: Date.now() }] })); };
  const deleteEvent = (ds: string, id: number) => { setEvents((p) => ({ ...p, [ds]: (p[ds] || []).filter((e) => e.id !== id) })); };

  const upcomingClosures = (() => {
    const list = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const ds = fmtDate(d.getFullYear(), d.getMonth(), d.getDate());
      if (markedHolidays.has(ds)) list.push({ ds, name: publicHolidays[ds], type: 'holiday', date: d });
      else if (adminClosures[ds]) list.push({ ds, name: adminClosures[ds].reason || 'Admin Closure', type: 'admin', date: d });
      if (list.length >= 5) break;
    }
    return list;
  })();

  const todayEvts = events[todayStr()] || [];
  const tomorrowEvts = events[tomorrowStr()] || [];
  const weekEvts = thisWeekDates().flatMap((d) => (events[d] || []).map((e) => ({ ...e, dateStr: d })));
  const cells = getMonthGrid(currentYear, currentMonth);
  const holidaysThisMonth = cells.filter((d) => d && publicHolidays[fmtDate(currentYear, currentMonth, d)]).length;

  const getCellMeta = (day: number | null) => {
    if (!day) return {};
    const ds = fmtDate(currentYear, currentMonth, day);
    const isAdmin = !!adminClosures[ds];
    const isHolMark = markedHolidays.has(ds);
    const isHolRaw = !!publicHolidays[ds] && !isHolMark;
    const isWknd = isWeekendFn(currentYear, currentMonth, day);
    const isTodayC = isTodayFn(currentYear, currentMonth, day);
    const isBulk = bulkSelected.has(ds);
    const isHolDraftChosen = holidayDraft.has(ds);
    const isHolInMode = holidaySelectMode && !!publicHolidays[ds];

    if (isBulk) return { border: 'border-blue-400', bg: 'bg-blue-400/15', text: 'text-blue-200', dashed: false };
    if (isAdmin) return { border: 'border-red-400', bg: 'bg-red-400/15', text: 'text-red-200', dashed: false };

    if (holidaySelectMode) {
      if (!publicHolidays[ds]) return { border: 'border-[#1e2a3a]', bg: 'bg-[#1a2235]', text: 'text-slate-400', dashed: false, dimmed: true };
      if (isHolDraftChosen) return { border: 'border-amber-400', bg: 'bg-amber-400/20', text: 'text-amber-200', dashed: false, selectable: true };
      return { border: 'border-amber-400', bg: 'bg-amber-400/5', text: 'text-amber-700', dashed: true, selectable: true, pulse: true };
    }

    if (isHolMark) return { border: 'border-amber-500', bg: 'bg-amber-500/15', text: 'text-amber-200', dashed: false };
    if (isHolRaw) return { border: 'border-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-700', dashed: true };
    if (isWknd) return { border: 'border-emerald-400', bg: 'bg-emerald-400/10', text: 'text-emerald-300', dashed: false };
    if (isTodayC) return { border: 'border-purple-400', bg: 'bg-purple-400/15', text: 'text-purple-200', dashed: false };
    return { border: 'border-[#1e2a3a]', bg: 'bg-[#1a2235]', text: 'text-slate-400', dashed: false };
  };
  return (
    <div className="flex gap-5 p-6 bg-[#0d1117] min-h-screen text-slate-200 font-sans">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); } 50% { box-shadow: 0 0 0 6px rgba(245,158,11,0.28); } }
        .hol-pulse { animation: pulseGlow 1.8s ease-in-out infinite; }
        .hol-pulse:hover { transform: scale(1.07) !important; filter: brightness(1.4) !important; z-index: 2; position: relative; }
        .day-cell:hover { filter: brightness(1.2); }
      `}</style>

      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-[#161b27] rounded-2xl px-6 py-4 border border-[#1e2a3a] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <div>
              <div className="font-bold text-lg">
                {MONTHS[currentMonth]} {currentYear}
              </div>
              <div className="text-xs text-slate-500">Manage facility timings, closures and holidays</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {bulkMode && bulkSelected.size > 0 && (
              <button onClick={() => setBulkModalOpen(true)} className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                Mark Closed 
              </button>
            )}
            {bulkMode && (
              <button onClick={() => { setBulkMode(false); setBulkSelected(new Set()); }} className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-800 transition-colors">
                Cancel
              </button>
            )}
            <button onClick={prevMonth} className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextMonth} className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Holiday select banner */}
        {holidaySelectMode && (
          <div className="bg-amber-500/10 border border-amber-500 rounded-xl p-4 flex items-center justify-between animate-[fadeIn_0.2s_ease]">
            <div>
              <div className="font-bold text-sm text-amber-200 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Select holidays to mark closed</div>
              <div className="text-xs text-amber-700/80 mt-1">Click glowing cells on the calendar  {holidayDraft.size} selected  {holidaysThisMonth} holidays this month</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setHolidayDraft(new Set(Object.keys(publicHolidays)))} className="px-3 py-1.5 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/20 text-xs font-semibold transition-colors">All</button>
              <button onClick={() => setHolidayDraft(new Set())} className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-800 text-xs transition-colors">None</button>
              <button onClick={confirmHolidayMode} className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-900 text-xs font-bold hover:bg-amber-600 transition-colors">Apply</button>
              <button onClick={cancelHolidayMode} className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:bg-slate-800 text-xs transition-colors content-center justify-center flex items-center"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="bg-[#161b27] rounded-2xl p-6 border border-[#1e2a3a] flex-1">
          <div className="flex max-w-full flex-wrap gap-3 mb-4 items-center">
            {[
              { color: 'border-purple-400', bg: 'bg-purple-400', label: 'Today', dashed: false },
              { color: 'border-amber-500', bg: 'bg-amber-500', label: 'Holiday (closed)', dashed: false },
              { color: 'border-amber-500', bg: 'transparent', label: 'Holiday (open)', dashed: true },
              { color: 'border-red-400', bg: 'bg-red-400', label: 'Closed', dashed: false },
              { color: 'border-emerald-400', bg: 'bg-emerald-400', label: 'Weekend', dashed: false },
              { color: 'border-purple-400', bg: 'bg-purple-400', label: 'Class', dashed: false },
              { color: 'border-orange-400', bg: 'bg-orange-400', label: 'Event', dashed: false },
              { color: 'border-pink-400', bg: 'bg-pink-400', label: 'Workshop', dashed: false },
            ].map(({ color, bg, label, dashed }) => (
              <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className={cn('w-2 h-2 rounded-sm', dashed ? `border-[1.5px] border-dashed ${color}` : bg)} />
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (<div key={d} className="text-center text-[10px] text-[#2d3f55] font-bold py-1 tracking-wide">{d}</div>))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} className="min-h-[80px]" />;
              const ds = fmtDate(currentYear, currentMonth, day);
              const meta: any = getCellMeta(day);
              const isHolRaw = !!publicHolidays[ds] && !markedHolidays.has(ds);
              const isHolMark = markedHolidays.has(ds);
              const isAdmin = !!adminClosures[ds];
              const isWknd = isWeekendFn(currentYear, currentMonth, day);
              const isTodayC = isTodayFn(currentYear, currentMonth, day);
              const dayEvts = events[ds] || [];
              const timing = dayTimings[ds] || defaultTiming;
              const hasCustomT = !!dayTimings[ds];
              const isBulkSel = bulkSelected.has(ds);
              const isHolInMode = holidaySelectMode && !!publicHolidays[ds];
              const isHolDraftOn = holidayDraft.has(ds);

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'rounded-xl p-2 min-h-[80px] flex flex-col gap-0.5 relative transition-all duration-150',
                    isHolInMode ? 'hol-pulse cursor-pointer' : (holidaySelectMode ? 'cursor-default' : 'cursor-pointer day-cell'),
                    meta.dashed ? `border-[1.5px] border-dashed ${meta.border}` : `border-[1.5px] border-solid ${meta.border || 'border-[#1e2a3a]'}`,
                    meta.bg || 'bg-[#1a2235]',
                    (holidaySelectMode && !publicHolidays[ds]) && 'opacity-35'
                  )}
                >
                  {isBulkSel && (<div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white"><Check className="w-2.5 h-2.5" /></div>)}
                  {isHolInMode && (
                    <div className={cn('absolute top-1 right-1 w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-bold transition-all', isHolDraftOn ? 'border-2 border-amber-500 bg-amber-500 text-slate-900' : 'border-2 border-slate-600 bg-transparent')}>
                      {isHolDraftOn && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                    </div>
                  )}

                  <span className={cn('text-[13px] leading-none', isTodayC ? 'font-bold' : 'font-medium', meta.text || 'text-slate-300')}>{day}</span>

                  {isHolMark && !holidaySelectMode && (<span className="text-[8px] text-amber-500 leading-[1.3] line-clamp-2 mt-0.5"> {publicHolidays[ds]}</span>)}
                  {isHolRaw && !holidaySelectMode && (<span className="text-[8px] text-amber-900 leading-[1.2] mt-0.5 overflow-hidden whitespace-nowrap text-ellipsis"> {publicHolidays[ds]}</span>)}
                  {isHolInMode && (<span className={cn('text-[8px] leading-[1.3] line-clamp-2 mt-0.5', isHolDraftOn ? 'text-amber-200' : 'text-amber-900/80')}> {publicHolidays[ds]}</span>)}
                  {isAdmin && (<span className="text-[8px] text-red-300 leading-[1.2] mt-0.5 overflow-hidden whitespace-nowrap text-ellipsis"> {adminClosures[ds]?.reason || 'Closed'}</span>)}
                  {isWknd && !isAdmin && !isHolMark && !isHolRaw && (<span className="text-[8px] text-emerald-300 leading-[1.2] mt-0.5"> Weekend</span>)}
                  {isTodayC && !isAdmin && !isHolMark && (<span className="text-[8px] text-purple-300 leading-[1.2] mt-0.5">Today</span>)}
                  {hasCustomT && !isAdmin && !isHolMark && (<span className="text-[7.5px] text-sky-400 mt-0.5">{timing.is24h ? '24h' : `${timing.open}–${timing.close}`}</span>)}
                  
                  {dayEvts.length > 0 && (
                    <div className="flex gap-0.5 mt-auto flex-wrap">
                      {dayEvts.slice(0, 3).map((ev) => {
                        const et = getET(ev.type);
                        return <div key={ev.id} className={cn('w-1.5 h-1.5 rounded-full', et.bg.replace('/15', ''), et.border && et.bg ? '' : 'bg-purple-400')} style={{backgroundColor: et.hex}} />
                      })}
                      {dayEvts.length > 3 && <span className="text-[7px] text-slate-500">+{dayEvts.length - 3}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* RIGHT SIDEBAR */}
      <div className="w-[300px] flex flex-col gap-3.5">
        {/* Global Settings */}
        <div className="bg-[#161b27] rounded-2xl p-4 border border-[#1e2a3a]">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#1e2a3a]">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><Globe className="w-4 h-4" /></div>
            <div>
              <div className="font-bold text-sm">Global Settings</div>
              <div className="text-[10px] text-slate-500">Facility-wide defaults</div>
            </div>
          </div>
          
          <div className="bg-[#1a2235] rounded-xl p-3 border border-[#1e2a3a]">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-0.5 font-semibold">Operational Mode</div>
                <div className="text-sm font-bold text-slate-200">{operationalMode === '24_7' ? '24 / 7 Open' : 'Flexible Hours'}</div>
              </div>
              <button onClick={() => setEditingOpMode((v) => !v)} className={cn('w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors', editingOpMode ? 'border-blue-400/50 bg-[#1e3a5f] text-blue-400' : 'border-slate-700 bg-slate-900 text-slate-500')} title="Edit mode"><Edit2 className="w-3.5 h-3.5" /></button>
            </div>

            {editingOpMode && (
              <div className="mt-3 flex flex-col gap-2 animate-[fadeIn_0.18s_ease]">
                {[
                  { id: 'flexible', label: 'Flexible Hours', desc: 'Set open & close times', icon: '' },
                  { id: '24_7', label: '24 / 7 Open', desc: 'Always open, no time limit', icon: '' },
                ].map((opt) => (
                  <div key={opt.id} onClick={() => { setOperationalMode(opt.id as 'flexible' | '24_7'); setEditingOpMode(false); }} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-150', operationalMode === opt.id ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-900 hover:border-slate-600')}>
                    <span className="text-base">{opt.icon}</span>
                    <div className="flex-1">
                      <div className={cn('text-[13px] font-semibold', operationalMode === opt.id ? 'text-green-500' : 'text-slate-200')}>{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </div>
                    {operationalMode === opt.id && <Check className="w-4 h-4 text-green-500" />}
                  </div>
                ))}
              </div>
            )}

            {!editingOpMode && operationalMode === 'flexible' && (
              <div className="mt-3 flex gap-2 items-center">
                <input type="time" value={defaultTiming.open} onChange={(e) => setDefaultTiming((p) => ({ ...p, open: e.target.value }))} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500" />
                <span className="text-slate-600 text-xs font-semibold">to</span>
                <input type="time" value={defaultTiming.close} onChange={(e) => setDefaultTiming((p) => ({ ...p, close: e.target.value }))} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500" />
              </div>
            )}
            {!editingOpMode && operationalMode === '24_7' && (
              <div className="mt-2.5 text-[11px] text-green-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Gym open around the clock. Per-day hours can still be set by clicking any date.</div>
            )}
          </div>
        </div>

        {/* Weekend Days */}
        <div className="bg-[#161b27] rounded-2xl p-4 border border-[#1e2a3a]">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#1e2a3a]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Leaf className="w-4 h-4" /></div>
            <div>
              <div className="font-bold text-sm">Weekend Days</div>
              <div className="text-[10px] text-slate-500">Recurring weekend closures</div>
            </div>
          </div>
          {[
            { label: 'Every Saturday', key: 'saturday' as const },
            { label: 'Every Sunday', key: 'sunday' as const },
          ].map(({ label, key }) => (
            <div key={key} className="flex justify-between items-center bg-[#1a2235] rounded-xl px-3 py-2.5 mb-2 border border-[#1e2a3a] last:mb-0">
              <span className="text-[13px] font-medium text-slate-300">{label}</span>
              <Toggle value={weekendDays[key]} onChange={(v) => setWeekendDays((p) => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </div>

        {/* Manage Days */}
        <div className="bg-[#161b27] rounded-2xl p-4 border border-[#1e2a3a]">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#1e2a3a]">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400"><Settings2 className="w-4 h-4" /></div>
            <div>
              <div className="font-bold text-sm">Manage Days</div>
              <div className="text-[10px] text-slate-500">Bulk actions & holiday control</div>
            </div>
          </div>

          <button onClick={enterHolidayMode} className={cn('w-full p-3 rounded-xl border flex items-center justify-between mb-2 transition-all duration-150', holidaySelectMode ? 'border-amber-500 bg-amber-500/10 text-amber-200' : 'border-slate-700 bg-[#1a2235] text-slate-200 hover:border-slate-500')}>
            <div className="flex items-center gap-2.5"><span className="text-lg"></span><div className="text-left"><div className="text-[13px] font-semibold">Choose Holidays</div><div className="text-[10px] text-slate-500 mt-0.5">{holidaySelectMode ? 'Select on calendar  Apply' : `${markedHolidays.size} of ${Object.keys(publicHolidays).length} marked closed`}</div></div></div>
            <ChevronRight className={cn('w-4 h-4', holidaySelectMode ? 'text-amber-500 opacity-0' : 'text-slate-500')} />
          </button>

          <button onClick={() => setBulkMode(!bulkMode)} className={cn('w-full p-3 rounded-xl border flex items-center justify-between mb-2 transition-all duration-150', bulkMode ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-700 bg-[#1a2235] text-slate-200 hover:border-slate-500')}>
            <div className="flex items-center gap-2.5"><span className="text-lg"></span><div className="text-left"><div className="text-[13px] font-semibold">Bulk Select Days</div><div className="text-[10px] text-slate-500 mt-0.5">{bulkMode ? 'Select days to mark closed' : 'Quickly mark multiple days closed'}</div></div></div>
            <ChevronRight className={cn('w-4 h-4', bulkMode ? 'text-blue-500 opacity-0' : 'text-slate-500')} />
          </button>

          {upcomingClosures.length > 0 && (
            <div className="mt-3.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Upcoming Closures</div>
              <div className="flex flex-col gap-1.5">
                {upcomingClosures.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300 font-medium">{c.date.getDate()} {MONTHS[c.date.getMonth()].slice(0, 3)}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={c.name}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* What's Happening */}
        <div className="bg-[#161b27] rounded-2xl border border-[#1e2a3a] overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-[#1e2a3a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><Sparkles className="w-4 h-4" /></div>
              <div><div className="font-bold text-sm">What's Happening</div><div className="text-[10px] text-slate-500">Upcoming events & classes</div></div>
            </div>
            <div className="flex gap-1 mt-4 p-[3px] bg-slate-900 rounded-lg">
              {(['today', 'tomorrow', 'this_week'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex-1 py-1.5 text-xs rounded-md text-center transition-all', activeTab === tab ? 'bg-slate-700 text-slate-100 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-300')}>
                  {tab === 'today' ? 'Today' : tab === 'tomorrow' ? 'Tomorrow' : 'Week'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'today' && <EventList evts={todayEvts} emptyMsg="No events scheduled for today." />}
            {activeTab === 'tomorrow' && <EventList evts={tomorrowEvts} emptyMsg="No events scheduled for tomorrow." />}
            {activeTab === 'this_week' && <EventList evts={weekEvts} emptyMsg="No events scheduled this week." />}
            <div className="mt-4 text-center">
              <button onClick={() => handleDayClick(new Date().getDate())} className="text-xs text-blue-400 hover:text-blue-300 transition-colors w-full p-2 rounded-lg border border-dashed border-blue-400/30 hover:bg-blue-400/10">+ Add Event Today</button>
            </div>
          </div>
        </div>
      </div>

      {/* Day Modal */}
      {dayModalOpen && selectedDay && (
        <DayModal
          {...selectedDay}
          dateStr={selectedDay.ds}
          onClose={() => setDayModalOpen(false)}
          onCloseDay={(reason: string) => toggleClosure(selectedDay.ds, reason)}
          onSaveTiming={(t: TimingObject) => setDayTimings((p) => ({ ...p, [selectedDay.ds]: t }))}
          onSaveEvent={(ev: EventData) => saveEvent(selectedDay.ds, ev)}
          onDeleteEvent={(id: number) => deleteEvent(selectedDay.ds, id)}
          isBulkMode={bulkMode}
        />
      )}

      {/* Bulk Modal */}
      {bulkModalOpen && bulkSelected.size > 0 && (
        <BulkModal count={bulkSelected.size} onClose={() => setBulkModalOpen(false)} onApply={applyBulkClose} />
      )}
    </div>
  );
}

function EventList({ evts, emptyMsg }: { evts: EventData[]; emptyMsg: string }) {
  if (evts.length === 0) return <div className="text-center py-6 text-xs text-slate-500">{emptyMsg}</div>;
  return (
    <div className="flex flex-col gap-2">
      {evts.map((e) => {
        const et = getET(e.type);
        return (
          <div key={e.id} className={cn('p-3 rounded-xl border flex items-center justify-between', et.bg, et.border)}>
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className={cn('text-[10px] font-bold uppercase tracking-wider', et.color)}>{et.label}</span>
                {e.dateStr && <span className="text-[10px] text-slate-400 border-l border-slate-600 pl-2">{e.dateStr.slice(5).replace('-', '/')}</span>}
              </div>
              <div className="text-sm font-bold text-slate-200">{e.title || 'Untitled'}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex gap-3">
                <span> {e.startTime} - {e.endTime}</span>
                {e.capacity && <span> {e.capacity}</span>}
              </div>
              {e.instructor && <div className="text-[10px] text-slate-500 mt-1">Instructor: {e.instructor}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayModal({ day, ds, dow, isWeekend, publicHolidayName, isAdminClosed, closureReason, timing, dayEvents, dateStr, onClose, onCloseDay, onSaveTiming, onSaveEvent, onDeleteEvent, isBulkMode }: any) {
  const [activeTab, setActiveTab] = useState<'status' | 'events'>('status');
  const [closingReason, setClosingReason] = useState(closureReason || '');
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [tempTiming, setTempTiming] = useState(timing || { open: '06:00', close: '22:00', is24h: false });
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<EventData>>({ type: 'class', startTime: '09:00', endTime: '10:00' });
  const handleToggleClose = () => { onCloseDay(closingReason); };
  const handleSaveHours = () => { onSaveTiming(tempTiming); setIsEditingHours(false); };
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;
    onSaveEvent(newEvent as EventData);
    setShowEventForm(false); setNewEvent({ type: 'class', startTime: '09:00', endTime: '10:00', title: '', instructor: '', capacity: '' });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.15s_ease]">
      <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-[#1e2a3a] flex justify-between items-start bg-[#1a2235]">
          <div>
            <div className="text-[11px] text-blue-400 font-bold tracking-widest uppercase mb-1">{dow}</div>
            <div className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              {day} {new Date(ds).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {publicHolidayName && <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">{publicHolidayName}</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex border-b border-[#1e2a3a] px-5 pt-3 bg-[#1a2235]">
          <button onClick={() => setActiveTab('status')} className={cn('px-4 py-2 text-sm font-semibold border-b-2 transition-colors', activeTab === 'status' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300')}>Day Status</button>
          <button onClick={() => setActiveTab('events')} className={cn('px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2', activeTab === 'events' ? 'border-purple-400 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-300')}>
            Events {dayEvents?.length > 0 && <span className="bg-purple-500/20 text-purple-300 py-0.5 px-1.5 rounded text-[10px]">{dayEvents.length}</span>}
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'status' && (
            <div className="flex flex-col gap-5">
              <div className={cn('rounded-xl border p-4 transition-colors', isAdminClosed ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/5')}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', isAdminClosed ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500')}>{isAdminClosed ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}</div>
                    <div><div className="font-bold text-slate-200 text-base">{isAdminClosed ? 'Closed' : 'Open'}</div><div className="text-xs text-slate-400 mt-0.5">Toggle to change facility status</div></div>
                  </div>
                  <Toggle value={!isAdminClosed} onChange={handleToggleClose} />
                </div>
                {isAdminClosed && (
                  <div className="mt-4 animate-[fadeIn_0.2s_ease]">
                    <div className="text-xs text-slate-400 mb-1.5">Reason for closure (optional)</div>
                    <input type="text" value={closingReason} onChange={(e) => setClosingReason(e.target.value)} placeholder="e.g. Maintenance, Public Holiday..." className="w-full bg-[#0d1117] border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:outline-none placeholder-slate-600 transition-colors" />
                    <button onClick={handleToggleClose} className="mt-3 w-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white py-2 rounded-lg text-xs font-semibold transition-colors">Save Reason</button>
                  </div>
                )}
              </div>
              {!isAdminClosed && (
                <div className="rounded-xl border border-[#1e2a3a] bg-[#1a2235] p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-sm text-slate-200">Operating Hours</div>
                    <button onClick={() => setIsEditingHours(!isEditingHours)} className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isEditingHours ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700')}><Edit2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {!isEditingHours ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"></div>
                      <div>
                        {timing?.is24h ? <div className="font-bold text-blue-400">24 Hours Open</div> : <div className="font-bold text-slate-200 text-lg">{timing?.open} <span className="text-slate-500 text-sm font-medium mx-1">to</span> {timing?.close}</div>}
                        <div className="text-xs text-slate-500">Facility timings for {dow}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-[fadeIn_0.2s_ease]">
                      <div className="flex items-center gap-3 bg-[#0d1117] p-3 rounded-lg border border-[#1e2a3a] mb-4"><Toggle value={tempTiming.is24h} onChange={(v) => setTempTiming((p: any) => ({ ...p, is24h: v }))} /><span className="text-sm text-slate-300">24 / 7 Open</span></div>
                      {!tempTiming.is24h && (
                        <div className="flex gap-3 mb-4">
                          <div className="flex-1"><div className="text-xs text-slate-400 mb-1">Open time</div><input type="time" value={tempTiming.open} onChange={(e) => setTempTiming((p: any) => ({ ...p, open: e.target.value }))} className="w-full bg-[#0d1117] border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors" /></div>
                          <div className="flex-1"><div className="text-xs text-slate-400 mb-1">Close time</div><input type="time" value={tempTiming.close} onChange={(e) => setTempTiming((p: any) => ({ ...p, close: e.target.value }))} className="w-full bg-[#0d1117] border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors" /></div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={handleSaveHours} className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">Save Hours</button>
                        <button onClick={() => { setTempTiming(timing || { open: '06:00', close: '22:00', is24h: false }); setIsEditingHours(false); }} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 border border-slate-700 transition-colors">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'events' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-sm text-slate-200">Scheduled Actions</div>
                <button onClick={() => setShowEventForm(true)} className="flex items-center gap-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"><Plus className="w-3.5 h-3.5" /> Add New</button>
              </div>
              {showEventForm && (
                <div className="bg-[#1a2235] rounded-xl p-4 border border-purple-500/30 animate-[fadeIn_0.2s_ease]">
                  <div className="flex justify-between items-center mb-4"><div className="font-bold text-sm text-purple-400">New Schedule Entry</div><button onClick={() => setShowEventForm(false)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button></div>
                  <div className="flex flex-col gap-3">
                    <div><div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Title (Required)</div><input type="text" placeholder="Zumba, Maintenance..." value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Type</div>
                      <div className="flex gap-2">
                        {EVENT_TYPES.map((t) => (
                          <div key={t.id} onClick={() => setNewEvent({ ...newEvent, type: t.id as any })} className={cn('flex-1 text-center py-1.5 rounded-lg border text-xs cursor-pointer font-semibold transition-all', newEvent.type === t.id ? cn(t.bg, t.color, t.border) : 'bg-[#0d1117] border-slate-700 text-slate-400 hover:border-slate-500')}>{t.label}</div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1"><div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Start</div><input type="time" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
                      <div className="flex-1"><div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">End</div><input type="time" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1"><div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Instructor</div><input type="text" placeholder="Optional" value={newEvent.instructor} onChange={(e) => setNewEvent({ ...newEvent, instructor: e.target.value })} className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
                      <div className="flex-1"><div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Capacity</div><input type="number" placeholder="Optional" value={newEvent.capacity} onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })} className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
                    </div>
                    <button onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.startTime || !newEvent.endTime} className="w-full mt-3 bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors">Save to Schedule</button>
                  </div>
                </div>
              )}
              {!dayEvents || dayEvents.length === 0 ? (
                <div className="text-center py-6"><div className="text-4xl mb-2"></div><div className="text-slate-400 text-sm">No events or classes scheduled for this day.</div></div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {dayEvents.map((e: EventData) => {
                    const et = getET(e.type);
                    return (
                      <div key={e.id} className={cn('p-3.5 rounded-xl border relative group', et.bg, et.border)}>
                        <button onClick={() => onDeleteEvent(e.id)} className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20" title="Delete Event"><Trash2 className="w-3.5 h-3.5" /></button>
                        <div className={cn('text-[10px] font-bold uppercase tracking-wider mb-1', et.color)}>{et.label}</div>
                        <div className="font-bold text-slate-200 text-base">{e.title}</div>
                        <div className="flex gap-4 mt-2 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5 overflow-hidden"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {e.startTime} - {e.endTime}</div>
                          {e.capacity && <div className="flex items-center gap-1.5"><KeySquare className="w-3.5 h-3.5 text-slate-500" /> {e.capacity} Spots</div>}
                        </div>
                        {e.instructor && <div className="mt-2 text-xs text-slate-400 bg-black/20 px-2 py-1 rounded inline-block">Led by: <span className="text-slate-300">{e.instructor}</span></div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BulkModal({ count, onClose, onApply }: { count: number; onClose: () => void; onApply: (r: string) => void }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.15s_ease]">
      <div className="bg-[#161b27] border border-blue-500/30 rounded-2xl w-full max-w-[360px] shadow-2xl overflow-hidden shadow-blue-500/10">
        <div className="p-5">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4"><span className="text-2xl"></span></div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Mark {count} Days Closed?</h2>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">You are about to mark {count} selected day{count > 1 ? 's' : ''} as closed for the facility. Regular members will see this status in their dashboard.</p>
          <div className="mb-6">
            <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Cancellation Reason (optional)</label>
            <input type="text" placeholder="e.g. Deep Cleaning, Special Event..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => onApply(reason)} className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">Confirm Closure</button>
            <button onClick={onClose} className="px-4 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

