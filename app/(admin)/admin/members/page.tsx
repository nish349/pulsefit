'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGymStore } from '@/lib/store';
import { Search, Filter, MoreHorizontal, X, Check, User, CreditCard, Mail, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  tier: string;
  status: string;
  joinDate: string;
  [key: string]: any;
}

const SortIcon = ({ columnKey, sortConfig }: { columnKey: string, sortConfig: { key: string, direction: 'asc' | 'desc' } | null }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-emerald-500" /> : <ChevronDown size={14} className="text-emerald-500" />;
};

export default function MembersPage() {
  // Global State
  const { members, setMembers } = useGymStore();
  const safeMembers = members || [];
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
      tiers: [] as string[],
      statuses: [] as string[]
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Action State
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<'profile' | 'plan' | null>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Derived Data (Search + Filter + Sort)
  const filteredMembers = useMemo(() => {
      const result = safeMembers.filter((member: Member) => {
          const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                member.id.toLowerCase().includes(searchTerm.toLowerCase());
          
          const matchesTier = filters.tiers.length === 0 || filters.tiers.includes(member.tier);
          const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(member.status);

          return matchesSearch && matchesTier && matchesStatus;
      });

      if (sortConfig) {
          result.sort((a: Member, b: Member) => {
              if (a[sortConfig.key] < b[sortConfig.key]) {
                  return sortConfig.direction === 'asc' ? -1 : 1;
              }
              if (a[sortConfig.key] > b[sortConfig.key]) {
                  return sortConfig.direction === 'asc' ? 1 : -1;
              }
              return 0;
          });
      }

      return result;
  }, [safeMembers, searchTerm, filters, sortConfig]);

  // Handlers
  const handleSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const toggleFilter = (type: 'tiers' | 'statuses', value: string) => {
      setFilters(prev => {
          const current = prev[type];
          return {
              ...prev,
              [type]: current.includes(value) ? current.filter(item => item !== value) : [...current, value]
          };
      });
  };

  const openAction = (id: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent row click or global click
      // If clicking the same one, keep it open (per user request). 
      // Only close if clicking a DIFFERENT one, which setID handles.
      setActiveActionId(id);
  };

  // Close menu when clicking outside (handled by parent div)
  const handleGlobalClick = () => {
      setActiveActionId(null);
  };

  const handleActionClick = (member: any, type: 'profile' | 'plan') => {
      setSelectedMember(member);
      setModalOpen(type);
      setActiveActionId(null);
  };

  const saveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      
      const updated = safeMembers.map((m: Member) => m.id === selectedMember.id ? { ...m, name } : m);
      setMembers(updated); // Sync to global
      setModalOpen(null);
  };

  const savePlan = (tier: 'Basic' | 'Business' | 'Enterprise') => {
      const updated = safeMembers.map((m: Member) => m.id === selectedMember.id ? { ...m, tier } : m);
      setMembers(updated); // Sync to global
      setModalOpen(null);
  };


  return (
    <div className="space-y-6 pb-20" onClick={handleGlobalClick}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Member Directory</h1>
          <p className="text-slate-400 text-sm">Manage member profiles, subscriptions, and status.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members..." 
                    className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-neon/50 focus:border-neon/50 outline-none w-64"
                />
             </div>
             <div className="relative">
                 <button 
                    onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
                    className={cn(
                        "p-2 border rounded-lg transition-colors relative",
                        isFilterOpen || filters.tiers.length > 0 || filters.statuses.length > 0 
                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    )}
                 >
                    <Filter size={18} />
                    {(filters.tiers.length > 0 || filters.statuses.length > 0) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                    )}
                 </button>

                 {/* Filter Dropdown */}
                 {isFilterOpen && (
                     <div 
                        className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-20 p-4"
                        onClick={(e) => e.stopPropagation()}
                     >
                         <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Filter by Tier</h3>
                         <div className="space-y-2 mb-4">
                             {['Basic', 'Business', 'Enterprise'].map(tier => (
                                 <label key={tier} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                                     <input 
                                        type="checkbox" 
                                        checked={filters.tiers.includes(tier)}
                                        onChange={() => toggleFilter('tiers', tier)}
                                        className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50" 
                                     />
                                     {tier}
                                 </label>
                             ))}
                         </div>

                         <div className="border-t border-slate-800 my-3" />

                         <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Filter by Status</h3>
                         <div className="space-y-2">
                             {['Active', 'Frozen', 'Cancelled'].map(status => (
                                 <label key={status} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                                     <input 
                                        type="checkbox" 
                                        checked={filters.statuses.includes(status)}
                                        onChange={() => toggleFilter('statuses', status)}
                                        className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50" 
                                     />
                                     {status}
                                 </label>
                             ))}
                         </div>
                     </div>
                 )}
             </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-visible">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-slate-400 uppercase font-medium text-xs">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:text-white hover:bg-slate-900/50 transition-colors" onClick={(e) => {e.stopPropagation(); handleSort('name');}}>
                  <div className="flex items-center gap-2">Member Info <SortIcon columnKey="name" sortConfig={sortConfig} /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:text-white hover:bg-slate-900/50 transition-colors" onClick={(e) => {e.stopPropagation(); handleSort('tier');}}>
                  <div className="flex items-center gap-2">Tier <SortIcon columnKey="tier" sortConfig={sortConfig} /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:text-white hover:bg-slate-900/50 transition-colors" onClick={(e) => {e.stopPropagation(); handleSort('status');}}>
                  <div className="flex items-center gap-2">Status <SortIcon columnKey="status" sortConfig={sortConfig} /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:text-white hover:bg-slate-900/50 transition-colors" onClick={(e) => {e.stopPropagation(); handleSort('joinDate');}}>
                  <div className="flex items-center gap-2">Join Date <SortIcon columnKey="joinDate" sortConfig={sortConfig} /></div>
              </th>
              <th className="px-6 py-4">
                  Expiry (Est)
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredMembers.map((member) => (
              <tr 
                key={member.id} 
                className={cn(
                    "transition-all duration-300 group",
                    activeActionId === member.id ? "bg-emerald-500/5 border-emerald-500/30 shadow-[inset_2px_0_0_0_rgb(16,185,129)]" : "hover:bg-slate-800/30"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                        {member.name.charAt(0)}
                    </div>
                    <div>
                        <div className={cn("font-medium", activeActionId === member.id ? "text-emerald-400" : "text-white")}>{member.name}</div>
                        <div className="text-xs text-slate-500">ID: {member.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-bold border",
                    member.tier === 'Enterprise' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                    member.tier === 'Business' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    "bg-slate-800 text-slate-400 border-slate-700"
                  )}>
                    {member.tier}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                       <div className={cn("w-2 h-2 rounded-full", 
                           member.status === 'Active' ? "bg-emerald-500" :
                           member.status === 'Frozen' ? "bg-amber-500" : "bg-red-500"
                       )} />
                       <span className="text-slate-300">{member.status}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono">
                    {member.joinDate}
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono">
                    {new Date(new Date(member.joinDate).setFullYear(new Date(member.joinDate).getFullYear() + 1)).toISOString().split('T')[0]}
                </td>
                <td className="px-6 py-4 text-right relative">
                    <button 
                        onClick={(e) => openAction(member.id, e)}
                        className={cn(
                            "transition-colors p-1 rounded", 
                            activeActionId === member.id ? "bg-emerald-500 text-slate-950" : "text-slate-500 hover:text-white"
                        )}
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    
                    {/* Action Menu */}
                    {activeActionId === member.id && (
                        <div 
                            className="absolute right-8 top-8 z-30 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()} // Clicking menu shouldn't close it
                        >
                            <button 
                                onClick={() => handleActionClick(member, 'profile')}
                                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                            >
                                <User size={14} /> Modify Profile
                            </button>
                            <button 
                                onClick={() => handleActionClick(member, 'plan')}
                                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 border-t border-slate-800"
                            >
                                <CreditCard size={14} /> Change Plan
                            </button>
                        </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMembers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                No members found matching your filters.
            </div>
        )}
      </div>

      {/* Modify Profile Modal */}
      {modalOpen === 'profile' && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setModalOpen(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
                  <h3 className="text-lg font-bold text-white mb-6">Modify Profile</h3>
                  <form onSubmit={saveProfile} className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                          <div className="relative mt-1">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                              <input defaultValue={selectedMember.name} name="name" className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Email (Read Only)</label>
                          <div className="relative mt-1">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                              <input value={`${selectedMember.id}@example.com`} readOnly className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-500 cursor-not-allowed" />
                          </div>
                      </div>
                      <div className="pt-4 flex gap-3">
                          <button type="button" onClick={() => setModalOpen(null)} className="flex-1 py-2 rounded-lg text-slate-400 hover:bg-slate-800">Cancel</button>
                          <button type="submit" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium">Save Changes</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Change Plan Modal */}
      {modalOpen === 'plan' && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setModalOpen(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
                  <h3 className="text-lg font-bold text-white mb-2">Change Subscription Plan</h3>
                  <p className="text-sm text-slate-400 mb-6">Current Plan: <span className="text-white font-bold">{selectedMember.tier}</span></p>
                  
                  <div className="space-y-3">
                      {['Basic', 'Business', 'Enterprise'].map((tier: string) => (
                          <button 
                              key={tier}
                              onClick={() => savePlan(tier)}
                              className={cn(
                                  "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                                  selectedMember.tier === tier ? "bg-emerald-500/10 border-emerald-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                              )}
                          >
                              <span className="font-medium">{tier} Plan</span>
                              {selectedMember.tier === tier && <Check size={18} className="text-emerald-500" />}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
