import React from 'react';
import { Heart, Sparkles, Mail, Clock, Calendar } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, theme = 'dark' }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'studio', label: 'Studio', icon: Sparkles },
    { id: 'vault', label: 'Vault', icon: Mail },
    { id: 'shared', label: 'Shared', icon: Clock },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const navBg = theme === 'dark' ? 'bg-[#1E293B]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-2xl';
  const inactiveText = theme === 'dark' ? 'text-[#94A3B8] hover:text-white' : 'text-slate-400 hover:text-slate-700';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 p-3 max-w-md mx-auto">
      <div className={`backdrop-blur-md border rounded-3xl p-1.5 flex items-center justify-around shadow-2xl transition-colors ${navBg}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-gradient-to-tr from-[#FF2D55] to-rose-500 text-white shadow-glow scale-105'
                  : inactiveText
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] font-semibold mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
