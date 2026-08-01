import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Send, Edit3, Sparkles, Heart, Circle, Clock, Palette } from 'lucide-react';

export default function CreativeStudio({ subTab = 'doodle', setSubTab, onSendStudioContent, theme = 'dark' }) {
  const [expirationOption, setExpirationOption] = useState(24);

  // ─── VOICE CLIP RECORDING STATE ─────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const timerRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordTime(0);
    setAudioUrl(null);

    timerRef.current = setInterval(() => {
      setRecordTime((prev) => {
        if (prev >= 5) {
          stopRecording();
          return 5;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setIsRecording(false);
    setAudioUrl('simulated-voice-clip.mp3');
  };

  const sendVoiceClip = () => {
    if (!audioUrl) return;
    onSendStudioContent({
      id: Date.now(),
      type: 'voice',
      intensity: `Voice Hug (${recordTime}s)`,
      from: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: '🎙️',
      expirationHours: expirationOption,
      expiresAt: Date.now() + expirationOption * 3600 * 1000,
      savedToVault: false
    });
    setAudioUrl(null);
    setRecordTime(0);
  };

  // ─── DOODLE CANVAS STATE ────────────────────────
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF2D55');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
  }, [color, subTab]);

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const sendDoodle = () => {
    const canvas = canvasRef.current;
    const doodleUrl = canvas ? canvas.toDataURL() : null;

    onSendStudioContent({
      id: Date.now(),
      type: 'doodle',
      intensity: 'Doodle sent to Alex 🎨',
      doodleUrl: doodleUrl,
      from: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: '🎨',
      expirationHours: expirationOption,
      expiresAt: Date.now() + expirationOption * 3600 * 1000,
      savedToVault: false
    });
    clearCanvas();
  };

  const currentTab = subTab === 'touch' ? 'doodle' : subTab;

  const cardBg = theme === 'dark' ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-md';
  const insetBg = theme === 'dark' ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200 text-slate-800';
  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-24">
      {/* SUB-TABS NAVIGATION */}
      <div className={`flex p-1 rounded-2xl border ${cardBg}`}>
        {[
          { id: 'doodle', label: 'Finger Doodle 🎨' },
          { id: 'voice', label: 'Voice Notes 🎙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === tab.id
                ? 'bg-[#FF2D55] text-white shadow-md'
                : subText
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SENDER EXPIRATION TIMER SELECTOR */}
      <div className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs ${cardBg}`}>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#FF2D55]" />
          <span className="font-semibold">Expires In:</span>
        </div>
        <select
          value={expirationOption}
          onChange={(e) => setExpirationOption(Number(e.target.value))}
          className={`border text-xs font-bold px-2.5 py-1 rounded-xl focus:outline-none focus:border-[#FF2D55] cursor-pointer ${
            theme === 'dark' ? 'bg-[#0F172A] border-white/10 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
          }`}
        >
          <option value={24}>24 Hours (Default) ⏳</option>
          <option value={72}>3 Days 📅</option>
          <option value={168}>1 Week 🗓️</option>
          <option value={720}>1 Month 📆</option>
        </select>
      </div>

      {/* SUB-TAB 1: DOODLE STUDIO */}
      {currentTab === 'doodle' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#FF2D55]" /> Finger Doodle Studio
            </h2>
            <button
              onClick={clearCanvas}
              className={`text-xs flex items-center gap-1 ${subText}`}
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          <div className={`relative w-full h-80 rounded-2xl border overflow-hidden shadow-inner ${insetBg}`}>
            <canvas
              ref={canvasRef}
              width={340}
              height={320}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>

          <div className={`flex items-center justify-between p-2.5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center space-x-2">
              {['#FF2D55', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#FFFFFF'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border border-slate-300 dark:border-white/20 transition-transform ${
                    color === c ? 'scale-125 border-white ring-2 ring-rose-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <button
              onClick={sendDoodle}
              className="px-4 py-2 bg-[#FF2D55] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-rose-600 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Send Doodle
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VOICE STUDIO */}
      {currentTab === 'voice' && (
        <div className="space-y-3 text-center">
          <h2 className="text-sm font-semibold flex items-center justify-center gap-1.5">
            <Mic className="w-4 h-4 text-[#FF2D55]" /> Voice Note Studio
          </h2>
          <p className={`text-xs ${subText}`}>Record a sweet 5-second voice clip for Alex</p>

          <div className={`border rounded-2xl p-6 space-y-4 shadow-lg ${cardBg}`}>
            <div className={`w-20 h-20 rounded-full border mx-auto flex items-center justify-center relative ${insetBg}`}>
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-2 border-[#FF2D55] animate-ping opacity-75" />
              )}
              <Mic className={`w-8 h-8 ${isRecording ? 'text-[#FF2D55] animate-bounce' : subText}`} />
            </div>

            <div className="text-lg font-bold font-mono">
              00:0{recordTime} / 00:05
            </div>

            <div className="flex items-center justify-center space-x-3">
              {!isRecording && !audioUrl && (
                <button
                  onClick={startRecording}
                  className="px-5 py-2.5 bg-[#FF2D55] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md hover:bg-rose-600 active:scale-95 transition-all"
                >
                  <Circle className="w-4 h-4 fill-current text-white" /> Record Clip
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md hover:bg-amber-600 active:scale-95 transition-all"
                >
                  <Square className="w-4 h-4 fill-current text-white" /> Stop Recording
                </button>
              )}

              {audioUrl && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={sendVoiceClip}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md hover:bg-emerald-500 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" /> Send Voice Clip
                  </button>
                  <button
                    onClick={() => { setAudioUrl(null); setRecordTime(0); }}
                    className={`p-2.5 border rounded-xl text-xs ${insetBg}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
