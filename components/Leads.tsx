
import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, LeadSource, Purpose } from '../types.ts';
import { ICONS } from '../constants.tsx';
import { formatCurrency, getWhatsAppLink } from '../utils.ts';

interface LeadsProps {
  leads: Lead[];
  onAdd: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const styles = {
    [LeadStatus.NEW]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [LeadStatus.CONTACTED]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    [LeadStatus.VISIT_DONE]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    [LeadStatus.DEAL_CLOSED]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [LeadStatus.LOST]: 'bg-white/5 text-white/40 border-white/10',
  };
  return (
    <span className={`text-[8px] px-1.5 py-0.5 rounded border font-black uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function Leads({ leads, onAdd, onEdit, onDelete, onUpdateStatus }: LeadsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'All'>('All');

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.phone.includes(searchTerm);
      const matchesFilter = filterStatus === 'All' || lead.status === filterStatus;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads, searchTerm, filterStatus]);

  const handleDealDone = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Mark this lead as Deal Closed? This will clear the follow-up reminder.')) {
      onUpdateStatus(id, LeadStatus.DEAL_CLOSED);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif tracking-tight">Leads</h2>
        <button 
          onClick={onAdd}
          className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-white/10"
        >
          {ICONS.Plus}
        </button>
      </div>

      <div className="space-y-3 sticky top-[73px] bg-[#0a0a0a] z-20 pb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
            {ICONS.Search}
          </div>
          <input
            type="text"
            placeholder="Search name or phone..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {['All', ...Object.values(LeadStatus)].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                filterStatus === status 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-white/40 border-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 pb-24">
        {filteredLeads.length === 0 ? (
          <div className="py-20 text-center opacity-30">
            <p className="text-sm">No leads found.</p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <div 
              key={lead.id} 
              className="glass-card rounded-2xl p-3 flex flex-col gap-2 active:scale-[0.98] transition-all border-white/5 hover:border-white/10 cursor-pointer"
              onClick={() => onEdit(lead)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-sm font-serif text-white/40 shrink-0">
                  {lead.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm truncate">{lead.fullName}</h3>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-white/30 font-bold uppercase tracking-wider mt-0.5">
                    <span className="truncate">{lead.area}</span>
                    <span className="w-0.5 h-0.5 bg-white/10 rounded-full" />
                    <span>{formatCurrency(lead.budget)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                <div className="flex items-center gap-2">
                  {lead.nextFollowUpDate && lead.status !== LeadStatus.DEAL_CLOSED && (
                    <div className="flex items-center gap-1 text-[9px] bg-white/[0.03] px-2 py-1 rounded-lg border border-white/5 text-white/50">
                      {ICONS.Clock}
                      <span>{new Date(lead.nextFollowUpDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      {lead.recurrence !== 'none' && (
                        <span className="text-blue-400 ml-0.5 animate-pulse">{ICONS.Repeat}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {lead.status !== LeadStatus.DEAL_CLOSED && (
                    <button 
                      onClick={(e) => handleDealDone(e, lead.id)}
                      className="w-8 h-8 flex items-center justify-center bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-yellow-500/80 active:bg-yellow-500 active:text-black transition-colors"
                      title="Deal Done"
                    >
                      {ICONS.Trophy}
                    </button>
                  )}
                  <a 
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 text-white/40 active:bg-white/10 active:text-white transition-colors"
                  >
                    {ICONS.Phone}
                  </a>
                  <a 
                    href={getWhatsAppLink(lead.phone)}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 text-green-500/60 active:bg-green-500/10 transition-colors"
                  >
                    {ICONS.WhatsApp}
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
