
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import Leads from './components/Leads.tsx';
import LeadForm from './components/LeadForm.tsx';
import Settings from './components/Settings.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { useCRM } from './hooks/useCRM.ts';
import { Lead, LeadStatus } from './types.ts';
import { calculateNextFollowUp } from './utils.ts';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AuthScreen: React.FC<{ 
  onLogin: (e: string, p: string, pin?: string) => any; 
  onSignup: (e: string, p: string) => any;
}> = ({ onLogin, onSignup }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [requiresPin, setRequiresPin] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!authEmail || !authPassword) {
      setAuthError('Please fill in all fields');
      return;
    }

    if (authMode === 'login') {
      const result = onLogin(authEmail, authPassword, requiresPin ? authPin : undefined);
      if (result.requiresPin) {
        setRequiresPin(true);
        setAuthError('Admin access detected. Enter Security PIN.');
      } else if (!result.success) {
        setAuthError(result.message);
      }
    } else {
      const result = onSignup(authEmail, authPassword);
      if (!result.success) setAuthError(result.message);
    }
  };

  const resetState = () => {
    setAuthError('');
    setRequiresPin(false);
    setAuthPin('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div className="space-y-2">
          <h1 className="text-6xl font-serif italic mb-2 tracking-tighter text-white">EstateFlow</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold">Luxury Real Estate CRM</p>
        </div>
        <form onSubmit={handleAuth} className="glass-card p-8 rounded-[40px] space-y-6 shadow-2xl w-full">
          {!requiresPin && (
            <div className="flex gap-4 p-1 bg-white/5 rounded-2xl mb-2">
              <button type="button" onClick={() => { setAuthMode('login'); resetState(); }} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-white text-black' : 'text-white/40'}`}>Login</button>
              <button type="button" onClick={() => { setAuthMode('signup'); resetState(); }} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-white text-black' : 'text-white/40'}`}>Sign Up</button>
            </div>
          )}
          
          <div className="space-y-4 text-left">
            {requiresPin ? (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <ShieldCheck size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Master Admin Auth Required</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-2">Security Access Pin</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-white/20 pointer-events-none"><Lock size={16} /></div>
                    <input 
                      type="password" 
                      maxLength={4}
                      placeholder="••••" 
                      autoFocus
                      value={authPin} 
                      onChange={(e) => setAuthPin(e.target.value)} 
                      className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl py-4 pl-12 pr-6 text-center text-2xl tracking-[1em] text-white focus:outline-none focus:border-blue-500/40 transition-all font-mono" 
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setRequiresPin(false)}
                  className="text-[9px] text-white/20 uppercase tracking-widest hover:text-white transition-colors block w-full text-center"
                >
                  Back to credentials
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-white/20 pointer-events-none"><Mail size={16} /></div>
                    <input type="email" placeholder="you@luxury.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-white/40 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/30 ml-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-white/20 pointer-events-none"><Lock size={16} /></div>
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-white/40 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-white/20 hover:text-white transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {authError && (
            <p className={`text-[10px] font-bold uppercase tracking-widest animate-pulse ${requiresPin ? 'text-blue-400' : 'text-red-400'}`}>
              {authError}
            </p>
          )}

          <button 
            type="submit" 
            className={`w-full font-black py-5 rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] uppercase tracking-[0.3em] shadow-2xl ${
              requiresPin ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-white text-black shadow-white/5'
            }`}
          >
            {requiresPin ? 'Verify Security Token' : authMode === 'login' ? 'Enter Space' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

const LeadFormTrigger: React.FC<{ canAddMore: boolean, onOpen: () => void }> = ({ canAddMore, onOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      if (canAddMore) onOpen();
      else alert('Free plan limit reached.');
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, [searchParams]);
  return null;
};

const AppRoutes: React.FC = () => {
  const { 
    leads, user, loading, allUsers, login, signup, logout, 
    addLead, updateLead, deleteLead, updateStatus, setPlan, 
    updateUserPlan, canAddMore, getUserLeads 
  } = useCRM();

  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (loading) return null;

  if (!user) {
    return <AuthScreen onLogin={login} onSignup={signup} />;
  }

  const handleCompleteFollowUp = (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    if (lead.recurrence && lead.recurrence !== 'none') {
      const nextDate = calculateNextFollowUp(lead.nextFollowUpDate || new Date().toISOString(), lead.recurrence, lead.recurrenceInterval);
      updateLead(id, { nextFollowUpDate: nextDate });
    } else {
      setActiveLead(lead);
      setIsFormOpen(true);
    }
  };

  const handleDealDone = (id: string) => {
    if(confirm('Mark as Deal Closed?')) {
      updateLead(id, { status: LeadStatus.DEAL_CLOSED, nextFollowUpDate: null, recurrence: 'none' });
    }
  };

  return (
    <Layout user={user} onLogout={logout}>
      <LeadFormTrigger canAddMore={canAddMore} onOpen={() => setIsFormOpen(true)} />
      <Routes>
        <Route path="/" element={<Dashboard leads={leads} onCompleteFollowUp={handleCompleteFollowUp} onDealDone={handleDealDone} />} />
        <Route path="/leads" element={<Leads leads={leads} onAdd={() => canAddMore ? setIsFormOpen(true) : alert('Free plan limit reached.')} onEdit={(lead) => { setActiveLead(lead); setIsFormOpen(true); }} onDelete={deleteLead} onUpdateStatus={updateStatus} />} />
        <Route path="/settings" element={<Settings user={user} onLogout={logout} onUpgrade={() => setPlan('PRO')} leadsCount={leads.length} />} />
        {user.isAdmin && <Route path="/admin" element={<AdminPanel users={allUsers} onUpdatePlan={updateUserPlan} onLogout={logout} getUserLeads={getUserLeads} />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isFormOpen && <LeadForm lead={activeLead} onSave={addLead} onUpdate={updateLead} onDelete={deleteLead} onClose={() => { setIsFormOpen(false); setActiveLead(null); }} />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
