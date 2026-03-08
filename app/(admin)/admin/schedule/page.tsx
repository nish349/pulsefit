'use client';

import React from 'react';
import ScheduleCalendar from '@/components/admin/schedule/ScheduleCalendar';

export default function SchedulePage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Schedule &amp; Hours</h1>
                <p className="text-slate-400 text-sm mt-0.5">
                    Manage facility timings, mark closures, and view Indian public holidays automatically.
                </p>
            </div>

            {/* Main Calendar Component */}
            <ScheduleCalendar />
        </div>
    );
}
