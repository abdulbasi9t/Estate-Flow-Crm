
import React from 'react';
import { Lead, LeadStatus } from '../types.ts';
import { ICONS, COLORS } from '../constants.tsx';
import { isToday, isOverdue, formatCurrency, getWhatsAppLink } from '../utils.ts';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  onCompleteFollowUp: (id: string) => void;
  onDealDone: (id: string) => void;
}

interface FollowUpItemProps {
  lead: Lead;
  type: 'overdue' | 'today';
  onComplete: (id: string) => void;
  onDealDone: (id: string) => void;
}

const FollowUpItem: React.FC<FollowUpItemProps> = ({ lead, type, onComplete, onDealDone }) => (
  <div className="glass-card rounded-3xl p-4 mb-3 group hover:border-white/20 transition-all shadow-lg border-white/5">
    <div className="flex justify-between items-start mb-4">
      <div className="min-w-0">
        <h4 className="font-bold text-lg truncate pr-2">{lead.fullName}</h4>
        <div className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-widest font-bold mt-1">
          <span className="truncate max-w-[120px]">{lead.area}</span>
          <span className="w-1 h-1 bg-white/10 rounded-full shrink-0" />
          <span className="text-white/60">{formatCurrency(lead.budget)}</span>
        </div>
      </div>
      <div className={`px-2 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest shrink-0 border ${
        type === 'overdue' 
          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      }`}>
        {type === 'overdue' ? 'Overdue' : 'Today'}
      </div>
    </div>
    
    <div className="flex items-center gap-2 mb-4">
      <a 
        href={`tel:${lead.phone}`} 
        className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/20 transition-all py-2.5 rounded-2xl flex items-center justify-center gap-2 text-white/70"
      >
        {ICONS.Phone}
        <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
      </a>
      <a 
        href={getWhatsAppLink(lead.phone, `Hi ${lead.fullName}, I'm following up regarding the property in ${lead.area}.`)} 
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 active:bg-green-500/30 transition-all text-green-400 py-2.5 rounded-2xl flex items-center justify-center gap-2"
      >
        {ICONS.WhatsApp}
        <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
      </a>
    </div>
    
    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
      <button 
        onClick={() => onDealDone(lead.id)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black text-[10px] font-black uppercase tracking-widest transition-all border border-yellow-500/20"
      >
        <Trophy size={14} /> Deal Won
      </button>
      
      <button 
        onClick={() => onComplete(lead.id)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white text-[10px] font-black uppercase tracking-widest transition-all text-white/40 hover:text-black border border-white/10"
      >
        {ICONS.Check} Follow-up Done
      </button>
    </div>
    
    {lead.recurrence !== 'none' && (
      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1 text-[9px] text-blue-400/60 font-bold uppercase tracking-widest">
          {ICONS.Repeat} Recurring {lead.recurrence}
        </span>
      </div>
    )}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ leads, onCompleteFollowUp, onDealDone }) => {
  const overdueLeads = leads.filter(l => l.nextFollowUpDate && isOverdue(l.nextFollowUpDate) && l.status !== LeadStatus.DEAL_CLOSED);
  const todayLeads = leads.filter(l => l.nextFollowUpDate && isToday(l.nextFollowUpDate) && l.status !== LeadStatus.DEAL_CLOSED);
  
  const totalLeads = leads.length;
  const closedDeals = leads.filter(l => l.status === LeadStatus.DEAL_CLOSED).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overview Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-[32px] p-6 border-l-2 border-l-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-5">
            <Trophy size={48} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1 font-black">Active Pipeline</p>
          <p className="text-4xl font-serif">{totalLeads}</p>
        </div>
        <div className="glass-card rounded-[32px] p-6 border-l-2 border-l-green-500/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10 text-green-500">
            <Trophy size={48} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1 font-black">Deals Won</p>
          <p className="text-4xl font-serif text-green-400">{closedDeals}</p>
        </div>
      </section>

      {/* Overdue Section */}
      {overdueLeads.length > 0 && (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-red-400">{ICONS.Alert}</div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Overdue Follow-ups</h3>
            <span className="ml-auto bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">{overdueLeads.length}</span>
          </div>
          {overdueLeads.map(lead => (
            <FollowUpItem key={lead.id} lead={lead} type="overdue" onComplete={onCompleteFollowUp} onDealDone={onDealDone} />
          ))}
        </section>
      )}

      {/* Today Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-white/40">{ICONS.Calendar}</div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Scheduled for Today</h3>
          <span className="ml-auto bg-white/5 text-white/40 px-2 py-0.5 rounded text-[10px] font-bold">{todayLeads.length}</span>
        </div>
        
        {todayLeads.length === 0 && overdueLeads.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center glass-card rounded-[40px] opacity-60 border-dashed border-white/10">
            <div className="mb-4 text-white/10 scale-150">{ICONS.Check}</div>
            <p className="text-base font-serif italic text-white/80">No more tasks pending.</p>
            <p className="text-[10px] mt-2 text-white/30 uppercase tracking-widest">Enjoy the quiet or add new leads</p>
            <Link to="/leads?new=true" className="mt-6 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">New Lead</Link>
          </div>
        ) : (
          todayLeads.map(lead => (
            <FollowUpItem key={lead.id} lead={lead} type="today" onComplete={onCompleteFollowUp} onDealDone={onDealDone} />
          ))
        )}
      </section>
      
      {/* Quick Add Button Mobile */}
      <Link 
        to="/leads?new=true"
        className="fixed bottom-24 right-6 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl shadow-white/20 z-50 transform hover:scale-105 active:scale-90 transition-all border-4 border-[#0a0a0a]"
      >
        <div className="scale-125">{ICONS.Plus}</div>
      </Link>
    </div>
  );
};

export default Dashboard;
