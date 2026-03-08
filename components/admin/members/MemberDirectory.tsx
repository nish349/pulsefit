'use client';

import React, { useState, useMemo } from 'react';
import { Member, MOCK_MEMBERS } from '@/lib/mock/members';
import { HealthBar } from './HealthBar';
import { TableControls, FilterState } from './TableControls';
import { MemberTable, SortField, SortOrder } from './MemberTable';
import { MemberProfileDrawer } from './MemberProfileDrawer';
import { UserPlus } from 'lucide-react';
import { AddMemberModal } from './AddMemberModal';

export function MemberDirectory() {
  // All Data (mocking an API fetch that returns all members for client-side sorting/filtering)
  const [allMembers, setAllMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [isLoading, setIsLoading] = useState(false);

  // Table State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('expiryDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tiers: new Set(),
    statuses: new Set()
  });

  // Drawer Context
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Modal Context
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Derived Data ---

  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = `${m.firstName} ${m.lastName}`.toLowerCase().includes(q);
        const matchesEmail = m.email.toLowerCase().includes(q);
        const matchesPhone = m.phone.includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      // Status
      if (filters.statuses.size > 0 && !filters.statuses.has(m.status)) return false;
      // Tier
      if (filters.tiers.size > 0 && !filters.tiers.has(m.tier)) return false;
      return true;
    });
  }, [allMembers, filters]);

  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      let valA: any = a[sortField as keyof Member];
      let valB: any = b[sortField as keyof Member];

      if (sortField === 'name') {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortField === 'joinDate' || sortField === 'expiryDate') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      const mod = sortOrder === 'asc' ? 1 : -1;
      return valA < valB ? -1 * mod : valA > valB ? 1 * mod : 0;
    });
  }, [filteredMembers, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage) || 1;
  const paginatedMembers = sortedMembers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // --- Handlers ---

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'expiryDate' ? 'asc' : 'desc'); // Default to ascending for dates, desc for others
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
    setSelectedIds(new Set()); // Clear selections when filtering
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedMembers.map(m => m.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    setSelectedIds(next);
  };

  const handleRowClick = (member: Member) => {
    setSelectedMember(member);
    setDrawerOpen(true);
  };

  const handleActionClick = (e: React.MouseEvent, action: string, member: Member) => {
    e.stopPropagation();
    if (action === 'view') {
      setSelectedMember(member);
      setDrawerOpen(true);
    } else if (action === 'freeze') {
      // Toggle freeze stat mock logic
      setAllMembers(prev => prev.map(m => {
        if (m.id === member.id) {
          return { ...m, status: m.status === 'Frozen' ? 'Active' : 'Frozen' };
        }
        return m;
      }));
    } else if (action === 'clear-filters') {
      handleFilterChange({ search: '', tiers: new Set(), statuses: new Set() });
    }
  };

  const handleBulkAction = (action: string) => {
    // Simple mock logic for bulk actions
    if (action === 'freeze') {
      setAllMembers(prev => prev.map(m => selectedIds.has(m.id) ? { ...m, status: 'Frozen' } : m));
    } else if (action === 'message') {
      alert(`Simulated sending a message to ${selectedIds.size} members.`);
    } else if (action === 'export') {
      alert(`Exporting ${selectedIds.size} rows to CSV.`);
    }
    setSelectedIds(new Set());
  };

  const handleDrawerAction = (action: string, member: Member) => {
    if (action === 'freeze') {
      setAllMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: m.status === 'Frozen' ? 'Active' : 'Frozen' } : m));
      // Also update locally to reflect in the open drawer immediately
      setSelectedMember({ ...member, status: member.status === 'Frozen' ? 'Active' : 'Frozen' });
    } else if (action === 'renew') {
      const nextYear = new Date(); nextYear.setFullYear(nextYear.getFullYear() + 1);
      setAllMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: 'Active', expiryDate: nextYear.toISOString() } : m));
      setSelectedMember({ ...member, status: 'Active', expiryDate: nextYear.toISOString() });
    } else {
      alert(`Admin Action: ${action} on ${member.firstName}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6 min-h-screen bg-[#0d1117] text-slate-200 font-sans max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Member Directory</h1>
          <p className="text-sm text-slate-400">View, filter, and manage all your gym members.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors shrink-0"
        >
          <UserPlus size={16} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Zone 1: Health Bar */}
      <HealthBar members={filteredMembers} />

      {/* Zone 2: Table Controls */}
      <TableControls
        selectedCount={selectedIds.size}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => handleFilterChange({ search: '', tiers: new Set(), statuses: new Set() })}
        onBulkAction={handleBulkAction}
      />

      {/* Zone 3: Member Table */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-[400px]">
        <MemberTable
          members={paginatedMembers}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          onActionClick={handleActionClick}
          isLoading={isLoading}
          isEmptyByFilter={allMembers.length > 0 && filteredMembers.length === 0}
        />
      </div>

      {/* Member Profile Drawer */}
      <MemberProfileDrawer
        member={selectedMember}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAction={handleDrawerAction}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => setIsAddModalOpen(false)}
      />

    </div>
  );
}
