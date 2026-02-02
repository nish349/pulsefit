'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Save, Globe, AlertTriangle } from 'lucide-react';

export default function SchedulePage() {
  const [globalHoliday, setGlobalHoliday] = useState(false);
  const [weekendClosures, setWeekendClosures] = useState<string[]>(['Sunday']);

  const toggleDay = (day: string) => {
    if (weekendClosures.includes(day)) {
        setWeekendClosures(weekendClosures.filter(d => d !== day));
    } else {
        setWeekendClosures([...weekendClosures, day]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Schedule & Hours</h1>
          <p className="text-slate-400 text-sm">Manage facility timings and holiday closures.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
            <Save size={16} />
            Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar Placeholder */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 min-h-[400px] flex flex-col">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <CalendarIcon size={18} className="text-neon" /> 
                  Monthly Calendar
              </h3>
              
              {/* Mock Calendar Grid */}
              <div className="flex-1 border border-slate-800 rounded-lg bg-slate-950/50 p-4">
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="text-xs text-slate-500 uppercase font-bold">{day}</div>
                      ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 h-full">
                      {Array.from({ length: 35 }).map((_, i) => (
                          <div key={i} className={cn(
                              "aspect-square rounded border border-slate-800/50 flex items-center justify-center text-sm relative hover:bg-slate-800 transition-colors cursor-pointer",
                              i === 14 ? "bg-red-500/10 border-red-500/20 text-red-400" : "text-slate-400"
                          )}>
                              {i + 1 <= 30 ? i + 1 : ''}
                              {i === 14 && <div className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full" />}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Global Settings */}
          <div className="space-y-6">
              {/* Holiday Mode */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <Globe size={20} />
                      </div>
                      <div>
                          <h3 className="font-bold text-white">Global Settings</h3>
                          <p className="text-xs text-slate-500">Facility-wide overrides</p>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                          <div>
                              <div className="text-sm font-medium text-white">Declare Holiday</div>
                              <div className="text-xs text-slate-500">Close facility for today</div>
                          </div>
                          <button 
                              onClick={() => setGlobalHoliday(!globalHoliday)}
                              className={cn("w-12 h-6 rounded-full p-1 transition-colors relative", globalHoliday ? "bg-red-500" : "bg-slate-700")}
                          >
                              <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", globalHoliday ? "translate-x-6" : "translate-x-0")} />
                          </button>
                      </div>

                      {globalHoliday && (
                          <div className="text-xs bg-amber-500/10 text-amber-500 p-3 rounded border border-amber-500/20 flex gap-2">
                              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                              Suggest sending push notification to all Active members?
                          </div>
                      )}
                  </div>
              </div>

              {/* Weekend Closures */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-emerald-500" />
                      Recurring Closures
                  </h3>
                  <div className="space-y-2">
                      {['Saturday', 'Sunday'].map((day) => {
                          const isSelected = weekendClosures.includes(day);
                          return (
                              <button 
                                  key={day}
                                  onClick={() => toggleDay(day)}
                                  className={cn(
                                      "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm font-medium",
                                      isSelected ? "bg-slate-800 border-emerald-500/50 text-white" : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                                  )}
                              >
                                  <span>Every {day}</span>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                              </button>
                          )
                      })}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
