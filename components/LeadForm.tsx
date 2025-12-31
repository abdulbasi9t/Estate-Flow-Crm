
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, LeadSource, Purpose, RecurrenceType } from '../types';
import { ICONS } from '../constants';

interface LeadFormProps {
  lead?: Lead | null;
  onSave: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSave, onUpdate, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    fullName: '',
    phone: '',
    budget: '',
    area: '',
    purpose: Purpose.BUY,
    source: LeadSource.WHATSAPP,
    status: LeadStatus.NEW,
    notes: '',
    nextFollowUpDate: null,
    recurrence: 'none',
    recurrenceInterval: 1,
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        fullName: lead.fullName,
        phone: lead.phone,
        budget: lead.budget,
        area: lead.area,
        purpose: lead.purpose,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
        nextFollowUpDate: lead.nextFollowUpDate,
        recurrence: lead.recurrence || 'none',
        recurrenceInterval: lead.recurrenceInterval || 1,
      });
    }
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lead) {
      onUpdate(lead.id, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0a0a0a] flex flex-col animate-in slide-in-from-bottom-full duration-500">
      <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
        <h2 className="text-xl font-serif">{lead ? 'Edit Lead' : 'Create Lead'}</h2>
        <button onClick={onClose} className="p-2 text-white/50">
          {ICONS.Close}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Full Name</label>
            <input 
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Phone</label>
              <input 
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors"
                placeholder="+1 234..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Budget</label>
              <input 
                required
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors"
                placeholder="500,000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Purpose</label>
              <select 
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors appearance-none"
              >
                {Object.values(Purpose).map(v => <option key={v} value={v} className="bg-neutral-900">{v}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors appearance-none"
              >
                {Object.values(LeadStatus).map(v => <option key={v} value={v} className="bg-neutral-900">{v}</option>)}
              </select>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Follow-up Reminder</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Next Date</label>
              <input 
                type="date"
                name="nextFollowUpDate"
                value={formData.nextFollowUpDate?.split('T')[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, nextFollowUpDate: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Repeat</label>
                <select 
                  name="recurrence"
                  value={formData.recurrence}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors appearance-none"
                >
                  <option value="none" className="bg-neutral-900">None</option>
                  <option value="daily" className="bg-neutral-900">Daily</option>
                  <option value="weekly" className="bg-neutral-900">Weekly</option>
                  <option value="monthly" className="bg-neutral-900">Monthly</option>
                  <option value="custom" className="bg-neutral-900">Custom (Days)</option>
                </select>
              </div>
              
              {formData.recurrence === 'custom' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Every X Days</label>
                  <input 
                    type="number"
                    name="recurrenceInterval"
                    min="1"
                    value={formData.recurrenceInterval}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Notes</label>
            <textarea 
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 transition-colors resize-none"
              placeholder="Private notes about the lead..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 pb-12">
          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-white/5"
          >
            {lead ? 'Update Lead' : 'Save Lead'}
          </button>
          
          {lead && (
            <button 
              type="button"
              onClick={() => { if(confirm('Delete this lead?')) { onDelete(lead.id); onClose(); } }}
              className="w-full bg-red-500/10 text-red-400 font-bold py-4 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              Delete Lead
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
