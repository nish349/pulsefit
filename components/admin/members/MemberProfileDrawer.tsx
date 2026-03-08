import React from 'react';
import { Member } from '@/lib/mock/members';
import { X, Mail, Phone, Calendar, CreditCard, Activity, FileText, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MemberProfileDrawerProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, member: Member) => void;
}

export function MemberProfileDrawer({ member, isOpen, onClose, onAction }: MemberProfileDrawerProps) {
  if (!member) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[500px] bg-[#161b27] border-l border-[#1e2a3a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#1e2a3a] bg-[#1a2235]">
          <h2 className="text-lg font-bold text-slate-100">Member Profile</h2>
          <button onClick={onClose} className="p-2 bg-[#0d1117] hover:bg-slate-800 text-slate-400 rounded-lg transition-colors border border-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-24">

          {/* Header Info */}
          <div className="flex items-start gap-4 mb-8">
            <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-inner", member.avatarColor)}>
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-100 mb-1">{member.firstName} {member.lastName}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  {member.tier}
                </span>
                <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider text-green-400">
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">ID: {member.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button onClick={() => onAction('message', member)} className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
              <Mail className="w-3.5 h-3.5" /> Message
            </button>
            <button onClick={() => onAction('edit', member)} className="bg-[#1a2235] hover:bg-slate-800 border border-[#1e2a3a] text-slate-300 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
              Edit Details
            </button>
          </div>

          <div className="space-y-6">

            {/* Personal Details */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1 flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5" /> Personal Details
              </h3>
              <div className="bg-[#1a2235] rounded-xl border border-[#1e2a3a] overflow-hidden">
                <div className="divide-y divide-[#1e2a3a]">
                  <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={member.email} />
                  <DetailRow icon={<Phone className="w-4 h-4" />} label="Phone" value={member.phone} />
                  <DetailRow icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={format(new Date(member.dateOfBirth), 'MMM d, yyyy')} />
                  <DetailRow icon={<UsersIcon className="w-4 h-4" />} label="Gender" value={member.gender} />
                </div>
              </div>
            </section>

            {/* Membership Details */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1 flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> Membership Info
              </h3>
              <div className="bg-[#1a2235] rounded-xl border border-[#1e2a3a] overflow-hidden">
                <div className="divide-y divide-[#1e2a3a]">
                  <DetailRow label="Join Date" value={format(new Date(member.joinDate), 'MMMM d, yyyy')} />
                  <DetailRow label="Est. Expiry" value={format(new Date(member.expiryDate), 'MMMM d, yyyy')} valueClass={new Date(member.expiryDate) < new Date() ? 'text-red-400 font-bold' : ''} />
                  <DetailRow label="Last Check-in" value={member.lastCheckIn ? format(new Date(member.lastCheckIn), 'MMM d, yyyy @ h:mm a') : 'Never'} />
                </div>
              </div>
            </section>

            {/* Recent Payments */}
            {member.recentPayments && member.recentPayments.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> Recent Payments
                </h3>
                <div className="bg-[#1a2235] rounded-xl border border-[#1e2a3a] overflow-hidden">
                  <div className="divide-y divide-[#1e2a3a]">
                    {member.recentPayments.map((p, i) => (
                      <div key={i} className="flex justify-between items-center p-3 text-sm">
                        <div className="flex gap-3 items-center">
                          <div className={cn("w-2 h-2 rounded-full", p.status === 'Success' ? 'bg-green-500' : 'bg-red-500')} />
                          <span className="text-slate-300">{format(new Date(p.date), 'MMM d, yyyy')}</span>
                        </div>
                        <span className="font-bold text-slate-200">${p.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Notes */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Staff Notes
              </h3>
              <div className="bg-[#1a2235] rounded-xl border border-[#1e2a3a] p-4 text-sm text-slate-300 min-h-[100px]">
                {member.notes ? member.notes : <span className="text-slate-500 italic">No notes on file.</span>}
              </div>
            </section>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#161b27] border-t border-[#1e2a3a] flex gap-2 w-full justify-between">
          <button onClick={() => onAction('freeze', member)} className="flex-1 bg-[#1a2235] hover:bg-slate-800 border border-[#1e2a3a] text-slate-300 py-3 rounded-xl text-xs font-bold transition-colors">
            {member.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}
          </button>
          <button onClick={() => onAction('renew', member)} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl text-xs font-bold transition-colors">
            Renew Plan
          </button>
        </div>

      </div>
    </>
  );
}

function DetailRow({ icon, label, value, valueClass }: { icon?: React.ReactNode, label: string, value: string, valueClass?: string }) {
  return (
    <div className="flex justify-between items-center p-3">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
        {icon} {label}
      </div>
      <div className={cn("text-sm text-slate-200", valueClass)}>
        {value}
      </div>
    </div>
  );
}

// Minimal Icons to save imports
function UserIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> }
function UsersIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> }
