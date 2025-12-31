
export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  VISIT_DONE = 'Visit Done',
  DEAL_CLOSED = 'Deal Closed',
  LOST = 'Lost'
}

export enum LeadSource {
  WHATSAPP = 'WhatsApp',
  CALL = 'Call',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral'
}

export enum Purpose {
  BUY = 'Buy',
  RENT = 'Rent'
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  budget: string;
  area: string;
  purpose: Purpose;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
  nextFollowUpDate: string | null; // ISO string
  recurrence: RecurrenceType;
  recurrenceInterval?: number; // Days if custom
  createdAt: string; // ISO string
}

export interface UserProfile {
  id: string;
  email: string;
  plan: 'FREE' | 'PRO';
  isAdmin?: boolean;
}
