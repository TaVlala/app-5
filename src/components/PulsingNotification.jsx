import React, { useEffect } from 'react';
import { Heart, X, Sparkles, Volume2 } from 'lucide-react';

export default function PulsingNotification({ notification, onClose, onOpenHeartbeat, theme = 'dark' }) {
  useEffect(() => {
    if (!notification) return;

    // Trigger haptic vibration for incoming heartbeat
    if (navigator.vibrate) {
      navigator.vibrate([100, 80, 100, 80, 200, 100, 200]);
    }

    // Auto-dismiss after 6 seconds if not closed
    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const bannerBg = theme === 'dark' 
    ? 'bg-[#1E293B]/95 border-2 border-[#FF2D55] text-white' 
    : 'bg-white/95 border-2 border-[#FF2D55] text-slate-900 shadow-2xl';

  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center animate-fade-in-down">
      <div className={`max-w-md w-full backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-[#FF2D55]/30 pointer-events-auto flex items-center justify-between relative overflow-hidden transition-colors ${bannerBg}`}>
        {/* Pulsing Red Glow Background */}
        <div className="absolute inset-0 bg-[#FF2D55]/10 animate-pulse pointer-events-none" />

        <div className="flex items-center space-x-3.5 relative z-10">
          {/* Animated Pulsing Heart Icon */}
          <div className="w-11 h-11 rounded-full bg-[#FF2D55] flex items-center justify-center text-white shadow-glow animate-bounce">
            <Heart className="w-6 h-6 fill-current animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[#FF2D55] tracking-wider">Incoming Heartbeat 💕</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h4 className="text-sm font-bold">{notification.title || "Alex is sending a Live Heartbeat!"}</h4>
            <p className={`text-xs ${subText}`}>{notification.body || "Feel their pulse rhythm in real time"}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 relative z-10">
          <button
            onClick={() => {
              onOpenHeartbeat && onOpenHeartbeat();
              onClose();
            }}
            className="px-3 py-1.5 bg-[#FF2D55] hover:bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            Feel Beat
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-white/10 text-[#94A3B8] hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
