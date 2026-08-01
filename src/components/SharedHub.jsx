import React, { useState } from 'react';
import { Clock, Play, Mic, Check, Bookmark, Sparkles } from 'lucide-react';

export default function SharedHub({ activityList = [], theme = 'dark' }) {
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [savedVaultIds, setSavedVaultIds] = useState(new Set());
  const [saveToastText, setSaveToastText] = useState(null);

  const togglePlayVoiceNote = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setTimeout(() => setPlayingAudioId(null), 3000);
    }
  };

  // Save Item to Recipient's Vault Permanently (Secret Bonding Action — Sender never sees!)
  const handleSaveItemToVault = (item) => {
    try {
      const savedMemsStr = localStorage.getItem('together_vault_memories');
      const mems = savedMemsStr ? JSON.parse(savedMemsStr) : [];
      const todayStr = new Date().toISOString().split('T')[0];

      const newMem = {
        id: item.id || Date.now(),
        title: item.doodleUrl ? 'Doodle Art 🎨' : item.type === 'voice' ? 'Voice Clip 🎙️' : item.intensity || 'Saved Moment 💕',
        date: todayStr,
        category: item.doodleUrl ? 'doodle' : item.type === 'voice' ? 'voice' : 'photo',
        imageUrl: item.doodleUrl || null,
        isFavorite: true
      };

      localStorage.setItem('together_vault_memories', JSON.stringify([newMem, ...mems]));
      
      setSavedVaultIds(prev => new Set(prev).add(item.id));
      setSaveToastText(`Saved to Secret Vault! 🔒 Saved permanently.`);
      setTimeout(() => setSaveToastText(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Expiration Countdown String (Default 24 Hours / 3 Days / 1 Week / 1 Month)
  const getExpirationBadge = (item) => {
    const createdTime = item.id || Date.now();
    const expHours = item.expirationHours || 24;
    const expiresAt = item.expiresAt || createdTime + expHours * 3600 * 1000;
    const remainingMs = expiresAt - Date.now();

    if (remainingMs <= 0) {
      return <span className="text-[9px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">Expired ⌛</span>;
    }

    const hrs = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hrs >= 24) {
      const days = Math.floor(hrs / 24);
      return <span className="text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">⏳ {days}d {hrs % 24}h</span>;
    }

    return <span className="text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">⏳ {hrs}h {mins}m</span>;
  };

  const cardBg = theme === 'dark' ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-md';
  const insetBg = theme === 'dark' ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200 text-slate-800';
  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-24">
      {/* SECRET VAULT TOAST NOTIFICATION */}
      {saveToastText && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {saveToastText}
        </div>
      )}

      {/* FEED HEADER BAR */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#FF2D55]" />
          <h2 className="text-sm font-bold uppercase tracking-wider">SHARED MOMENTS FEED</h2>
        </div>
        <span className="text-xs text-[#FF2D55] font-bold bg-[#FF2D55]/10 px-2.5 py-1 rounded-full border border-[#FF2D55]/20">
          Live Activity
        </span>
      </div>

      {/* SINGLE FULL-PAGE SEAMLESS ACTIVITY FEED */}
      <div className="space-y-3">
        {!activityList || activityList.length === 0 ? (
          <div className={`text-center py-16 rounded-3xl border text-xs space-y-2 ${cardBg}`}>
            <span className="text-3xl block">💌</span>
            <p className="font-semibold">No moments shared yet</p>
            <p className={`text-[11px] ${subText}`}>Send a hug, kiss, doodle, or voice clip to see your feed update live!</p>
          </div>
        ) : (
          activityList.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl border space-y-3 shadow-lg transition-all ${cardBg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#FF2D55]/10 border border-[#FF2D55]/30 flex items-center justify-center text-base flex-shrink-0">
                    {item.icon || '❤️'}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-snug">{item.intensity || item.type}</div>
                    <div className={`text-[10px] ${subText}`}>From {item.from} • {item.timestamp}</div>
                  </div>
                </div>

                {/* EXPIRATION BADGE + SAVE ACTION PILL */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {getExpirationBadge(item)}

                  {savedVaultIds.has(item.id) || item.savedToVault ? (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Saved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSaveItemToVault(item)}
                      className="px-2.5 py-1 rounded-full text-[9px] font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Bookmark className="w-2.5 h-2.5 text-amber-500" /> Save 🔒
                    </button>
                  )}
                </div>
              </div>

              {/* DOODLE PREVIEW RENDER */}
              {item.doodleUrl && (
                <div className={`rounded-xl overflow-hidden border p-2 ${insetBg}`}>
                  <img src={item.doodleUrl} alt="Shared Doodle" className="w-full h-40 object-contain rounded-lg" />
                </div>
              )}

              {/* VOICE NOTE PLAYBACK CARD */}
              {item.type === 'voice' && (
                <div className={`p-3 rounded-xl border flex items-center justify-between ${insetBg}`}>
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-medium">Voice Hug Clip</span>
                  </div>

                  <button
                    onClick={() => togglePlayVoiceNote(item.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${playingAudioId === item.id ? 'animate-spin' : ''}`} />
                    {playingAudioId === item.id ? 'Playing Voice...' : 'Listen 🎙️'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
