'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { pricingPlans, validPromoCodes } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Loader2, Tag, X } from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialPlanId = searchParams.get('plan') || 'basic';
  const router = useRouter();
  
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string, value: number, type: 'percent' | 'fixed' } | null>(null);
  const [promoStatus, setPromoStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [promoMessage, setPromoMessage] = useState('');

  // Effect to update selected plan if URL changes (though unlikely in this flow)
  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setSelectedPlanId(plan);
    }
  }, [searchParams]);

  const selectedPlan = pricingPlans.find(p => p.id === selectedPlanId) || pricingPlans[0];
  const basePrice = parseInt(selectedPlan.price.replace('₹', ''));
  
  const finalPrice = appliedDiscount 
    ? appliedDiscount.type === 'percent' 
      ? basePrice - (basePrice * appliedDiscount.value / 100)
      : Math.max(0, basePrice - appliedDiscount.value)
    : basePrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePromoCode = async () => {
    // 1. Basic Cleanup & Security Check
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      setPromoStatus('error');
      setPromoMessage('Please enter a code');
      return;
    }

    // Regex: Only alphanumeric, 3-15 chars. Prevents basic injection attempts.
    const securePattern = /^[A-Z0-9]{3,15}$/;
    if (!securePattern.test(code)) {
       setPromoStatus('error');
       setPromoMessage('Invalid code format');
       return;
    }

    setPromoStatus('validating');

    // 2. Simulate Network Delay (Rate Limiting / Security)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Validation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setStep(2); // Move to success step
  };

  if (step === 2) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="w-20 h-20 bg-neon rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="text-slate-950 w-10 h-10" strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Welcome to the Club!</h2>
        <p className="text-slate-400 mb-8">
          Your membership for the <span className="text-neon font-bold">{selectedPlan.name}</span> has been confirmed. 
          We've sent a welcome email to {formData.email}.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
        >
          Back to Home <ChevronRight size={18} />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left Column - Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white px-1 tracking-tighter mb-4">
            Join PulseFit
          </h1>
          <p className="text-slate-400 text-lg">
            You're one step away from transforming your life. Fill in the details below to complete your registration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-300 ml-1">Phone Number</label>
             <input 
                type="tel" 
                name="phone"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
             />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-neon text-slate-950 font-black text-lg py-4 rounded-xl hover:bg-neon-hover shadow-lg shadow-neon/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Complete Registration <ChevronRight size={20} />
                </>
              )}
            </button>
            <p className="text-center text-slate-500 text-xs mt-4">
              By clicking "Complete Registration", you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </motion.div>

      {/* Right Column - Plan Selection */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">Select Membership Plan</h3>
        <div className="space-y-4 mb-8">
          {pricingPlans.map((plan) => (
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
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedPlanId === plan.id 
                    ? "border-neon bg-neon text-slate-950" 
                    : "border-slate-600 text-transparent"
                )}>
                  <div className="w-2.5 h-2.5 bg-current rounded-full" />
                </div>
                <div>
                   <h4 className={cn("font-bold", selectedPlanId === plan.id ? "text-white" : "text-slate-300")}>
                      {plan.name}
                   </h4>
                   <div className="text-xs text-slate-500">
                      {plan.features[0]} + {plan.features.length - 1} more
                   </div>
                </div>
              </div>
              <div className="text-lg font-black text-white">
                {plan.price}<span className="text-xs font-medium text-slate-500">/mo</span>
              </div>
            </div>
          ))}
        </div>

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
               title="Apply promo code" // Added title for better accessibility
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

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon/10 blur-[120px] -z-10 rounded-full mix-blend-screen" />
       
       <Suspense fallback={
         <div className="flex items-center justify-center min-h-[50vh]">
           <Loader2 className="animate-spin text-neon w-10 h-10" />
         </div>
       }>
          <RegisterForm />
       </Suspense>
    </div>
  );
}
