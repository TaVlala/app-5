import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Heart, Gift, Plane, Video, ChevronLeft, ChevronRight, X, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function CalendarPage({ milestones = [], theme = 'dark' }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-08-18');
  const [eventCategory, setEventCategory] = useState('Trip');
  
  // Collapse far-away events (> 30 days) by default!
  const [isFarAwayExpanded, setIsFarAwayExpanded] = useState(false);

  // Default custom events
  const [userEvents, setUserEvents] = useState([
    {
      id: 101,
      title: 'Reunion Trip to London ✈️',
      date: '2026-08-18',
      category: 'Trip',
      daysLeft: 17,
      icon: Plane,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    {
      id: 102,
      title: "Alex's Birthday 🎂",
      date: '2026-08-14',
      category: 'Birthday',
      daysLeft: 13,
      icon: Gift,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    {
      id: 103,
      title: 'Virtual Movie Date Night 🍿',
      date: '2026-08-05',
      category: 'Date Night',
      daysLeft: 4,
      icon: Video,
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
    }
  ]);

  // Combine user custom events with AUTOMATED milestone anniversaries!
  const automatedMilestoneAnniversaries = (milestones.length > 0 ? milestones : [
    { id: 1, type: 'First Met', title: 'The Day We Met 💖', date: '2023-02-14' },
    { id: 2, type: 'Engagement', title: 'Engagement Anniversary 💍', date: '2024-07-20' },
    { id: 3, type: 'Marriage', title: 'Wedding Anniversary 💒', date: '2025-06-12' }
  ]).map(m => {
    const origDate = new Date(m.date);
    const today = new Date();
    let nextYear = today.getFullYear();
    let nextAnniv = new Date(nextYear, origDate.getMonth(), origDate.getDate());

    if (nextAnniv < today) {
      nextAnniv = new Date(nextYear + 1, origDate.getMonth(), origDate.getDate());
    }

    const diffDays = Math.ceil((nextAnniv - today) / (1000 * 60 * 60 * 24));

    return {
      id: `milestone-${m.id}`,
      title: `${m.title || m.type} (Anniversary)`,
      date: nextAnniv.toISOString().split('T')[0],
      category: 'Anniversary',
      daysLeft: diffDays,
      icon: Heart,
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      isAutomated: true
    };
  });

  const allEvents = [...userEvents, ...automatedMilestoneAnniversaries].sort((a, b) => a.daysLeft - b.daysLeft);

  // Split into Upcoming (Next 30 Days) and Far Away (> 30 Days)
  const upcomingNext30Days = allEvents.filter(evt => evt.daysLeft <= 30);
  const farAwayEvents = allEvents.filter(evt => evt.daysLeft > 30);

  const handleAddEvent = () => {
    if (!eventTitle) return;
    const newEvt = {
      id: Date.now(),
      title: eventTitle,
      date: eventDate,
      category: eventCategory,
      daysLeft: 10,
      icon: eventCategory === 'Anniversary' ? Heart : eventCategory === 'Birthday' ? Gift : eventCategory === 'Trip' ? Plane : Video,
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    };

    setUserEvents([newEvt, ...userEvents]);
    setShowAddModal(false);
    setEventTitle('');
  };

  const daysInMonth = 31;
  const startDayOffset = 6;

  const cardBg = theme === 'dark' ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-md';
  const insetBg = theme === 'dark' ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200 text-slate-800';
  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-5 pb-24">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-[#FF2D55]" /> Shared Couple Calendar
          </h2>
          <p className={`text-xs ${subText}`}>Automated milestone anniversaries & date visits</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 bg-[#FF2D55] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md hover:bg-rose-600 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* MONTH NAVIGATION & GRID */}
      <div className={`border rounded-2xl p-4 space-y-3 shadow-lg ${cardBg}`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
          <span className="text-xs font-bold tracking-wider">August 2026</span>
          <div className="flex items-center space-x-1">
            <button className={`p-1 rounded-lg ${subText} ${insetBg}`}><ChevronLeft className="w-4 h-4" /></button>
            <button className={`p-1 rounded-lg ${subText} ${insetBg}`}><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* DAY HEADERS */}
        <div className={`grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase ${subText}`}>
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        {/* CALENDAR DAYS MATRIX */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9 rounded-lg" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === 1;
            const hasEvent = day === 5 || day === 14 || day === 18;
            return (
              <div
                key={day}
                className={`h-9 rounded-xl flex flex-col items-center justify-center relative border transition-all ${
                  isToday 
                    ? 'bg-[#FF2D55] text-white border-[#FF2D55] font-bold shadow-md' 
                    : hasEvent 
                    ? theme === 'dark' ? 'bg-white/10 text-white border-[#FF2D55]/50 font-semibold' : 'bg-rose-50 text-slate-800 border-[#FF2D55]/30 font-semibold'
                    : insetBg
                }`}
              >
                <span>{day}</span>
                {hasEvent && !isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] absolute bottom-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AUTOMATED MILESTONE ANNIVERSARIES & UPCOMING EVENTS LIST */}
      <div className={`border rounded-2xl p-4 space-y-3 shadow-lg ${cardBg}`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FF2D55]" /> Upcoming Events (Next 30 Days)
          </h3>
          <span className={`text-[11px] ${subText}`}>{upcomingNext30Days.length} Upcoming</span>
        </div>

        {/* 1. UPCOMING EVENTS (NEXT 30 DAYS) */}
        <div className="space-y-2.5">
          {upcomingNext30Days.map((evt) => {
            const Icon = evt.icon;
            return (
              <div key={evt.id} className={`flex items-center justify-between p-3 rounded-xl border ${insetBg}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${evt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold flex items-center gap-1.5">
                      <span>{evt.title}</span>
                      {evt.isAutomated && (
                        <span className="text-[9px] bg-rose-500/20 text-rose-500 px-1.5 py-0.2 rounded font-medium border border-rose-500/30">Auto</span>
                      )}
                    </div>
                    <div className={`text-[10px] ${subText}`}>{evt.date}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF2D55]/10 text-[#FF2D55] border border-[#FF2D55]/20 font-mono">
                    in {evt.daysLeft}d
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. FAR-AWAY EVENTS COLLAPSED ACCORDION TOGGLE (EVENTS > 30 DAYS) */}
        {farAwayEvents.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-white/5 space-y-2.5">
            <button
              onClick={() => setIsFarAwayExpanded(!isFarAwayExpanded)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                theme === 'dark' ? 'bg-[#0F172A] border-white/10 text-[#94A3B8] hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isFarAwayExpanded ? 'Hide Far-Away Events' : `Show ${farAwayEvents.length} Far-Away Events (30+ Days)`}</span>
              </div>
              {isFarAwayExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isFarAwayExpanded && (
              <div className="space-y-2.5 animate-fade-in">
                {farAwayEvents.map((evt) => {
                  const Icon = evt.icon;
                  return (
                    <div key={evt.id} className={`flex items-center justify-between p-3 rounded-xl border opacity-85 ${insetBg}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${evt.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold flex items-center gap-1.5">
                            <span>{evt.title}</span>
                            {evt.isAutomated && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-500 px-1.5 py-0.2 rounded font-medium border border-rose-500/30">Auto</span>
                            )}
                          </div>
                          <div className={`text-[10px] ${subText}`}>{evt.date}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border font-mono ${
                          theme === 'dark' ? 'bg-slate-800 text-[#94A3B8] border-white/10' : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}>
                          in {evt.daysLeft}d
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Add Shared Event</h3>
              <button onClick={() => setShowAddModal(false)} className={subText}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`text-[11px] block mb-1 ${subText}`}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Reunion Trip / Date Night"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
                />
              </div>

              <div>
                <label className={`text-[11px] block mb-1 ${subText}`}>Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
                />
              </div>

              <div>
                <label className={`text-[11px] block mb-1 ${subText}`}>Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Anniversary', 'Birthday', 'Trip', 'Date Night'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEventCategory(cat)}
                      className={`py-1.5 rounded-xl text-xs font-medium border ${
                        eventCategory === cat 
                          ? 'bg-[#FF2D55] border-[#FF2D55] text-white' 
                          : insetBg
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full py-2.5 bg-[#FF2D55] hover:bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95"
              >
                Save Shared Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
