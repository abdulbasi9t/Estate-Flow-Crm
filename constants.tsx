
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Calendar, 
  Phone, 
  MessageCircle, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  Repeat,
  Clock,
  Trophy
} from 'lucide-react';

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Leads: <Users size={20} />,
  Settings: <Settings size={20} />,
  Plus: <Plus size={20} />,
  Search: <Search size={20} />,
  Calendar: <Calendar size={18} />,
  Phone: <Phone size={18} />,
  WhatsApp: <MessageCircle size={18} />,
  External: <ExternalLink size={16} />,
  ChevronRight: <ChevronRight size={20} />,
  Filter: <Filter size={18} />,
  Check: <CheckCircle2 size={18} />,
  Alert: <AlertCircle size={18} />,
  Stats: <TrendingUp size={18} />,
  Close: <X size={20} />,
  Repeat: <Repeat size={12} />,
  Clock: <Clock size={12} />,
  Trophy: <Trophy size={16} />
};

export const COLORS = {
  primary: '#f5f5f5',
  secondary: '#a3a3a3',
  accent: '#ffffff',
  danger: '#ff4d4d',
  success: '#00ff88',
  bg: '#0a0a0a',
  card: 'rgba(255, 255, 255, 0.05)'
};
