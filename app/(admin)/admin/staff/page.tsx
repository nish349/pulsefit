'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGymStore } from '@/lib/store';
import { Search, Plus, Shield, ShieldAlert, Trash2, X, Check, Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  access: string;
  status: string;
  [key: string]: unknown;
}

export default function StaffPage() {
  const { staff, setStaff } = useGymStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaultPermissions = {
    dashboard: 'View Only', members: 'No Access', schedule: 'No Access', accessLog: 'No Access', salesLeads: 'No Access', reports: 'No Access', staff: 'No Access', plans: 'No Access', settings: 'No Access'
  };
  const [newStaffForm, setNewStaffForm] = useState({ name: '', email: '', role: 'Front Desk', pin: '', accessLevel: 'View Only', permissions: defaultPermissions });

  // Sync
  const safeStaff = (staff || []) as StaffMember[];

  // Handle Add Staff
  const handleAddStaff = () => {
    if (!newStaffForm.name || !newStaffForm.email || newStaffForm.pin.length !== 4) {
      alert("Please fill in all fields and ensure PIN is 4 digits.");
      return;
    }
    const newStaff = {
      id: `s${Date.now()}`,
      name: newStaffForm.name,
      role: newStaffForm.role,
      email: newStaffForm.email,
      access: newStaffForm.accessLevel,
      permissions: newStaffForm.accessLevel === 'Custom' ? newStaffForm.permissions : null,
      status: 'Off Duty'
    };
    setStaff([...(staff || []), newStaff]);
    setIsModalOpen(false);
    setNewStaffForm({ name: '', email: '', role: 'Front Desk', pin: '', accessLevel: 'View Only', permissions: defaultPermissions });
  };

  const handleRemoveStaff = (id: string) => {
    if (window.confirm("Are you sure you want to remove this staff member? This action cannot be undone.")) {
      setStaff(safeStaff.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff Management</h1>
          <p className="text-slate-400 text-sm">Manage gym personnel, roles, and system access.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} />
          Add Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {safeStaff.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No staff members found"
            description="Get started by adding your first gym personnel."
            action={
              <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors">
                + Add First Staff
              </button>
            }
          />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {safeStaff.map((staff: StaffMember) => (
                <tr key={staff.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 uppercase">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{staff.name}</div>
                        <div className="text-xs text-slate-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{staff.role}</td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border",
                      staff.access === 'Admin' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-slate-800 text-slate-400 border-slate-700"
                    )}>
                      {staff.access === 'Admin' ? <ShieldAlert size={12} /> : <Shield size={12} />}
                      {staff.access}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemoveStaff(staff.id)}
                      className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove Staff"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-white mb-6">Add New Staff Member</h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Front Desk">Front Desk</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Access Level</label>
                  <select
                    value={newStaffForm.accessLevel}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, accessLevel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  >
                    <option value="View Only">View Only</option>
                    <option value="Full Access">Full Access</option>
                    <option value="Custom">Custom (Matrix)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Access PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newStaffForm.pin}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, pin: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono tracking-widest placeholder:tracking-normal"
                  placeholder="4 digits"
                />
              </div>

              {newStaffForm.accessLevel === 'Custom' && (
                <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/50 text-slate-400 font-medium text-xs">
                      <tr>
                        <th className="px-4 py-2">Module</th>
                        <th className="px-4 py-2">Permission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {[
                        { key: 'dashboard', label: 'Dashboard', options: ['View Only'] },
                        { key: 'members', label: 'Members', options: ['No Access', 'View Only', 'Full Access'] },
                        { key: 'schedule', label: 'Schedule', options: ['No Access', 'View Only', 'Full Access'] },
                        { key: 'accessLog', label: 'Access Log', options: ['No Access', 'View Only', 'Full Access'] },
                        { key: 'salesLeads', label: 'Sales Leads', options: ['No Access', 'View Only', 'Full Access'] },
                        { key: 'reports', label: 'Reports & Analytics', options: ['No Access', 'View Only', 'Full Access'] },
                        { key: 'staff', label: 'Staff Management', options: ['No Access', 'View Only', 'Full Access'] },
                        { key: 'plans', label: 'Membership Plans', options: ['No Access', 'View Only', 'Full Access'] },
                        { key: 'settings', label: 'Settings', options: ['No Access', 'Full Access'] },
                      ].map(mod => (
                        <tr key={mod.key} className="bg-slate-900/30">
                          <td className="px-4 py-2 text-slate-300 text-xs">{mod.label}</td>
                          <td className="px-4 py-2">
                            <select
                              value={(newStaffForm.permissions as any)[mod.key]}
                              onChange={e => setNewStaffForm({
                                ...newStaffForm,
                                permissions: { ...newStaffForm.permissions, [mod.key]: e.target.value }
                              })}
                              disabled={mod.key === 'dashboard'}
                              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                            >
                              {mod.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
