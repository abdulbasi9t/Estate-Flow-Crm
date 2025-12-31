
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ICONS } from '../constants.tsx';
import { UserProfile } from '../types.ts';
import { LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: ICONS.Dashboard },
    { path: '/leads', label: 'Leads', icon: ICONS.Leads },
    { path: '/settings', label: 'Plan', icon: ICONS.Settings },
  ];

  if (user?.isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: ICONS.Stats });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-serif tracking-tight text-white">EstateFlow</h1>
          {user?.isAdmin && (
            <span className="text-[8px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Admin</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onLogout}
            className="p-2 text-white/30 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-serif text-white shadow-inner">
            {user?.email?.[0]?.toUpperCase() || 'E'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl px-6 py-3 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-white' : 'text-white/40'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-white/10' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
