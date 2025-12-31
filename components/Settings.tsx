
import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
import { ICONS } from '../constants.tsx';
import { Lock, CreditCard, ShieldCheck, LogOut } from 'lucide-react';

interface SettingsProps {
  user: UserProfile | null;
  onLogout: () => void;
  onUpgrade: () => void;
  leadsCount: number;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogout, onUpgrade, leadsCount }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isPro = user?.plan === 'PRO';
  const limit = 5; // Updated limit
  const percentage = Math.min((leadsCount / limit) * 100, 100);

  const handleSimulatedCheckout = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      onUpgrade();
      setIsProcessing(false);
      setIsCheckoutOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-serif">Account</h2>
        <button 
          onClick={() => { if(confirm('Logout?')) onLogout(); }}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors bg-white/5 px-4 py-2 rounded-xl"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        {isPro && (
          <div className="absolute top-4 right-4 text-blue-400/20">
            <ShieldCheck size={48} />
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-white/10 to-white/20 border border-white/10 flex items-center justify-center text-2xl font-serif">
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.email}</p>
            <p className={`text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 ${isPro ? 'text-blue-400' : 'text-white/40'}`}>
              {isPro ? <ShieldCheck size={12} /> : <Lock size={12} />}
              {isPro ? 'Verified Pro Member' : 'Free Plan'}
            </p>
          </div>
        </div>

        {!isPro && (
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Leads Usage</span>
              <span className="text-sm font-serif">{leadsCount} / {limit}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-red-500' : 'bg-white'}`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed italic">
              On the Free Plan, you're limited to 5 active leads. Upgrade for unlimited scale and advanced tools.
            </p>
            
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full mt-4 bg-white text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              Upgrade to Pro — $20/mo
            </button>
            <div className="flex items-center justify-center gap-2 text-[9px] text-white/20 uppercase tracking-[0.2em]">
              <Lock size={8} /> Secure 256-bit SSL Encryption
            </div>
          </div>
        )}

        {isPro && (
          <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-blue-400">
              {ICONS.Check}
              <span className="text-sm font-medium">Unlimited Leads & Follow-ups active</span>
            </div>
            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <p className="text-[10px] text-blue-400/60 uppercase tracking-widest mb-1 font-bold">Billing Status</p>
              <p className="text-xs text-white/80">Your subscription is active. Next billing cycle starts in 30 days.</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">App Info</h3>
        <div className="glass-card rounded-2xl divide-y divide-white/5 overflow-hidden">
          <div className="px-5 py-4 flex justify-between items-center">
            <span className="text-sm text-white/70">Version</span>
            <span className="text-sm">1.0.1</span>
          </div>
          <div className="px-5 py-4 flex justify-between items-center">
            <span className="text-sm text-white/70">Security</span>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <ShieldCheck size={12} /> End-to-end Encrypted
            </span>
          </div>
          <div className="px-5 py-4 flex justify-between items-center">
            <span className="text-sm text-white/70">Legal</span>
            <a href="#" className="text-sm text-white/40 hover:text-white underline">Terms & Privacy</a>
          </div>
        </div>
      </div>

      {/* Simulated Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isProcessing && setIsCheckoutOpen(false)} />
          <div className="glass-card w-full max-w-sm rounded-[32px] p-8 relative animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-2 text-white/60">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-serif">Secure Checkout</h3>
              <p className="text-sm text-white/40">Confirm your subscription to EstateFlow Pro for $20 per month.</p>
              
              <div className="bg-white/5 p-4 rounded-2xl text-left border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white/40">Plan</span>
                  <span className="text-xs font-bold">Pro Monthly</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Total</span>
                  <span className="text-xs font-bold">$20.00</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  disabled={isProcessing}
                  onClick={handleSimulatedCheckout}
                  className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 ${
                    isProcessing ? 'bg-white/10 text-white/20' : 'bg-white text-black hover:opacity-90'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authorizing...
                    </>
                  ) : 'Confirm Purchase'}
                </button>
                {!isProcessing && (
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-xs text-white/40 uppercase tracking-widest font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <p className="text-[9px] text-white/20 uppercase tracking-widest">Powered by Stripe Connect (Simulated)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
