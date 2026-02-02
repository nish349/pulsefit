'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  User, QrCode, MessageSquare, Printer, Pause, Fingerprint, Activity, 
  CreditCard, Calendar, Clock, AlertTriangle, Edit2, Save, X, Check,
  ChevronDown, ChevronUp, Trash2, Plus
} from 'lucide-react';

// Types
type Note = {
    id: string;
    content: string;
    date: string;
    author: string;
}

// Mock Data for a specific member
const memberProfile = {
  id: 'M-2024-001',
  name: 'Sarah Chen',
  role: 'Member',
  status: 'Active',
  tier: 'Annual Pro',
  joinDate: '2023-01-15',
  avatar: null, // Placeholder logic
  biometrics: {
    registered: true,
    lastAccess: [
      { id: 1, location: 'Main Gate', time: '10:42 AM Today', method: 'Biometric' }, // 1
      { id: 2, location: 'Main Gate', time: '06:15 PM Yesterday', method: 'Biometric' }, // 2
      { id: 3, location: 'Main Gate', time: '07:30 AM 2 days ago', method: 'App QR' }, // 3
      { id: 4, location: 'Yoga Studio', time: '08:00 AM 2 days ago', method: 'Keypad' }, // 4
      { id: 5, location: 'Main Gate', time: '05:45 PM 3 days ago', method: 'Biometric' }, // 5
    ]
  },
  financials: {
    plan: 'Annual Pro',
    nextBilling: '2025-01-15',
    balance: '₹0.00',
    pendingFees:  '₹0.00', 
    history: [
      { id: 1, date: '2024-01-15', amount: '₹15,000', status: 'Success', method: 'Credit Card' },
      { id: 2, date: '2023-01-15', amount: '₹12,000', status: 'Success', method: 'UPI' },
    ]
  },
  wellness: {
    visitsThisWeek: 4,
    totalVisits: 142,
    streak: 12,
    anniversary: 'Jan 15',
    heatmap: Array.from({ length: 52 * 7 }).map(() => Math.random() > 0.7)
  },
  initialNotes: [
      { id: 'n1', content: 'Member recovering from minor shoulder injury. Suggested avoiding heavy overhead presses for 2 weeks.', date: '2024-01-20 10:30 AM', author: 'Mike (Trainer)' },
      { id: 'n2', content: 'Interested in Yoga classes. Added to the interest list for next batch.', date: '2024-01-15 09:12 AM', author: 'Admin' }
  ] as Note[]
};

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  // Access Log State
  const [showAllLogs, setShowAllLogs] = useState(false);
  const displayedLogs = showAllLogs ? memberProfile.biometrics.lastAccess : memberProfile.biometrics.lastAccess.slice(0, 3);

  // Notes State
  const [notes, setNotes] = useState<Note[]>(memberProfile.initialNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Note Handlers
  const addNote = () => {
      if (!newNoteContent.trim()) return;
      const newNote: Note = {
          id: Date.now().toString(),
          content: newNoteContent,
          date: new Date().toLocaleString(), // Simple local formatting
          author: 'CurrentUser' // placeholder
      };
      setNotes([newNote, ...notes]);
      setNewNoteContent('');
      setIsAddingNote(false);
  };

  const deleteNote = (id: string) => {
      setNotes(notes.filter(n => n.id !== id));
  };

  const startEdit = (note: Note) => {
      setEditingNoteId(note.id);
      setEditContent(note.content);
  };

  const saveEdit = (id: string) => {
      setNotes(notes.map(n => n.id === id ? { ...n, content: editContent, date: `${n.date} (Edited)` } : n));
      setEditingNoteId(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Identity */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-slate-700 pointer-events-none select-none">
             {memberProfile.id.split('-')[1]}
         </div>

         <div className="flex items-center gap-6 relative z-10">
             <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold text-slate-400 shadow-2xl">
                 {memberProfile.avatar || memberProfile.name.charAt(0)}
             </div>
             <div>
                 <div className="flex items-center gap-3 mb-1">
                     <h1 className="text-3xl font-bold text-white tracking-tight">{memberProfile.name}</h1>
                     <span className={cn("px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wider", 
                         memberProfile.status === 'Active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                         "bg-red-500/10 text-red-500 border-red-500/20")}>
                         {memberProfile.status}
                     </span>
                 </div>
                 <div className="flex items-center gap-4 text-sm text-slate-400">
                     <span className="font-mono">{memberProfile.id}</span>
                     <span className="w-1 h-1 bg-slate-600 rounded-full" />
                     <span>Joined {memberProfile.joinDate}</span>
                     <span className="w-1 h-1 bg-slate-600 rounded-full" />
                     <span className="text-[#00FFCC] font-bold">{memberProfile.tier}</span>
                 </div>
             </div>
         </div>

         <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
             <button className="flex-1 md:flex-none py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-slate-700">
                 <Pause size={16} /> Pause
             </button>
             <button className="flex-1 md:flex-none py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-slate-700">
                 <Printer size={16} /> Pass
             </button>
             <button className="flex-1 md:flex-none py-2 px-4 bg-[#00FFCC] hover:bg-[#00FFCC]/90 text-slate-950 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-all">
                 <MessageSquare size={16} /> Message
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Financials & Biometrics (Swapped) */}
          <div className="space-y-6">
              
              {/* Financial Card (Shifted Up) */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CreditCard size={16} className="text-amber-500" /> Financials
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                          <div className="text-xs text-slate-500 mb-1">Current Plan</div>
                          <div className="text-sm font-bold text-white">{memberProfile.financials.plan}</div>
                      </div>
                      <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                          <div className="text-xs text-slate-500 mb-1">Next Billing</div>
                          <div className="text-sm font-bold text-white">{memberProfile.financials.nextBilling}</div>
                      </div>
                  </div>

                  {(memberProfile.financials.pendingFees !== '₹0.00') && (
                      <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3">
                          <AlertTriangle className="text-amber-500" size={20} />
                          <div>
                              <div className="text-sm font-bold text-amber-500">Pending Fees: {memberProfile.financials.pendingFees}</div>
                              <div className="text-xs text-amber-500/80">Immediate payment required</div>
                          </div>
                      </div>
                  )}

                  <div className="space-y-2">
                      <h4 className="text-xs font-medium text-slate-500 mb-3">Payment History</h4>
                      <table className="w-full text-xs text-left">
                          <thead className="text-slate-500 border-b border-slate-800">
                              <tr>
                                  <th className="pb-2">Date</th>
                                  <th className="pb-2">Amount</th>
                                  <th className="pb-2 text-right">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                              {memberProfile.financials.history.map((tx) => (
                                  <tr key={tx.id}>
                                      <td className="py-2 text-slate-300">{tx.date}</td>
                                      <td className="py-2 text-white font-medium">{tx.amount}</td>
                                      <td className="py-2 text-right">
                                          <span className="text-emerald-500">{tx.status}</span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* Biometrics Module (Shifted Down) */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Fingerprint size={16} className="text-[#00FFCC]" /> Access Control
                  </h3>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800 mb-6">
                      <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", memberProfile.biometrics.registered ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                              {memberProfile.biometrics.registered ? <Check size={20} /> : <X size={20} />}
                          </div>
                          <div>
                              <div className="text-sm font-bold text-white">Biometric Status</div>
                              <div className="text-xs text-slate-500">{memberProfile.biometrics.registered ? "Registered & Active" : "Not Registered"}</div>
                          </div>
                      </div>
                      <button className="text-xs text-slate-400 hover:text-white underline">Manage</button>
                  </div>

                  <div className="space-y-3">
                      <div className="flex items-center justify-between">
                          <h4 className="text-xs font-medium text-slate-500">Recent Access Log</h4>
                      </div>
                      
                      <div className="space-y-0 relative">
                          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-800" />
                          {displayedLogs.map((log) => (
                              <div key={log.id} className="relative pl-6 py-2 flex items-center justify-between group">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-900 border border-slate-700 group-hover:border-[#00FFCC] transition-colors z-10" />
                                  <div>
                                      <div className="text-sm font-medium text-white">{log.location}</div>
                                      <div className="text-xs text-slate-500">{log.time}</div>
                                  </div>
                                  <div className="text-xs text-slate-600 px-2 py-1 bg-slate-800/50 rounded border border-slate-800">
                                      {log.method}
                                  </div>
                              </div>
                          ))}
                      </div>

                      {memberProfile.biometrics.lastAccess.length > 3 && (
                          <button 
                            onClick={() => setShowAllLogs(!showAllLogs)}
                            className="w-full text-center text-xs text-slate-500 hover:text-[#00FFCC] transition-colors py-2 flex items-center justify-center gap-1"
                          >
                             {showAllLogs ? (
                                 <>Show Less <ChevronUp size={12} /></>
                             ) : (
                                 <>Show All Activity <ChevronDown size={12} /></>
                             )}
                          </button>
                      )}
                  </div>
              </div>
          </div>

          {/* Right Column: Wellness & Notes */}
          <div className="lg:col-span-2 space-y-6">
               <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-6">
                       <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                           <Activity size={16} className="text-[#00FFCC]" /> Growth & Wellness
                       </h3>
                       <div className="flex items-center gap-2 text-xs font-medium">
                           <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded text-slate-300">
                               <Clock size={12} className="text-emerald-500" /> Since {memberProfile.joinDate}
                           </span>
                       </div>
                   </div>

                   {/* KPI Cards */}
                   <div className="grid grid-cols-3 gap-4 mb-8">
                       <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
                           <div className="text-2xl font-black text-white">{memberProfile.wellness.visitsThisWeek}</div>
                           <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Avg. Visits/Wk</div>
                       </div>
                       <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
                           <div className="text-2xl font-black text-white">{memberProfile.wellness.totalVisits}</div>
                           <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Active Days</div>
                       </div>
                       <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
                           <div className="text-2xl font-black text-white">{memberProfile.wellness.anniversary}</div>
                           <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Anniversary</div>
                       </div>
                   </div>

                   {/* Heatmap */}
                   <div className="mb-8">
                       <h4 className="text-xs font-medium text-slate-500 mb-3">Attendance Heatmap (Last 12 Months)</h4>
                       <div className="flex gap-1 overflow-x-auto pb-2">
                           {Array.from({ length: 52 }).map((_, weekIndex) => (
                               <div key={weekIndex} className="grid grid-rows-7 gap-1">
                                   {Array.from({ length: 7 }).map((_, dayIndex) => {
                                       // Simulated data access
                                       const isActive = memberProfile.wellness.heatmap[weekIndex * 7 + dayIndex];
                                       return (
                                           <div 
                                               key={dayIndex} 
                                               className={cn(
                                                   "w-2.5 h-2.5 rounded-sm transition-all hover:scale-125",
                                                   isActive ? "bg-[#00FFCC] shadow-[0_0_4px_rgba(0,255,204,0.4)]" : "bg-slate-800/50"
                                               )}
                                               title={`Activity on Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
                                            />
                                       );
                                   })}
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Multi-Notes System */}
                   <div className="relative">
                       <div className="flex items-center justify-between mb-4">
                           <h4 className="text-xs font-medium text-slate-500">Trainer / Admin Notes</h4>
                           <button 
                                onClick={() => setIsAddingNote(true)}
                                className={cn("text-xs flex items-center gap-1 transition-colors px-2 py-1 bg-[#00FFCC]/10 text-[#00FFCC] rounded hover:bg-[#00FFCC]/20")}
                           >
                               <Plus size={12} /> Add Note
                           </button>
                       </div>
                       
                       {/* Add Note Input */}
                       {isAddingNote && (
                           <div className="mb-4 bg-slate-950 border border-slate-800 rounded-xl p-4 animate-in slide-in-from-top-2">
                               <textarea 
                                   value={newNoteContent}
                                   onChange={(e) => setNewNoteContent(e.target.value)}
                                   className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none resize-none h-20 mb-2"
                                   placeholder="Type note details here..."
                                   autoFocus
                               />
                               <div className="flex items-center justify-end gap-2">
                                   <button 
                                       onClick={() => setIsAddingNote(false)}
                                       className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded"
                                   >
                                       Cancel
                                   </button>
                                   <button 
                                       onClick={addNote}
                                       className="text-xs bg-[#00FFCC] text-slate-950 font-bold px-3 py-1.5 rounded hover:bg-[#00FFCC]/90"
                                   >
                                       Save Note
                                   </button>
                               </div>
                           </div>
                       )}

                       {/* Notes List */}
                       <div className="space-y-3">
                           {notes.map(note => (
                               <div key={note.id} className="group bg-slate-950/30 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors relative">
                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => startEdit(note)}
                                            className="text-slate-500 hover:text-white" 
                                            title="Edit"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button 
                                            onClick={() => deleteNote(note.id)}
                                            className="text-slate-500 hover:text-red-400" 
                                            title="Delete"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>

                                    {editingNoteId === note.id ? (
                                        // Edit Mode
                                        <div>
                                            <textarea 
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-slate-900 text-sm text-white p-2 rounded outline-none border border-[#00FFCC]/50 resize-none h-20 mb-2"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setEditingNoteId(null)} className="text-xs text-slate-400">Cancel</button>
                                                <button onClick={() => saveEdit(note.id)} className="text-xs text-[#00FFCC] font-bold">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <p className="text-sm text-slate-300 leading-relaxed mb-3 pr-8 whitespace-pre-wrap">{note.content}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                                <span>{note.date}</span>
                                                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                <span className="text-slate-400">{note.author}</span>
                                            </div>
                                        </>
                                    )}
                               </div>
                           ))}

                           {notes.length === 0 && (
                               <div className="text-center py-8 text-slate-500 text-sm italic">
                                   No notes added yet.
                               </div>
                           )}
                       </div>
                   </div>
               </div>
          </div>
      </div>
    </div>
  );
}
