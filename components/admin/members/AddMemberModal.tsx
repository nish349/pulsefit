import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Smartphone, Fingerprint, Key, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addMonths, addYears, format } from 'date-fns';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMemberModal({ isOpen, onClose, onSuccess }: AddMemberModalProps) {
  const [step, setStep] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tier: 'Basic',
    duration: '1_month',
    accessBluetooth: true,
    accessFob: false,
    accessBiometric: false,
  });

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setHasUnsavedChanges(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        tier: 'Basic',
        duration: '1_month',
        accessBluetooth: true,
        accessFob: false,
        accessBiometric: false,
      });
      setEmailAvailable(null);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setHasUnsavedChanges(true);
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'email') {
      if (value.includes('@') && value.includes('.')) {
        setEmailAvailable(true); // Mock check
      } else {
        setEmailAvailable(null);
      }
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Discard changes?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Keyboard Escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasUnsavedChanges]);

  if (!isOpen) return null;

  const calculateExpiry = () => {
    const today = new Date();
    if (formData.duration === '1_month') return addMonths(today, 1);
    if (formData.duration === '3_months') return addMonths(today, 3);
    if (formData.duration === '1_year') return addYears(today, 1);
    return today;
  };

  const currentExpiry = calculateExpiry();

  const handleEnroll = () => {
    // Mock save
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[#161b27] border border-[#1e2a3a] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e2a3a] bg-[#0d1117]">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Member</h2>
            <p className="text-sm text-slate-400">Step {step} of 4</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Multi-step indicator */}
        <div className="flex h-1 bg-[#1e2a3a]">
          <div className={cn("h-full bg-emerald-500 transition-all duration-300",
            step === 1 ? "w-1/4" : step === 2 ? "w-2/4" : step === 3 ? "w-3/4" : "w-full")}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">

          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#1e2a3a] rounded-lg p-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#1e2a3a] rounded-lg p-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      "w-full bg-[#0d1117] border border-[#1e2a3a] rounded-lg p-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all pr-10",
                      emailAvailable && "border-emerald-500/50"
                    )}
                    placeholder="john@example.com"
                  />
                  {emailAvailable && (
                    <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
                {emailAvailable && <p className="text-xs text-emerald-500">Email is available</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#1e2a3a] rounded-lg p-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          )}

          {/* Step 2: Membership */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-slate-200">Membership Setup</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => handleInputChange('tier', e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#1e2a3a] rounded-lg p-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="Basic">Basic - $49/mo</option>
                  <option value="Silver">Silver - $79/mo</option>
                  <option value="Gold">Gold - $99/mo</option>
                  <option value="Platinum">Platinum - $149/mo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#1e2a3a] rounded-lg p-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="1_month">1 Month (Rolling)</option>
                  <option value="3_months">3 Months (Prepaid)</option>
                  <option value="1_year">1 Year (Contract)</option>
                </select>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-300">Calculated Expiry</h4>
                  <p className="text-xs text-slate-500 mt-1">Based on today + duration selected</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">
                    {format(currentExpiry, 'MMM d, yyyy')}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Step 3: Access */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-semibold text-slate-200">Access Methods</h3>
              <p className="text-sm text-slate-400 mb-4">Select how this member can enter the facility.</p>

              <div className="grid grid-cols-1 gap-3">

                {/* Mobile App */}
                <button
                  onClick={() => handleInputChange('accessBluetooth', !formData.accessBluetooth)}
                  className={cn(
                    "flex items-center p-4 rounded-xl border text-left transition-all",
                    formData.accessBluetooth ? "bg-emerald-500/10 border-emerald-500" : "bg-[#0d1117] border-[#1e2a3a] hover:border-slate-600"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-4", formData.accessBluetooth ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400")}>
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-200">Mobile App (Bluetooth)</h4>
                    <p className="text-xs text-slate-500">Member uses Pulse smartphone app</p>
                  </div>
                  <div className={cn("w-5 h-5 rounded border flex items-center justify-center", formData.accessBluetooth ? "bg-emerald-500 border-emerald-500" : "border-slate-600")}>
                    {formData.accessBluetooth && <CheckCircle2 size={14} className="text-slate-900" />}
                  </div>
                </button>

                {/* Key Fob */}
                <button
                  onClick={() => handleInputChange('accessFob', !formData.accessFob)}
                  className={cn(
                    "flex items-center p-4 rounded-xl border text-left transition-all",
                    formData.accessFob ? "bg-emerald-500/10 border-emerald-500" : "bg-[#0d1117] border-[#1e2a3a] hover:border-slate-600"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-4", formData.accessFob ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400")}>
                    <Key size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-200">Physical Key Fob</h4>
                    <p className="text-xs text-slate-500">Assign a physical NFC fob</p>
                  </div>
                  <div className={cn("w-5 h-5 rounded border flex items-center justify-center", formData.accessFob ? "bg-emerald-500 border-emerald-500" : "border-slate-600")}>
                    {formData.accessFob && <CheckCircle2 size={14} className="text-slate-900" />}
                  </div>
                </button>

                {/* Biometric */}
                <button
                  onClick={() => handleInputChange('accessBiometric', !formData.accessBiometric)}
                  className={cn(
                    "flex items-center p-4 rounded-xl border text-left transition-all",
                    formData.accessBiometric ? "bg-emerald-500/10 border-emerald-500" : "bg-[#0d1117] border-[#1e2a3a] hover:border-slate-600"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-4", formData.accessBiometric ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400")}>
                    <Fingerprint size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-200">Biometric Scan</h4>
                    <p className="text-xs text-slate-500">Requires front desk fingerprint setup</p>
                  </div>
                  <div className={cn("w-5 h-5 rounded border flex items-center justify-center", formData.accessBiometric ? "bg-emerald-500 border-emerald-500" : "border-slate-600")}>
                    {formData.accessBiometric && <CheckCircle2 size={14} className="text-slate-900" />}
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Review & Enroll</h3>
                <p className="text-sm text-slate-400">Please confirm member details below.</p>
              </div>

              <div className="bg-[#0d1117] rounded-xl border border-[#1e2a3a] divide-y divide-[#1e2a3a]">
                <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block mb-1">Name</span>
                    <span className="text-slate-200 font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Contact</span>
                    <span className="text-slate-200 font-medium">{formData.email}</span>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block mb-1">Plan</span>
                    <span className="text-slate-200 font-medium">{formData.tier} Tier</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Expiry Date</span>
                    <span className="text-emerald-400 font-bold">{format(currentExpiry, 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="p-4 text-sm">
                  <span className="text-slate-500 block mb-2">Enabled Access Methods</span>
                  <div className="flex gap-2">
                    {formData.accessBluetooth && <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-medium">Mobile App</span>}
                    {formData.accessFob && <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-medium">Key Fob</span>}
                    {formData.accessBiometric && <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-medium">Biometric</span>}
                    {!formData.accessBluetooth && !formData.accessFob && !formData.accessBiometric && <span className="text-amber-500 text-xs">No active access methods selected</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="p-6 border-t border-[#1e2a3a] bg-[#0d1117] flex justify-between items-center rounded-b-2xl">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 1 && (!formData.firstName || !formData.email)) {
                  alert('Please fill required fields (Name, Email)');
                  return;
                }
                setStep(s => s + 1);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 size={16} /> Enroll Member
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
