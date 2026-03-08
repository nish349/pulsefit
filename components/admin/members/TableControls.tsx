import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Download, Mail, Snowflake, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MembershipTier, MemberStatus } from '@/lib/mock/members';

export interface FilterState {
  search: string;
  tiers: Set<MembershipTier>;
  statuses: Set<MemberStatus>;
}

interface TableControlsProps {
  selectedCount: number;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  onBulkAction: (action: string) => void;
}

export function TableControls({ selectedCount, filters, onFilterChange, onClearFilters, onBulkAction }: TableControlsProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const activeFilterCount = filters.tiers.size + filters.statuses.size + (filters.search ? 1 : 0);

  const toggleTier = (t: MembershipTier) => {
    const newTiers = new Set(filters.tiers);
    newTiers.has(t) ? newTiers.delete(t) : newTiers.add(t);
    onFilterChange({ ...filters, tiers: newTiers });
  };

  const toggleStatus = (s: MemberStatus) => {
    const newStatuses = new Set(filters.statuses);
    newStatuses.has(s) ? newStatuses.delete(s) : newStatuses.add(s);
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#161b27] p-2 rounded-xl border border-[#1e2a3a]">
      {/* Left: Bulk Actions */}
      <div className="flex-1 w-full sm:w-auto relative">
        {selectedCount > 0 ? (
          <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 pl-3 pr-1 py-1 rounded-lg animate-[fadeIn_0.2s_ease]">
            <span className="text-xs font-bold text-blue-400">{selectedCount} selected</span>
            <div className="h-4 w-px bg-blue-500/30" />

            <div className="relative">
              <button onClick={() => setBulkOpen(!bulkOpen)} className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors font-medium">
                Bulk Actions <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {bulkOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setBulkOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a2235] border border-[#1e2a3a] rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-[fadeIn_0.15s_ease] py-1">
                    {[
                      { id: 'message', label: 'Send Message', icon: Mail },
                      { id: 'freeze', label: 'Freeze Memberships', icon: Snowflake },
                      { id: 'export', label: 'Export Selected', icon: Download },
                    ].map(act => (
                      <button
                        key={act.id}
                        onClick={() => { onBulkAction(act.id); setBulkOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-[#1e2a3a] hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <act.icon className="w-3.5 h-3.5 text-slate-400" /> {act.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 pl-2 font-medium">Select members for bulk actions</div>
        )}
      </div>

      {/* Center & Right: Search & Filters */}
      <div className="flex-1 flex justify-end gap-2 w-full sm:w-auto">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full bg-[#0d1117] border border-slate-700 text-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:border-blue-500 focus:outline-none transition-colors h-9"
          />
          {filters.search && (
            <button onClick={() => onFilterChange({ ...filters, search: '' })} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "flex items-center gap-2 border rounded-lg px-3 h-9 text-xs font-semibold transition-colors",
              activeFilterCount > 0
                ? "bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                : "bg-[#0d1117] border-slate-700 text-slate-300 hover:border-slate-500"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {filterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a2235] border border-[#1e2a3a] rounded-xl shadow-2xl z-50 animate-[fadeIn_0.15s_ease] overflow-hidden flex flex-col">
                <div className="p-3 border-b border-[#1e2a3a] flex justify-between items-center bg-[#161b27]">
                  <span className="font-bold text-sm text-slate-200">Filters</span>
                  {activeFilterCount > 0 && (
                    <button onClick={onClearFilters} className="text-xs text-slate-400 hover:text-red-400 transition-colors">Clear All</button>
                  )}
                </div>

                <div className="p-4 max-h-[300px] overflow-y-auto flex flex-col gap-4">
                  {/* Statuses */}
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Status</div>
                    <div className="flex flex-col gap-1.5">
                      {(['Active', 'Expiring Soon', 'Expired', 'Frozen', 'Cancelled'] as MemberStatus[]).map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer group">
                          <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", filters.statuses.has(s) ? "bg-blue-500 border-blue-500" : "bg-[#0d1117] border-slate-600 group-hover:border-slate-400")}>
                            {filters.statuses.has(s) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tiers */}
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Membership Tier</div>
                    <div className="flex flex-col gap-1.5">
                      {(['Basic', 'Silver', 'Gold', 'Platinum'] as MembershipTier[]).map(t => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer group">
                          <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", filters.tiers.has(t) ? "bg-purple-500 border-purple-500" : "bg-[#0d1117] border-slate-600 group-hover:border-slate-400")}>
                            {filters.tiers.has(t) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
