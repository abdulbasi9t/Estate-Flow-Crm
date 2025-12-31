
import { Lead, RecurrenceType } from './types';

export const formatCurrency = (value: string) => {
  if (!value) return '-';
  const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

export const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

export const isOverdue = (dateStr: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

export const getWhatsAppLink = (phone: string, message: string = '') => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
};

export const calculateNextFollowUp = (baseDate: string, type: RecurrenceType, interval: number = 1): string | null => {
  const date = new Date(baseDate);
  if (isNaN(date.getTime())) return null;

  switch (type) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'custom':
      date.setDate(date.getDate() + (interval || 1));
      break;
    default:
      return null;
  }
  return date.toISOString();
};
