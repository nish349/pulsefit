
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { validPromoCodes } from '@/lib/constants';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Loader2, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { createMember } from '@/app/actions/members';

// Define strict type for Plans coming from DB
type Plan = {
  id: number;
  name: string;
  price: number;
  features: string[] | null;
  isActive: boolean | null;
};

interface RegisterFormProps {
  plans: Plan[];
}

export default function RegisterForm({ plans }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const initialPlanIdParam = searchParams.get('plan');
  const initialPlanId = initialPlanIdParam ? parseInt(initialPlanIdParam) : (plans[0]?.id || 0);

  const [selectedPlanId, setSelectedPlanId] = useState<number>(initialPlanId);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Review & Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    address: '',
  });

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string, value: number, type: 'percent' | 'fixed' } | null>(null);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [promoMessage, setPromoMessage] = useState('');

  // Update selected plan if URL changes
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam) {
      const pId = parseInt(planParam);
      if (plans.find(p => p.id === pId)) {
        // eslint-disable-next-line
        setSelectedPlanId(pId);
      }
    }
  }, [searchParams, plans]);

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center text-white py-20">
        <h2 className="text-2xl font-bold mb-4">Registration Unavailable</h2>
        <p className="text-slate-400">There are currently no active membership plans. Please check back later.</p>
      </div>
    );
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const basePrice = selectedPlan.price;

  const finalPrice = appliedDiscount
    ? appliedDiscount.type === 'percent'
      ? basePrice - (basePrice * appliedDiscount.value / 100)
      : Math.max(0, basePrice - appliedDiscount.value)
    : basePrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setOtpMessage("Enter a valid phone number");
      return;
    }
    setOtpLoading(true);
    // Mock API call
    await new Promise(r => setTimeout(r, 1000));
    setOtpLoading(false);
    setOtpSent(true);
    setOtpMessage("OTP sent: 123456"); // Hint for user
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setOtpLoading(false);

    // Master OTP Check
    if (enteredOtp === "123456") {
      setOtpVerified(true);
      setOtpMessage("");
    } else {
      setOtpMessage("Invalid OTP");
    }
  };

  const validatePromoCode = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoStatus('error');
      setPromoMessage('Please enter a code');
      return;
    }

    const securePattern = /^[A-Z0-9]{3,15}$/;
    if (!securePattern.test(code)) {
      setPromoStatus('error');
      setPromoMessage('Invalid code format');
      return;
    }

    setPromoStatus('validating');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const validCode = validPromoCodes.find(c => c.code === code);

    if (validCode) {
      setAppliedDiscount({ code: validCode.code, value: validCode.value, type: validCode.discountType });
      setPromoStatus('success');
      setPromoMessage(`${validCode.discountType === 'percent' ? validCode.value + '%' : '₹' + validCode.value} discount applied!`);
    } else {
      setAppliedDiscount(null);
      setPromoStatus('error');
      setPromoMessage('Invalid or expired code');
    }
  };

  const handleApplyPromo = (e: React.MouseEvent) => {
    e.preventDefault();
    validatePromoCode();
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setPromoCode('');
    setPromoStatus('idle');
    setPromoMessage('');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify your phone number first.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await createMember({
        ...formData,
        gender: formData.gender as 'male' | 'female' | 'other',
        planId: selectedPlanId,
        status: 'pending_payment',
        role: 'member',
        dob: new Date(),
      });
      setLoading(false);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      alert("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  // --- Step 3: Success & Onboarding ---
  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center"
      >
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <Check className="text-slate-950 w-12 h-12" strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome to the Club, {formData.firstName}!</h2>
        <p className="text-xl text-slate-400 mb-8">
          Your <span className="text-neon font-bold">{selectedPlan.name}</span> spot is reserved.
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 text-left flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 mt-0.5">
            <Loader2 className="animate-spin-slow" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-500 text-sm uppercase tracking-wider mb-1">Action Required</h4>
            <p className="text-sm text-slate-300">
              We&apos;ll verify your details at the reception.
              Password setup instructions will be sent to <span className="text-white font-medium">{formData.email}</span> later.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-neon text-slate-950 px-8 py-4 rounded-xl font-bold hover:bg-neon-hover transition-all shadow-lg hover:shadow-neon/20 transform hover:-translate-y-1"
        >
          Go to Member Dashboard <ChevronRight size={20} />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

      {/* Left Column - Main Content */}
      <div className="lg:col-span-7 space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white px-1 tracking-tighter mb-4">
            {step === 1 ? 'Join PulseFit' : 'Review & Pay'}
          </h1>
          <p className="text-slate-400 text-lg">
            {step === 1
              ? "You're one step away from transforming your life. Fill in the details below."
              : "Review your details and select a payment method to secure your spot."}
          </p>
        </div>

        {/* --- Step 2: Review (Summary) --- */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white text-lg">Personal Details</h3>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-neon hover:underline font-medium"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <div className="text-slate-500">Name</div>
                <div className="text-white font-medium">{formData.firstName} {formData.lastName}</div>
              </div>
              <div>
                <div className="text-slate-500">Phone</div>
                <div className="text-white font-medium">{formData.phone}</div>
              </div>
              <div>
                <div className="text-slate-500">Email</div>
                <div className="text-white font-medium truncate">{formData.email}</div>
              </div>
              <div className="col-span-2">
                <div className="text-slate-500">Address</div>
                <div className="text-white font-medium">{formData.address}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Step 1: Form Fields --- */}
        <form onSubmit={handleNextStep} className={cn("space-y-6", step !== 1 && "hidden")}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all"
                placeholder="Jane"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Gender</label>
              <select
                name="gender"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' | '' }))}
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-bold text-slate-300 ml-1">Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  name="phone"
                  required
                  disabled={otpVerified}
                  className={cn(
                    "w-full bg-slate-900 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all",
                    otpVerified ? "border-green-500/50 text-green-400" : "border-white/10 focus:border-neon/50 focus:ring-1 focus:ring-neon/50"
                  )}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* OTP Section (Under Phone) */}
          <div className="-mt-4 mb-4">
            {!otpSent && !otpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!formData.phone || formData.phone.length < 10 || otpLoading}
                className="text-sm font-bold text-neon hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {otpLoading ? "Sending..." : "Verify Phone Number"}
              </button>
            )}

            {otpSent && !otpVerified && (
              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 mt-2">
                <label className="text-xs font-bold text-slate-400 block mb-2">Enter OTP sent to {formData.phone}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-32 bg-slate-950 border border-white/20 rounded-lg px-3 py-2 text-white text-center tracking-widest font-mono"
                    placeholder="OTP"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || enteredOtp.length !== 6}
                    className="bg-neon text-slate-950 font-bold px-4 rounded-lg text-sm hover:bg-neon-hover disabled:opacity-50"
                  >
                    {otpLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify"}
                  </button>
                </div>
                {otpMessage && <p className="text-xs text-neon mt-2">{otpMessage}</p>}
              </div>
            )}

            {otpVerified && (
              <div className="flex items-center gap-2 text-green-400 text-sm mt-2 font-bold">
                <Check size={16} strokeWidth={3} /> Phone Number Verified
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 ml-1">Address</label>
            <input
              type="text"
              name="address"
              required
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all"
              placeholder="123 Gym Street, Fitness City"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!otpVerified}
              className="w-full bg-neon text-slate-950 font-black text-lg py-4 rounded-xl hover:bg-neon-hover shadow-lg shadow-neon/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpVerified ? "Proceed to Payment" : "Verify Phone to Continue"} <ChevronRight size={20} />
            </button>
            <p className="text-center text-slate-500 text-xs mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>


        {/* --- Step 2: Payment Selector & Actions --- */}
        {step === 2 && (
          <div className="space-y-6">

            {/* No Password Field Here anymore (Passwordless) */}

            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Select Payment Method</h3>

              {/* Option A: Online */}
              <div
                onClick={() => setPaymentMethod('online')}
                className={cn(
                  "cursor-pointer border rounded-xl p-5 flex items-center gap-4 transition-all relative overflow-hidden",
                  paymentMethod === 'online' ? "bg-slate-800 border-neon ring-1 ring-neon/50" : "bg-slate-900/50 border-white/10 hover:border-white/20"
                )}
              >
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", paymentMethod === 'online' ? "border-neon bg-neon" : "border-slate-500")}>
                  {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-1">Pay Online</div>
                  <div className="text-sm text-slate-400">Credit Card, Debit Card, UPI</div>
                </div>
                <div className="flex gap-2 opacity-50">
                  {/* Payment Logos Placeholder */}
                  <div className="w-8 h-5 bg-white/20 rounded"></div>
                  <div className="w-8 h-5 bg-white/20 rounded"></div>
                </div>
              </div>

              {/* Option B: Pay at Gym */}
              <div
                onClick={() => setPaymentMethod('offline')}
                className={cn(
                  "cursor-pointer border rounded-xl p-5 flex items-center gap-4 transition-all relative overflow-hidden",
                  paymentMethod === 'offline' ? "bg-slate-800 border-neon ring-1 ring-neon/50" : "bg-slate-900/50 border-white/10 hover:border-white/20"
                )}
              >
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", paymentMethod === 'offline' ? "border-neon bg-neon" : "border-slate-500")}>
                  {paymentMethod === 'offline' && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white mb-1 flex items-center gap-2">
                    Pay at Gym
                    <span className="text-[10px] uppercase font-bold text-slate-950 bg-neon px-1.5 py-0.5 rounded">Recommended</span>
                  </div>
                  <div className="text-sm text-slate-400">Complete your registration now and pay when you arrive for your first workout.</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={loading}
              className="w-full bg-neon text-slate-950 font-black text-lg py-4 rounded-xl hover:bg-neon-hover shadow-lg shadow-neon/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  {paymentMethod === 'online' ? `Pay ₹${finalPrice.toFixed(2)} Now` : 'Confirm Booking'}
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Right Column - Plan Selection & Summary */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-5 bg-slate-900/50 border border-white/5 rounded-3xl p-6 md:p-8 sticky top-32"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          {step === 1 ? 'Select Membership Plan' : 'Order Summary'}
        </h3>

        {/* Step 1: Interactive Plan Selector */}
        {step === 1 ? (
          <div className="space-y-4 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "cursor-pointer border rounded-2xl p-4 transition-all duration-200 flex items-center justify-between group",
                  selectedPlanId === plan.id
                    ? "bg-slate-800 border-neon/50 ring-1 ring-neon/50"
                    : "bg-slate-950/50 border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className={cn("font-bold", selectedPlanId === plan.id ? "text-white" : "text-slate-300")}>
                      {plan.name}
                    </h4>
                  </div>
                </div>
                <div className="text-lg font-black text-white">
                  ₹{plan.price}<span className="text-xs font-medium text-slate-500">/mo</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Step 2: Static Plan Display
          <div className="mb-8 p-4 rounded-2xl bg-slate-800 border border-white/10 flex justify-between items-center group">
            <div>
              <h4 className="font-bold text-white">{selectedPlan.name}</h4>
              <span className="text-xs text-slate-400">Billed Monthly</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">₹{selectedPlan.price}</div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-neon hover:underline"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Promo Code Section */}
        <div className="mb-8">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Promo Code</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  if (promoStatus === 'error') {
                    setPromoStatus('idle');
                    setPromoMessage('');
                  }
                }}
                disabled={promoStatus === 'success' || promoStatus === 'validating'}
                placeholder="Enter code"
                className={cn(
                  "w-full bg-slate-950/80 border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none transition-all uppercase",
                  promoStatus === 'error' ? "border-red-500 text-red-100" :
                    promoStatus === 'success' ? "border-green-500 text-green-100" :
                      "border-white/10 text-white focus:border-neon/50"
                )}
              />
              {promoStatus === 'success' && (
                <button
                  onClick={handleRemovePromo}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={handleApplyPromo}
              disabled={!promoCode || promoStatus === 'validating' || promoStatus === 'success'}
              className="bg-white/10 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {promoStatus === 'validating' ? <Loader2 className="animate-spin w-4 h-4" /> : 'Apply'}
            </button>
          </div>

          {/* Validation Message */}
          {promoMessage && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-xs mt-2 font-medium flex items-center gap-1.5",
                promoStatus === 'success' ? "text-green-400" : "text-red-400"
              )}
            >
              {promoStatus === 'success' && <Check size={12} strokeWidth={4} />}
              {promoMessage}
            </motion.p>
          )}
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-white font-medium">₹{basePrice}</span>
          </div>

          {appliedDiscount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-between items-center mb-4 text-neon"
            >
              <span className="flex items-center gap-2">
                <Tag size={14} />
                <span>Discount ({appliedDiscount.code})</span>
              </span>
              <span className="font-bold">
                -{appliedDiscount.type === 'percent'
                  ? `${appliedDiscount.value}%`
                  : `₹${appliedDiscount.value}`}
              </span>
            </motion.div>
          )}

          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Initiation Fee</span>
            <span className="text-neon font-medium">WAIVED</span>
          </div>
          <div className="flex justify-between items-center text-xl font-black text-white pt-4 border-t border-white/5">
            <span>Total today</span>
            <div className="text-right">
              {appliedDiscount && (
                <span className="text-sm text-slate-500 line-through mr-2 block font-medium">₹{basePrice}</span>
              )}
              <span>₹{finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
