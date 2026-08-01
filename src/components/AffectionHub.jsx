import React, { useState, useEffect, useRef } from 'react';
import { Heart, Activity as ActivityIcon, ChevronDown, ChevronUp, Calendar, GripVertical, Sparkles, MapPin, Camera, Upload, X, AlertCircle, Hand } from 'lucide-react';

export default function AffectionHub({ onSendAffection, theme = 'dark' }) {
  // ─── CARD REARRANGING & DRAG AND DROP STATE ─────────────
  const DEFAULT_ORDER = ['countdown', 'affection', 'prompts', 'heartbeat', 'touch'];
  
  const [cardOrder, setCardOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('together_home_card_order');
      return saved ? JSON.parse(saved) : DEFAULT_ORDER;
    } catch {
      return DEFAULT_ORDER;
    }
  });

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedOrder = [...cardOrder];
    const item = updatedOrder[draggedIndex];
    updatedOrder.splice(draggedIndex, 1);
    updatedOrder.splice(index, 0, item);

    setDraggedIndex(index);
    setCardOrder(updatedOrder);
    localStorage.setItem('together_home_card_order', JSON.stringify(updatedOrder));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Live Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    mins: 34,
    secs: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => cancelAnimationFrame(timer);
  }, []);

  // Press & Hold State for HUG
  const [hugPressing, setHugPressing] = useState(false);
  const [hugDuration, setHugDuration] = useState(0);
  const hugStartTimeRef = useRef(null);
  const hugIntervalRef = useRef(null);

  const startHugPress = () => {
    setHugPressing(true);
    hugStartTimeRef.current = Date.now();
    setHugDuration(0);
    hugIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - hugStartTimeRef.current;
      setHugDuration(elapsed);
    }, 40);
  };

  const endHugPress = () => {
    if (!hugPressing) return;
    clearInterval(hugIntervalRef.current);
    const finalDuration = Date.now() - hugStartTimeRef.current;
    
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    onSendAffection({
      id: Date.now(),
      type: 'hug',
      intensity: getHugLabel(finalDuration),
      from: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: '🫂'
    });

    setHugPressing(false);
    setHugDuration(0);
  };

  const getHugLabel = (ms) => {
    if (ms >= 2500) return 'Tight Hug (2.5s)';
    if (ms >= 1500) return 'Warm Hug (1.5s)';
    return 'Gentle Hug (0.5s)';
  };

  const hugProgress = Math.min(100, (hugDuration / 2500) * 100);

  // Press & Hold State for KISS
  const [kissPressing, setKissPressing] = useState(false);
  const [kissDuration, setKissDuration] = useState(0);
  const kissStartTimeRef = useRef(null);
  const kissIntervalRef = useRef(null);

  const startKissPress = () => {
    setKissPressing(true);
    kissStartTimeRef.current = Date.now();
    setKissDuration(0);
    kissIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - kissStartTimeRef.current;
      setKissDuration(elapsed);
    }, 40);
  };

  const endKissPress = () => {
    if (!kissPressing) return;
    clearInterval(kissIntervalRef.current);
    const finalDuration = Date.now() - kissStartTimeRef.current;
    
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);

    onSendAffection({
      id: Date.now(),
      type: 'kiss',
      intensity: getKissLabel(finalDuration),
      from: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: '💋'
    });

    setKissPressing(false);
    setKissDuration(0);
  };

  const getKissLabel = (ms) => {
    if (ms >= 2500) return 'Long Kiss (2.5s)';
    if (ms >= 1500) return 'Sweet Kiss (1.5s)';
    return 'Quick Peck (0.5s)';
  };

  const kissProgress = Math.min(100, (kissDuration / 2500) * 100);

  // ─── CLEAN TAP-ONLY HEARTBEAT ECG CANVAS STATE (COLLAPSED BY DEFAULT!) ─────
  const [isHeartbeatExpanded, setIsHeartbeatExpanded] = useState(false);
  const [sessionBeats, setSessionBeats] = useState(0);
  const canvasRef = useRef(null);
  const spikeQueueRef = useRef([]);
  const autoSendTimerRef = useRef(null);

  useEffect(() => {
    if (!isHeartbeatExpanded) return;
    
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    let points = Array(width).fill(midY);
    let frame = 0;

    const render = () => {
      frame++;
      
      if (frame % 2 === 0) {
        let nextY = midY;

        if (spikeQueueRef.current.length > 0) {
          nextY = spikeQueueRef.current.shift();
        }

        points.shift();
        points.push(nextY);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#FF2D55';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#FF2D55';
      ctx.beginPath();
      for (let x = 0; x < points.length; x++) {
        if (x === 0) ctx.moveTo(x, points[x]);
        else ctx.lineTo(x, points[x]);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isHeartbeatExpanded, cardOrder]);

  const triggerBeatSpike = () => {
    if (navigator.vibrate) navigator.vibrate(60);

    const midY = 32;
    spikeQueueRef.current = [
      ...spikeQueueRef.current, 
      midY, midY - 2, midY - 4, midY - 8, midY + 12, midY + 16, midY - 28, midY - 32, midY + 18, midY + 20, midY - 6, midY - 2, midY
    ];

    setSessionBeats(prev => {
      const nextBeats = prev + 1;
      
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = setTimeout(() => {
        onSendAffection({
          id: Date.now(),
          type: 'heartbeat',
          intensity: `Synced ${nextBeats} live heartbeats`,
          from: 'You',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: '💓'
        });
        setSessionBeats(0);
      }, 2500);

      return nextBeats;
    });
  };

  // ─── TOUCH TOGETHER STATE (BELOW HEARTBEAT, COLLAPSED BY DEFAULT) ─────
  const [isTouchExpanded, setIsTouchExpanded] = useState(false);
  const [touchPos, setTouchPos] = useState({ x: 50, y: 45 });
  const [alexPos, setAlexPos] = useState({ x: 52, y: 46 });
  const [isSparking, setIsSparking] = useState(false);

  const handleTouchCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTouchPos({ x, y });
    
    const targetAlexX = Math.max(10, Math.min(90, x + (Math.random() * 6 - 3)));
    const targetAlexY = Math.max(10, Math.min(90, y + (Math.random() * 6 - 3)));
    setAlexPos({ x: targetAlexX, y: targetAlexY });

    setIsSparking(true);
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    setTimeout(() => {
      setIsSparking(false);
      onSendAffection({
        id: Date.now(),
        type: 'touch',
        intensity: 'Hearts met in Simultaneous Touch! ✨',
        from: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: '💖'
      });
    }, 1500);
  };

  // ─── SPECIAL URGENT AFFECTION MODAL STATE ───────────────
  const [urgentType, setUrgentType] = useState(null);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const photoInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      setAttachedPhoto(uploadEvt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSendUrgentAffection = () => {
    const emoji = urgentType === 'hug' ? '🫂' : '💋';
    const title = urgentType === 'hug' ? 'NEED HUG NOW!' : 'NEED KISS NOW!';
    const locationText = includeLocation ? '📍 Location Attached (1,240 km away)' : '';
    const photoText = attachedPhoto ? '📷 Selfie Attached' : '';

    onSendAffection({
      id: Date.now(),
      type: 'request',
      intensity: `🚨 ${title} ${locationText} ${photoText}`,
      from: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: emoji
    });

    setUrgentType(null);
    setAttachedPhoto(null);
  };

  // THEME STYLING TOKENS
  const cardBg = theme === 'dark' ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-md';
  const insetBg = theme === 'dark' ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200 text-slate-800';
  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  // UNIFIED CARD RENDERER WITH DYNAMIC THEME
  const renderCard = (cardId, index) => {
    const isBeingDragged = draggedIndex === index;
    const baseCardStyle = `rounded-2xl p-4 border shadow-lg space-y-3 transition-all duration-200 ${cardBg} ${
      isBeingDragged ? 'opacity-40 scale-98 border-[#FF2D55]' : ''
    }`;

    switch (cardId) {
      case 'countdown':
        return (
          <div
            key="countdown"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={baseCardStyle}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <GripVertical className={`w-4 h-4 ${subText} cursor-grab active:cursor-grabbing flex-shrink-0`} />
                <Calendar className="w-4 h-4 text-[#FF2D55]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">REUNION COUNTDOWN</h3>
              </div>
              <Heart className="w-4 h-4 text-[#FF2D55] fill-current animate-pulse" />
            </div>

            <div className="grid grid-cols-4 gap-2 text-center py-1">
              {[
                { val: timeLeft.days, unit: 'DAYS' },
                { val: String(timeLeft.hours).padStart(2, '0'), unit: 'HOURS' },
                { val: String(timeLeft.mins).padStart(2, '0'), unit: 'MINS' },
                { val: String(timeLeft.secs).padStart(2, '0'), unit: 'SECS' },
              ].map((item, i) => (
                <div key={i} className={`p-2.5 rounded-xl border ${insetBg}`}>
                  <div className="text-xl font-bold font-mono">{item.val}</div>
                  <div className={`text-[9px] font-semibold uppercase mt-0.5 tracking-wider ${subText}`}>{item.unit}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'affection':
        return (
          <div
            key="affection"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={baseCardStyle}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <GripVertical className={`w-4 h-4 ${subText} cursor-grab active:cursor-grabbing flex-shrink-0`} />
                <Heart className="w-4 h-4 text-[#FF2D55]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">SEND AFFECTION</h3>
              </div>
              <span className={`text-[10px] font-medium ${subText}`}>Press & Hold</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* HUG */}
              <button
                onMouseDown={startHugPress}
                onMouseUp={endHugPress}
                onMouseLeave={endHugPress}
                onTouchStart={startHugPress}
                onTouchEnd={endHugPress}
                className={`w-full border rounded-2xl p-4 flex flex-col items-center justify-between h-44 transition-all duration-200 select-none ${insetBg} ${
                  hugPressing 
                    ? 'scale-105 border-[#FF2D55] shadow-glow' 
                    : 'active:scale-95'
                }`}
              >
                <div className={`w-full flex items-center justify-between text-xs ${subText}`}>
                  <span className="font-semibold text-[#FF2D55]">HUG</span>
                  <span>{hugPressing ? `${(hugDuration / 1000).toFixed(1)}s` : '0.5s - 2.5s'}</span>
                </div>
                <div className="my-2 relative flex items-center justify-center">
                  <svg className="w-14 h-14 text-[#FF2D55]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold">{hugPressing ? getHugLabel(hugDuration) : 'Warm Hug'}</div>
                  <div className={`text-[11px] mt-0.5 ${subText}`}>Press & Hold</div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-gradient-to-r from-amber-400 via-rose-500 to-[#FF2D55] h-full transition-all duration-75" style={{ width: `${hugProgress}%` }} />
                </div>
              </button>

              {/* KISS */}
              <button
                onMouseDown={startKissPress}
                onMouseUp={endKissPress}
                onMouseLeave={endKissPress}
                onTouchStart={startKissPress}
                onTouchEnd={endKissPress}
                className={`w-full border rounded-2xl p-4 flex flex-col items-center justify-between h-44 transition-all duration-200 select-none ${insetBg} ${
                  kissPressing 
                    ? 'scale-105 border-[#FF2D55] shadow-glow' 
                    : 'active:scale-95'
                }`}
              >
                <div className={`w-full flex items-center justify-between text-xs ${subText}`}>
                  <span className="font-semibold text-[#FF2D55]">KISS</span>
                  <span>{kissPressing ? `${(kissDuration / 1000).toFixed(1)}s` : '0.5s - 2.5s'}</span>
                </div>
                <div className="my-2 relative flex items-center justify-center">
                  <svg className="w-14 h-14 text-[#FF2D55]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-4.5 0-7.5 3-7.5 6 0 4.5 3.5 9 7.5 9s7.5-4.5 7.5-9c0-3-3-6-7.5-6zm0 10.5c-2.5 0-4.5-1.5-4.5-3s2-3 4.5-3 4.5 1.5 4.5 3-2 1.5-4.5 3z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold">{kissPressing ? getKissLabel(kissDuration) : 'Sweet Kiss'}</div>
                  <div className={`text-[11px] mt-0.5 ${subText}`}>Press & Hold</div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-gradient-to-r from-pink-400 via-rose-500 to-[#FF2D55] h-full transition-all duration-75" style={{ width: `${kissProgress}%` }} />
                </div>
              </button>
            </div>

            {/* TWO SPECIAL URGENT BUTTONS (HIGH CONTRAST IN LIGHT MODE!) */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/5 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#FF2D55] tracking-wider px-0.5">
                ⚡ Urgent Request (Attach Location & Photo)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setUrgentType('hug')}
                  className="py-2 px-3 bg-[#FF2D55]/10 hover:bg-[#FF2D55]/20 border border-[#FF2D55]/30 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <span className="text-base">🫂</span> NEED HUG NOW!
                </button>
                <button
                  onClick={() => setUrgentType('kiss')}
                  className="py-2 px-3 bg-[#FF2D55]/10 hover:bg-[#FF2D55]/20 border border-[#FF2D55]/30 rounded-xl text-xs font-bold text-rose-800 dark:text-pink-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <span className="text-base">💋</span> NEED KISS NOW!
                </button>
              </div>
            </div>
          </div>
        );

      case 'prompts':
        return (
          <div
            key="prompts"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={baseCardStyle}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <GripVertical className={`w-4 h-4 ${subText} cursor-grab active:cursor-grabbing flex-shrink-0`} />
                <Sparkles className="w-4 h-4 text-[#FF2D55]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">QUICK PROMPTS</h3>
              </div>
              <span className={`text-[10px] font-medium ${subText}`}>Instant</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Thinking of You 💕', type: 'moment' },
                { label: 'So Proud of You 🌟', type: 'moment' },
                { label: 'Grateful for You 🙏', type: 'moment' },
                { label: 'Missing Your Hugs 🫂', type: 'request' },
                { label: 'Sending Kisses 💋', type: 'moment' },
                { label: 'Love You ❤️‍th', type: 'moment' },
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendAffection({
                    id: Date.now(),
                    type: prompt.type,
                    intensity: prompt.label,
                    from: 'You',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    icon: prompt.label.slice(-2)
                  })}
                  className={`w-full border py-2.5 px-3 rounded-xl text-xs font-medium transition-all active:scale-95 text-center truncate ${
                    theme === 'dark' 
                      ? 'bg-[#262F3F]/80 hover:bg-[#FF2D55]/20 border-white/10 text-white' 
                      : 'bg-slate-50 hover:bg-rose-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'heartbeat':
        return (
          <div
            key="heartbeat"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={baseCardStyle}
          >
            <button
              onClick={() => setIsHeartbeatExpanded(!isHeartbeatExpanded)}
              className="w-full flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2.5 text-left"
            >
              <div className="flex items-center gap-2">
                <GripVertical className={`w-4 h-4 ${subText} cursor-grab active:cursor-grabbing flex-shrink-0`} />
                <ActivityIcon className="w-4 h-4 text-[#FF2D55]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">HEARTBEAT</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
                {isHeartbeatExpanded ? <ChevronUp className={`w-4 h-4 ${subText}`} /> : <ChevronDown className={`w-4 h-4 ${subText}`} />}
              </div>
            </button>

            {isHeartbeatExpanded && (
              <div className="pt-0 space-y-3 animate-fade-in">
                <div className={`relative w-full h-16 rounded-xl overflow-hidden border flex items-center justify-center mt-1 ${insetBg}`}>
                  <canvas ref={canvasRef} width={340} height={64} className="w-full h-full block relative z-10" />
                </div>

                <button
                  onClick={triggerBeatSpike}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs transition-all duration-150 select-none flex flex-col items-center justify-center gap-0.5 border shadow-lg active:scale-95 ${
                    sessionBeats > 0
                      ? 'bg-[#FF2D55] border-[#FF2D55] text-white shadow-glowPulse scale-102'
                      : 'bg-gradient-to-r from-[#FF2D55]/90 to-rose-600 border-white/10 text-white hover:opacity-95'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Heart className={`w-4 h-4 fill-current ${sessionBeats > 0 ? 'animate-ping' : ''}`} />
                    <span>{sessionBeats > 0 ? `Tapping Live... (${sessionBeats} Beats Recorded)` : 'Tap Here to Send Heartbeats'}</span>
                  </div>
                  <div className="text-[10px] opacity-80 font-mono">
                    {sessionBeats > 0 ? 'Beats will send automatically when finished tapping' : 'Tap to generate live ECG pulse spikes'}
                  </div>
                </button>
              </div>
            )}
          </div>
        );

      case 'touch':
        return (
          <div
            key="touch"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={baseCardStyle}
          >
            <button
              onClick={() => setIsTouchExpanded(!isTouchExpanded)}
              className="w-full flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2.5 text-left"
            >
              <div className="flex items-center gap-2">
                <GripVertical className={`w-4 h-4 ${subText} cursor-grab active:cursor-grabbing flex-shrink-0`} />
                <Hand className="w-4 h-4 text-[#FF2D55]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">TOUCH TOGETHER</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium ${subText}`}>Real-time</span>
                {isTouchExpanded ? <ChevronUp className={`w-4 h-4 ${subText}`} /> : <ChevronDown className={`w-4 h-4 ${subText}`} />}
              </div>
            </button>

            {isTouchExpanded && (
              <div className="pt-1 space-y-3 animate-fade-in">
                <div className="text-center">
                  <p className={`text-xs ${subText}`}>Touch the screen to let your hearts meet</p>
                </div>

                <div
                  onClick={handleTouchCanvasClick}
                  className={`relative w-full h-64 rounded-2xl border overflow-hidden cursor-pointer flex items-center justify-center select-none shadow-inner ${insetBg}`}
                >
                  <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />

                  <div
                    className={`absolute transition-all duration-300 pointer-events-none flex items-center justify-center ${
                      isSparking ? 'scale-125 opacity-100' : 'scale-90 opacity-80'
                    }`}
                    style={{ left: `${(touchPos.x + alexPos.x) / 2}%`, top: `${(touchPos.y + alexPos.y) / 2}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-32 h-32 rounded-full border-2 border-[#FF2D55] animate-ping opacity-75" />
                    <div className="absolute w-24 h-24 rounded-full border border-rose-400 animate-pulse-glow" />
                    <Heart className="w-10 h-10 text-[#FF2D55] fill-current animate-bounce shadow-glow" />
                  </div>

                  <div
                    className="absolute w-4 h-4 rounded-full bg-[#FF2D55] border-2 border-white shadow-glow transition-all duration-150"
                    style={{ left: `${touchPos.x}%`, top: `${touchPos.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-[#FF2D55] whitespace-nowrap font-medium">You</span>
                  </div>

                  <div
                    className="absolute w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-glow transition-all duration-300"
                    style={{ left: `${alexPos.x}%`, top: `${alexPos.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-indigo-500 font-medium">Alex</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-24">
      {cardOrder.map((cardId, index) => renderCard(cardId, index))}

      {/* SPECIAL URGENT AFFECTION ATTACHMENT MODAL */}
      {urgentType && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`border border-[#FF2D55]/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF2D55] animate-bounce" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Send {urgentType === 'hug' ? '🫂 Need Hug Now!' : '💋 Need Kiss Now!'}
                </h3>
              </div>
              <button onClick={() => setUrgentType(null)} className={subText}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs ${subText}`}>
              Send an urgent alert to Alex with your live location and selfie!
            </p>

            <div className={`p-3 rounded-2xl border flex items-center justify-between ${insetBg}`}>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#FF2D55]" />
                <div>
                  <span className="text-xs font-bold block">Attach Live Location</span>
                  <span className={`text-[10px] ${subText}`}>1,240 km away • GPS Active</span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={includeLocation}
                onChange={(e) => setIncludeLocation(e.target.checked)}
                className="w-4 h-4 accent-[#FF2D55] cursor-pointer"
              />
            </div>

            <div className={`p-3 rounded-2xl border space-y-2 ${insetBg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">Attach Selfie / Photo</span>
                </div>
                
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => photoInputRef.current && photoInputRef.current.click()}
                  className="px-2.5 py-1 bg-[#FF2D55] text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 shadow-md active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" /> {attachedPhoto ? 'Change Photo' : 'Choose Photo'}
                </button>
              </div>

              {attachedPhoto && (
                <div className="relative rounded-xl overflow-hidden border border-white/20 mt-1">
                  <img src={attachedPhoto} alt="Selfie" className="w-full h-32 object-cover" />
                  <button
                    onClick={() => setAttachedPhoto(null)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleSendUrgentAffection}
              className="w-full py-3 bg-[#FF2D55] hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              Broadcast Urgent Request to Alex NOW!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
