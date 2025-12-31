
import React, { useState, useMemo } from 'react';
import { UserProfile, Lead, LeadStatus } from '../types';
import { ShieldAlert, LogOut, Activity, ChevronRight, Database, Search, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils';

interface AdminPanelProps {
  users: UserProfile[];
  onUpdatePlan: (userId: string, plan: 'FREE' | 'PRO') => void;
  onLogout?: () => void;
  getUserLeads: (userId: string) => Lead[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, onUpdatePlan, onLogout, getUserLeads }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId), [users, selectedUserId]);
  const userLeads = useMemo(() => selectedUserId ? getUserLeads(selectedUserId) : [], [selectedUserId, getUserLeads]);

  const filteredUsers = useMemo(() => users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ), [users, searchQuery]);

  const handleExit = () => {
    if (confirm('Exit Command Center? You will be logged out of the admin session.')) {
      onLogout?.();
    }
  };

  const handleTogglePlan = (user: UserProfile) => {
    const newPlan = user.plan === 'PRO' ? 'FREE' : 'PRO';
    if (confirm(`Are you sure you want to change ${user.email} to the ${newPlan} plan?`)) {
      onUpdatePlan(user.id, newPlan);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-white">Command Center</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-blue-400 uppercase tracking-[0.2em] font-black">Level 5 Clearance Active</span>
          </div>
        </div>
        <button 
          onClick={handleExit}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 active:scale-95"
        >
          <LogOut size={14} /> Exit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 border-l-2 border-l-white/20">
          <Activity size={12} className="text-white/40 mb-2" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">Total Network</p>
          <p className="text-2xl font-serif text-white">{users.length} Agents</p>
        </div>
        <div className="glass-card rounded-2xl p-6 border-l-2 border-l-blue-500/50">
          <ShieldAlert size={12} className="text-blue-400 mb-2" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">Verified Pro</p>
          <p className="text-2xl font-serif text-blue-400">{users.filter(u => u.plan === 'PRO').length}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 border-l-2 border-l-green-500/50">
          <div className="text-green-500 mb-2 font-bold text-xs font-black uppercase tracking-widest">Revenue</div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Estimated MRR</p>
          <p className="text-2xl font-serif text-green-400">${users.filter(u => u.plan === 'PRO').length * 20}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Registered Agents</h3>
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-white/30 w-48 transition-all"
            />
          </div>
        </div>
        
        <div className="glass-card rounded-3xl overflow-hidden divide-y divide-white/5 border border-white/5 shadow-2xl">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-white/20 italic text-sm">No accounts found in this sector.</div>
          ) : (
            filteredUsers.map(u => (
              <div 
                key={u.id} 
                onClick={() => setSelectedUserId(u.id)}
                className="p-5 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border transition-colors ${u.isAdmin ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-white/10 bg-white/5 text-white/40'}`}>
                    {u.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{u.email}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <Database size={10} /> {getUserLeads(u.id).length} active leads
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border tracking-tighter transition-all ${u.plan === 'PRO' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-lg shadow-blue-500/5' : 'bg-white/5 text-white/40 border-white/10'}`}>
                    {u.plan}
                  </div>
                  <ChevronRight size={14} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedUserId && selectedUser && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[#0a0a0a] animate-in slide-in-from-bottom-full duration-500">
          <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-[210]">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedUserId(null)} 
                className="p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
              <div>
                <h2 className="text-lg font-serif text-white">{selectedUser.email}</h2>
                <p className="text-[9px] uppercase tracking-widest text-white/30 font-black flex items-center gap-1">
                  <Database size={8} /> Agent Identifier: {selectedUser.id}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${selectedUser.plan === 'PRO' ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' : 'border-white/10 bg-white/5 text-white/40'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${selectedUser.plan === 'PRO' ? 'bg-blue-500' : 'bg-white/20'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{selectedUser.plan} Plan</span>
              </div>
              
              <button 
                onClick={() => handleTogglePlan(selectedUser)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 shadow-lg ${
                  selectedUser.plan === 'PRO' 
                    ? 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500 hover:text-white' 
                    : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500 hover:text-black'
                }`}
              >
                {selectedUser.plan === 'PRO' ? 'Downgrade to Free' : 'Promote to Pro Member'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-5 rounded-3xl">
                <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2 font-black">Lead Count</p>
                <p className="text-2xl text-white font-serif">{userLeads.length}</p>
              </div>
              <div className="glass-card p-5 rounded-3xl">
                <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2 font-black">Conversion</p>
                <p className="text-2xl text-green-400 font-serif">
                  {userLeads.length > 0 ? ((userLeads.filter(l => l.status === LeadStatus.DEAL_CLOSED).length / userLeads.length) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div className="glass-card p-5 rounded-3xl">
                <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2 font-black">Pipeline Vol.</p>
                <p className="text-lg text-white font-serif">
                  {formatCurrency(userLeads.reduce((acc, l) => acc + (parseFloat(l.budget.replace(/[^0-9]/g, '')) || 0), 0).toString())}
                </p>
              </div>
              <div className="glass-card p-5 rounded-3xl">
                <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2 font-black">Closed Deals</p>
                <p className="text-2xl text-green-400 font-serif">{userLeads.filter(l => l.status === LeadStatus.DEAL_CLOSED).length}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">User Pipeline Inventory</h3>
                <span className="text-[10px] text-white/20 font-mono">Total entries: {userLeads.length}</span>
              </div>
              
              {userLeads.length === 0 ? (
                <div className="glass-card rounded-[32px] py-16 text-center border-dashed border-white/10">
                  <Database size={32} className="mx-auto text-white/5 mb-4" />
                  <p className="text-white/20 italic text-xs">This agent currently has no active lead data.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userLeads.map(l => (
                    <div key={l.id} className="glass-card p-5 rounded-2xl flex justify-between items-center border-white/5 hover:border-white/10 transition-all group">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{l.fullName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[9px] text-white/30 uppercase tracking-widest font-black truncate">{l.area}</p>
                          <span className="w-1 h-1 bg-white/10 rounded-full shrink-0" />
                          <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">{formatCurrency(l.budget)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-[8px] px-2 py-0.5 rounded border font-black uppercase tracking-tighter shrink-0 ${
                          l.status === LeadStatus.DEAL_CLOSED 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : l.status === LeadStatus.LOST
                            ? 'bg-red-500/5 text-white/20 border-white/5'
                            : 'bg-white/5 text-white/40 border-white/10'
                        }`}>
                          {l.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-white/5 text-center">
            <p className="text-[8px] text-white/5 uppercase tracking-[0.5em] font-black">Secure Data Feed // End-to-End Encrypted</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
