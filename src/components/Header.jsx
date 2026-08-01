import React, { useState } from 'react';
import { User, Sun, Moon, Sparkles, Smile, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function Header({ partnerStatus, onSendQuickReaction, theme, toggleTheme, onOpenProfile, milestones = [], currentMood, onUpdateMood }) {
  const [isMoodSelectorOpen, setIsMoodSelectorOpen] = useState(false);

  // Calculate days together
  const firstMetDate = milestones.find(m => m.type === 'First Met')?.date || '2023-02-14';
  const calculateDaysTogether = () => {
    const start = new Date(firstMetDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const daysTogether = calculateDaysTogether();

  // Exactly 3 items per category with clean concise text so every row fits 100% perfectly in grid!
  const moodCategories = [
    {
      icon: '💌',
      name: 'TOWARD PARTNER',
      moods: [
        { text: 'Thinking', icon: '💕', fullLabel: 'Thinking of You 💕' },
        { text: 'Proud', icon: '🌟', fullLabel: 'So Proud of You 🌟' },
        { text: 'Grateful', icon: '🙏', fullLabel: 'Grateful for You 🙏' }
      ]
    },
    {
      icon: '☁️',
      name: 'NEUTRAL & CALM',
      moods: [
        { text: 'Just Chilling', icon: '☁️', fullLabel: 'Just Chilling / Normal ☁️' },
        { text: 'Calm', icon: '☕', fullLabel: 'Calm & Content ☕' },
        { text: 'Nostalgic', icon: '✨', fullLabel: 'Thoughtful & Nostalgic ✨' }
      ]
    },
    {
      icon: '🎉',
      name: 'POSITIVE & HAPPY',
      moods: [
        { text: 'Super Happy', icon: '🎉', fullLabel: 'Super Happy & Excited 🎉' },
        { text: 'Feeling Loved', icon: '💕', fullLabel: 'Feeling Loved & Cherished 💕' },
        { text: 'Accomplished', icon: '🏆', fullLabel: 'Proud & Accomplished 🏆' }
      ]
    },
    {
      icon: '🌧️',
      name: 'SUPPORT NEEDED',
      moods: [
        { text: 'Tough Day', icon: '🌧️', fullLabel: 'Having a Tough Day 🌧️' },
        { text: 'Stressed', icon: '⚡', fullLabel: 'Stressed / Overwhelmed ⚡' },
        { text: 'Can’t Sleep', icon: '🌙', fullLabel: 'Can’t Sleep 🌙' }
      ]
    }
  ];

  const cardBg = theme === 'dark' ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-md';
  const insetBg = theme === 'dark' ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200';
  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  return (
    <header className="w-full max-w-md mx-auto p-4 space-y-3 pt-6">
      {/* SECTION 1: HEADER WITH PROFILE & THEME TOGGLE */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between shadow-lg transition-colors ${cardBg}`}>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2 relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              className="w-10 h-10 rounded-full border-2 border-[#FF2D55] shadow-glow object-cover" 
              alt="You"
            />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
              className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-md object-cover" 
              alt="Alex"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#1E293B]" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-bold">You & Alex</h1>
              <span className="text-[10px] font-extrabold text-[#FF2D55] bg-[#FF2D55]/10 px-2 py-0.5 rounded-full border border-[#FF2D55]/20">
                {daysTogether}d 💕
              </span>
            </div>
            <p className={`text-[11px] ${subText}`}>Connected • 1,240 km apart</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button 
            onClick={onOpenProfile}
            className={`p-2 rounded-xl border hover:scale-105 active:scale-95 transition-all ${
              theme === 'dark' ? 'bg-[#0F172A] border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl border hover:scale-105 active:scale-95 transition-all ${
              theme === 'dark' ? 'bg-[#0F172A] border-white/10 text-amber-400' : 'bg-slate-100 border-slate-200 text-amber-600'
            }`}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SECTION 2: UNIFIED PARTNER & YOUR MOOD SYNC CARD */}
      <div className={`p-4 rounded-2xl border space-y-3.5 shadow-lg transition-colors ${cardBg}`}>
        {/* PARTNER STATUS ROW */}
        <div className="pb-3 border-b border-slate-200 dark:border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#FF2D55] tracking-wider block">ALEX IS FEELING</span>
          <div className="text-sm font-bold flex items-center gap-1.5">
            {partnerStatus}
          </div>
        </div>

        {/* YOUR ACTIVE MOOD ROW */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${subText}`}>YOUR ACTIVE MOOD</span>
            <div className="text-xs font-bold text-[#FF2D55] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2D55] animate-pulse" />
              <span>{currentMood}</span>
            </div>
          </div>

          <button
            onClick={() => setIsMoodSelectorOpen(!isMoodSelectorOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              theme === 'dark' ? 'bg-[#0F172A] border-[#FF2D55]/30 text-white hover:border-[#FF2D55]' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-[#FF2D55]" />
            <span>Change Mood</span>
            {isMoodSelectorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* PERFECT 3-COLUMN GRID CAPSULE TRACKS (NO OVERFLOW OR CUTOFF!) */}
        {isMoodSelectorOpen && (
          <div className={`p-3.5 rounded-2xl border space-y-3.5 animate-fade-in ${insetBg}`}>
            {moodCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-extrabold text-[#FF2D55] tracking-wider px-1">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                
                {/* 3-COLUMN EQUAL-WIDTH CAPSULE GRID */}
                <div className={`p-1 rounded-2xl border grid grid-cols-3 gap-1 w-full ${
                  theme === 'dark' ? 'bg-[#0F172A] border-white/10' : 'bg-slate-200/70 border-slate-300'
                }`}>
                  {cat.moods.map((m) => {
                    const isSelected = currentMood === m.fullLabel;
                    return (
                      <button
                        key={m.fullLabel}
                        type="button"
                        onClick={() => {
                          onUpdateMood(m.fullLabel);
                          setIsMoodSelectorOpen(false);
                        }}
                        className={`py-1.5 px-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 text-center transition-all truncate w-full ${
                          isSelected
                            ? 'bg-[#FF2D55] text-white shadow-md scale-102'
                            : theme === 'dark' 
                            ? 'text-slate-200 hover:text-white hover:bg-white/5' 
                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                        }`}
                      >
                        <span className="text-xs flex-shrink-0">{m.icon}</span>
                        <span className="truncate">{m.text}</span>
                        {isSelected && <Check className="w-3 h-3 text-white flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
