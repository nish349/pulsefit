'use client';

import React, { useState } from 'react';
import {
  Building,
  Clock,
  ShieldCheck,
  Cpu,
  Bell,
  CreditCard,
  Save,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ServerCrash,
  Shield,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  // Section 1: Gym Profile
  const [profile, setProfile] = useState({
    gymName: 'PulseFit Downtown',
    address: '123 Market St',
    city: 'San Francisco',
    phone: '+1 415 555 0198',
    email: 'hello@pulsefit.com',
    timezone: 'PST'
  });

  // Section 2: Operational Mode
  const [opMode, setOpMode] = useState<'flexible' | '247'>('flexible');
  const [opModeSaved, setOpModeSaved] = useState(false);

  const handleOpModeChange = (mode: 'flexible' | '247') => {
    setOpMode(mode);
    setOpModeSaved(true);
    setTimeout(() => setOpModeSaved(false), 2000); // Hide "Saved" after 2s
  };

  // Section 3: Access Control
  const [accessControl, setAccessControl] = useState({
    qr: true,
    biometric: false,
    rfid: true,
    defaultMethod: 'qr',
    emergencyOverride: false
  });

  const handleAccessToggle = (key: keyof typeof accessControl) => {
    setAccessControl(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // Prevent disabling all
      if (!next.qr && !next.biometric && !next.rfid && key !== 'emergencyOverride' && key !== 'defaultMethod') {
        toast.error('At least one entry method must be active.');
        return prev;
      }
      toast.success('Access setting updated');
      return next;
    });
  };

  // Section 4: Hardware
  const [recalibrating, setRecalibrating] = useState<string | null>(null);

  const handleRecalibrate = (device: string) => {
    setRecalibrating(device);
    setTimeout(() => {
      setRecalibrating(null);
      toast.success(`${device} recalibrated successfully`);
    }, 2000);
  };

  // Section 5: Notifications
  const [notifications, setNotifications] = useState([
    { id: 'enrolled', label: 'New member enrolled', email: true, sms: false },
    { id: 'payment', label: 'Member payment received', email: true, sms: false },
    { id: 'overdue', label: 'Member payment overdue', email: true, sms: true },
    { id: 'expiring', label: 'Membership expiring within 7 days', email: true, sms: false },
    { id: 'expired', label: 'Membership expired with no renewal', email: true, sms: false },
    { id: 'frozen', label: 'Member frozen or unfrozen', email: true, sms: false },
    { id: 'denied', label: 'Access denied event', email: false, sms: false },
    { id: 'clocked', label: 'Staff member clocked in or out', email: false, sms: false },
    { id: 'health', label: 'System health status change', email: true, sms: true },
  ]);

  const handleNotifToggle = (id: string, channel: 'email' | 'sms') => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, [channel]: !n[channel] } : n
    ));
    toast.success('Notification preferences updated');
  };

  // Section 6: Billing
  const [billing, setBilling] = useState({
    gateway: 'Manual',
    currency: 'INR',
    taxRate: '18',
  });

  // Renderers for typical section containers
  const SectionHeader = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <p className="text-slate-400 text-sm ml-11">{description}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 pb-24">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure gym operations, hardware, and system preferences.</p>
      </div>

      {accessControl.emergencyOverride && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-500">
            <AlertTriangle size={20} />
            <span className="font-medium">Emergency QR Override is active. All biometric and RFID terminals are bypassed.</span>
          </div>
          <button
            onClick={() => setAccessControl(p => ({ ...p, emergencyOverride: false }))}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-medium rounded-lg transition-colors"
          >
            Deactivate Override
          </button>
        </div>
      )}

      {/* SECTION 1: Gym Profile */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SectionHeader
          icon={Building}
          title="Gym Profile"
          description="The gym's public-facing and operational identity."
        />
        <div className="grid grid-cols-2 gap-6 ml-11">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Gym Name</label>
              <input
                type="text"
                value={profile.gymName}
                onChange={e => setProfile({ ...profile, gymName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={e => setProfile({ ...profile, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Operating Timezone</label>
              <select
                value={profile.timezone}
                onChange={e => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="IST">IST (Indian Standard Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Address</label>
              <textarea
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                rows={1}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
        <div className="ml-11 mt-6 pt-6 border-t border-slate-800/50 flex justify-end">
          <button
            onClick={() => toast.success('Gym profile saved')}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            Save Profile
          </button>
        </div>
      </section>

      {/* SECTION 2: Operational Mode */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SectionHeader
          icon={Clock}
          title="Operational Mode"
          description="Controls the global default for how the facility operates."
        />
        <div className="ml-11 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleOpModeChange('flexible')}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              opMode === 'flexible'
                ? "bg-emerald-500/10 border-emerald-500/50"
                : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn("font-medium", opMode === 'flexible' ? "text-emerald-400" : "text-white")}>Flexible Hours</span>
              {opMode === 'flexible' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
            </div>
            <p className="text-sm text-slate-400">Default open and close times apply across all days unless overridden.</p>
          </button>

          <button
            onClick={() => handleOpModeChange('247')}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              opMode === '247'
                ? "bg-emerald-500/10 border-emerald-500/50"
                : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn("font-medium", opMode === '247' ? "text-emerald-400" : "text-white")}>24 / 7 Open</span>
              {opMode === '247' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
            </div>
            <p className="text-sm text-slate-400">Gym is always open. Time pickers hidden globally.</p>
          </button>
        </div>
        {opModeSaved && (
          <div className="ml-11 mt-4 flex items-center gap-2 text-emerald-500 text-sm animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} />
            <span>Mode saved instantly</span>
          </div>
        )}
      </section>

      {/* SECTION 3: Access Control */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SectionHeader
          icon={ShieldCheck}
          title="Access Control Configuration"
          description="Determine which entry methods are active across the facility."
        />

        <div className="ml-11 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div>
                <div className="text-white font-medium mb-1">QR Code</div>
                <div className="text-xs text-slate-400">App-based entry</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={accessControl.qr} onChange={() => handleAccessToggle('qr')} />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div>
                <div className="text-white font-medium mb-1">Biometric</div>
                <div className="text-xs text-slate-400">Fingerprint / Face</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={accessControl.biometric} onChange={() => handleAccessToggle('biometric')} />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div>
                <div className="text-white font-medium mb-1">RFID / Keycard</div>
                <div className="text-xs text-slate-400">Physical card entry</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={accessControl.rfid} onChange={() => handleAccessToggle('rfid')} />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div>
              <div className="text-white font-medium mb-1">Default Entry Method</div>
              <div className="text-xs text-slate-400">Assigned automatically to new members</div>
            </div>
            <select
              value={accessControl.defaultMethod}
              onChange={e => {
                setAccessControl(p => ({ ...p, defaultMethod: e.target.value }));
                toast.success('Default method updated');
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              {accessControl.qr && <option value="qr">QR Code</option>}
              {accessControl.biometric && <option value="biometric">Biometric</option>}
              {accessControl.rfid && <option value="rfid">RFID / Keycard</option>}
            </select>
          </div>

          <div className="flex flex-col items-start gap-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div>
              <div className="text-amber-500 font-medium mb-1 flex items-center gap-2">
                <ServerCrash size={18} /> Emergency QR Override
              </div>
              <div className="text-sm text-slate-400">Instantly switches all active entry terminals to QR only. Use when biometric or RFID hardware fails.</div>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to activate Emergency QR Override? This overrides all other access methods.")) {
                  setAccessControl(p => ({ ...p, emergencyOverride: true }));
                  toast.success('Emergency QR Override Active');
                }
              }}
              disabled={accessControl.emergencyOverride}
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Activate Emergency Override
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: Hardware Integration */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SectionHeader
          icon={Cpu}
          title="Hardware Integration"
          description="Connection status and configuration for connected physical systems."
        />
        <div className="ml-11">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 uppercase font-medium text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Hardware</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr>
                <td className="px-4 py-4 text-white font-medium">Smart Lockers</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">Configure</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-white font-medium">Door Biometric System</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Online</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => handleRecalibrate('Biometric System')}
                    disabled={recalibrating === 'Biometric System'}
                    className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors disabled:opacity-50"
                  >
                    {recalibrating === 'Biometric System' ? 'Recalibrating...' : 'Recalibrate'}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-white font-medium">HVAC System</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Operational</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">Configure</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-white font-medium">Access Control Panel</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Online</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => handleRecalibrate('Access Control')}
                    disabled={recalibrating === 'Access Control'}
                    className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors disabled:opacity-50"
                  >
                    {recalibrating === 'Access Control' ? 'Recalibrating...' : 'Recalibrate'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: Notifications */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Controls which system events trigger alerts and delivery methods."
        />
        <div className="ml-11">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-800/50 bg-slate-900/50 text-xs font-medium text-slate-400 uppercase">
              <div className="col-span-6">Trigger Event</div>
              <div className="col-span-2 text-center">In-App</div>
              <div className="col-span-2 text-center">Email</div>
              <div className="col-span-2 text-center">SMS</div>
            </div>
            <div className="divide-y divide-slate-800/50">
              {notifications.map(notif => (
                <div key={notif.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/20 transition-colors">
                  <div className="col-span-6 text-sm text-white font-medium">{notif.label}</div>
                  <div className="col-span-2 flex justify-center">
                    <input type="checkbox" checked disabled className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="checkbox"
                      checked={notif.email}
                      onChange={() => handleNotifToggle(notif.id, 'email')}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 bg-slate-800 border-slate-700 cursor-pointer"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="checkbox"
                      checked={notif.sms}
                      onChange={() => handleNotifToggle(notif.id, 'sms')}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 bg-slate-800 border-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex justify-end">
            * In-App notifications cannot be disabled for critical system events.
          </div>
        </div>
      </section>

      {/* SECTION 6: Billing & Payment Gateway */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SectionHeader
          icon={CreditCard}
          title="Billing & Payment Gateway"
          description="Simplified configuration for invoicing and payment channels."
        />
        <div className="ml-11 grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Payment Gateway</label>
              <select
                value={billing.gateway}
                onChange={e => setBilling({ ...billing, gateway: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Stripe">Stripe</option>
                <option value="Razorpay">Razorpay</option>
                <option value="PayU">PayU</option>
                <option value="Manual">Manual (Cash / External POS)</option>
              </select>
              {billing.gateway === 'Manual' && (
                <p className="mt-2 text-xs text-slate-400">Payments are recorded by staff without integration.</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Currency</label>
                <select
                  value={billing.currency}
                  onChange={e => setBilling({ ...billing, currency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tax Rate (%)</label>
                <input
                  type="number"
                  value={billing.taxRate}
                  onChange={e => setBilling({ ...billing, taxRate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="ml-11 mt-6 pt-6 border-t border-slate-800/50 flex flex-row-reverse justify-between items-center">
          <button
            onClick={() => toast.success('Billing configuration saved')}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            Save Configuration
          </button>
        </div>
      </section>

      {/* SECTION 8: Data & Privacy */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SectionHeader
          icon={Shield}
          title="Data & Privacy"
          description="Controls for data retention and export at the system level."
        />
        <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Data Retention Period</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                defaultValue="5"
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="5">5 years</option>
                <option value="Forever">Forever</option>
              </select>
              <p className="mt-2 text-xs text-slate-400">Logs and records older than the selected period are archived automatically.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Export All Data</label>
              <button
                onClick={() => toast.success('Data export initiated. You will receive an email shortly.')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
              >
                <Download size={16} />
                Generate Full Export
              </button>
              <p className="mt-2 text-xs text-slate-400">Generates a ZIP export of all gym data (members, transactions, logs).</p>
            </div>
          </div>
        </div>

        <div className="ml-11 mt-8 pt-6 border-t border-slate-800/50">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-500 mb-1">Danger Zone</h4>
                <p className="text-xs text-slate-400 mb-4">This action is permanent and cannot be undone. All data will be irreversibly erased.</p>
                <button
                  onClick={() => {
                    const confirm = window.prompt('Type the gym name to confirm deletion of all data:');
                    if (confirm) {
                      toast.error('Data deletion confirmed. Action irreversible.');
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
