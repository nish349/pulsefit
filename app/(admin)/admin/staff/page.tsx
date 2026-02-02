'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGymStore } from '@/lib/store';
import { Search, Plus, Shield, ShieldAlert, MoreHorizontal, X, Check } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  access: string;
  status: string;
  [key: string]: any;
}

export default function StaffPage() {
  const { staff, setStaff } = useGymStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Sync
  const safeStaff = staff || [];

  // Handle Add Staff
  const handleAddStaff = () => {
     // Create a new staff object and save to store
     // Implementation detail: we need form state
     const newStaff = {
         id: `s${Date.now()}`,
         name: "New Staff", // Placeholder for now as form is static in original
         role: "Trainer",
         email: "staff@example.com",
         access: isAdmin ? 'Admin' : 'Read-Only',
         status: 'Active'
     };
     setStaff([...(staff || []), newStaff]);
     setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff Management</h1>
          <p className="text-slate-400 text-sm">Control staff access and permissions.</p>
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
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
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
                    <button className="text-slate-500 hover:text-white"><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" placeholder="john@pulsefit.com" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                            <option>Floor Staff</option>
                            <option>Trainer</option>
                            <option>Receptionist</option>
                            <option>Manager</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Admin Panel Permissions</label>
                        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                            <button 
                                onClick={() => setIsAdmin(false)}
                                className={cn("flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all", !isAdmin ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300")}
                            >
                                <Shield size={14} /> Read-Only
                            </button>
                            <button 
                                onClick={() => setIsAdmin(true)}
                                className={cn("flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all", isAdmin ? "bg-purple-600 text-white shadow" : "text-slate-500 hover:text-slate-300")}
                            >
                                <ShieldAlert size={14} /> Full Access
                            </button>
                        </div>
                    </div>
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
