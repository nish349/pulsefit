import React from 'react';
import { Member, MemberStatus, MembershipTier } from '@/lib/mock/members';
import { format, isBefore, addDays } from 'date-fns';
import { MoreHorizontal, ArrowUpDown, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, UserPlus, Users2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortField = 'name' | 'tier' | 'status' | 'joinDate' | 'expiryDate';
export type SortOrder = 'asc' | 'desc';

interface MemberTableProps {
  members: Member[];
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick: (member: Member) => void;
  onActionClick: (e: React.MouseEvent, action: string, member: Member) => void;
  isLoading?: boolean;
  isEmptyByFilter?: boolean;
}

export function MemberTable({
  members, selectedIds, onSelectAll, onSelectRow,
  sortField, sortOrder, onSort,
  page, totalPages, onPageChange,
  onRowClick, onActionClick,
  isLoading, isEmptyByFilter
}: MemberTableProps) {

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />;
  };

  const getTierColor = (tier: MembershipTier) => {
    switch (tier) {
      case 'Platinum': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Gold': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Silver': return 'bg-slate-300/15 text-slate-300 border-slate-300/30';
      case 'Basic': return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'Expiring Soon': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Expired': return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'Frozen': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'Cancelled': return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const isExpiringSoon = (expiryStr: string) => {
    const expiry = new Date(expiryStr);
    const inSevenDays = addDays(new Date(), 7);
    return isBefore(expiry, inSevenDays) && !isBefore(expiry, new Date());
  };

  const isExpired = (expiryStr: string) => {
    return isBefore(new Date(expiryStr), new Date());
  };

  if (isLoading) {
    return (
      <div className="bg-[#161b27] rounded-xl border border-[#1e2a3a] overflow-hidden">
        <div className="p-4 border-b border-[#1e2a3a]"><div className="w-64 h-5 bg-slate-800 rounded animate-pulse" /></div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 border-b border-[#1e2a3a] flex gap-6">
            <div className="w-5 h-5 bg-slate-800 rounded animate-pulse" />
            <div className="flex gap-4 w-64"><div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" /><div className="flex-1 space-y-2"><div className="h-4 bg-slate-800 rounded animate-pulse" /><div className="h-3 w-2/3 bg-slate-800 rounded animate-pulse" /></div></div>
            <div className="w-20 h-5 bg-slate-800 rounded animate-pulse" />
            <div className="w-24 h-5 bg-slate-800 rounded animate-pulse" />
            <div className="w-24 h-5 bg-slate-800 rounded animate-pulse" />
            <div className="w-24 h-5 bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-[#161b27] rounded-xl border border-[#1e2a3a] p-12 flex flex-col items-center justify-center text-center">
        {!isEmptyByFilter ? (
          <>
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4"><Users2 className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">No members added yet</h3>
            <p className="text-slate-500 max-w-sm mb-6 text-sm">Your directory is empty. Add your first member to start managing their plans and access.</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors">
              <UserPlus className="w-4 h-4" /> Add First Member
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-4"><Search className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">No members match your current filters</h3>
            <p className="text-slate-500 max-w-sm mb-6 text-sm">Try adjusting your search criteria, clearing the status filters, or removing the tier filters.</p>
            <button onClick={() => onActionClick({} as any, 'clear-filters', {} as any)} className="border border-slate-700 text-slate-300 hover:bg-slate-800 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              Clear Filters
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#161b27] rounded-xl border border-[#1e2a3a] overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#1a2235] text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-[#1e2a3a]">
            <tr>
              <th className="px-5 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size === members.length && members.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900 checked:bg-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                />
              </th>
              <th className="px-5 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => onSort('name')}>
                <div className="flex items-center gap-2">Member Info {getSortIcon('name')}</div>
              </th>
              <th className="px-5 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => onSort('tier')}>
                <div className="flex items-center gap-2">Tier {getSortIcon('tier')}</div>
              </th>
              <th className="px-5 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => onSort('status')}>
                <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
              </th>
              <th className="px-5 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => onSort('joinDate')}>
                <div className="flex items-center gap-2">Join Date {getSortIcon('joinDate')}</div>
              </th>
              <th className="px-5 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => onSort('expiryDate')}>
                <div className="flex items-center gap-2">Expiry (Est.) {getSortIcon('expiryDate')}</div>
              </th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2a3a]">
            {members.map(m => {
              const isSelected = selectedIds.has(m.id);
              const expiring = isExpiringSoon(m.expiryDate);
              const expired = isExpired(m.expiryDate);

              const effectiveStatus = (m.status === 'Active' && expiring) ? 'Expiring Soon' : m.status;
              const isUrgent = expiring || (expired && m.status !== 'Cancelled');

              return (
                <tr
                  key={m.id}
                  onClick={() => onRowClick(m)}
                  className={cn(
                    "group cursor-pointer transition-colors hover:bg-slate-800/50",
                    isSelected ? "bg-blue-500/5 hover:bg-blue-500/10" : "",
                    effectiveStatus === 'Expiring Soon' ? "border-l-2 border-l-amber-500" : isUrgent && m.status !== 'Expired' ? "border-l-2 border-l-amber-500" : "border-l-2 border-l-transparent",
                    m.status === 'Expired' || m.status === 'Cancelled' ? "opacity-75" : ""
                  )}
                >
                  <td className="px-5 py-4 w-12 text-center" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectRow(m.id, e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 checked:bg-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner", m.avatarColor)}>
                        {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{m.firstName} {m.lastName}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]" title={m.email}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider", getTierColor(m.tier))}>
                      {m.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full border text-[11px] font-bold", getStatusColor(effectiveStatus as MemberStatus))}>
                      {effectiveStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {format(new Date(m.joinDate), 'd MMM yyyy')}
                  </td>
                  <td className="px-5 py-4">
                    <div className={cn(
                      "font-semibold",
                      expired ? "text-red-400" : expiring ? "text-amber-400 flex items-center gap-1.5" : "text-slate-300"
                    )}>
                      {expiring && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />}
                      {format(new Date(m.expiryDate), 'd MMM yyyy')}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={(e) => onActionClick(e, 'view', m)} className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2 py-1 rounded transition-colors">View</button>
                      <button onClick={(e) => onActionClick(e, 'freeze', m)} className={cn("text-[11px] font-semibold px-2 py-1 rounded transition-colors", m.status === 'Frozen' ? "text-slate-400 hover:text-slate-200 bg-slate-800" : "text-indigo-400 hover:text-indigo-300 bg-indigo-500/10")}>{m.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}</button>
                      <button onClick={(e) => onActionClick(e, 'more', m)} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#1e2a3a] bg-[#1a2235] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Showing page <span className="font-bold text-slate-200">{page}</span> of <span className="font-bold text-slate-200">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded bg-[#0d1117] border border-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded bg-[#0d1117] border border-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
