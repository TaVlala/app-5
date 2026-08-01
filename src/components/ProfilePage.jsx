import React, { useState, useRef } from 'react';
import { User, Heart, Upload, Save, Check, ArrowLeft, Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProfilePage({ profileData, onSaveProfile, onClose, theme = 'dark' }) {
  const [formData, setFormData] = useState(() => profileData || {
    userName: 'Taylor',
    userLocation: 'New York, USA',
    userTimezone: 'EST (UTC-5)',
    userBirthday: '1998-06-15',
    userLoveLanguage: 'Physical Touch',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',

    partnerName: 'Alex',
    partnerLocation: 'London, UK',
    partnerTimezone: 'BST (UTC+1)',
    partnerBirthday: '1997-08-14',
    partnerLoveLanguage: 'Quality Time',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',

    coupleNickname: 'Tay & Alex 💕',

    milestones: [
      { id: 1, type: 'First Met', title: 'The Day We Met 💖', date: '2023-02-14' },
      { id: 2, type: 'Engagement', title: 'Got Engaged in Paris 💍', date: '2024-07-20' },
      { id: 3, type: 'Marriage', title: 'Wedding Day 💒', date: '2025-06-12' }
    ]
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isMilestonesExpanded, setIsMilestonesExpanded] = useState(false);

  const userFileInputRef = useRef(null);
  const partnerFileInputRef = useRef(null);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      handleChange(field, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMilestone = () => {
    const newM = {
      id: Date.now(),
      type: 'Engagement',
      title: 'Engagement Anniversary 💍',
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [...(formData.milestones || []), newM];
    handleChange('milestones', updated);
    setIsMilestonesExpanded(true);
  };

  const handleUpdateMilestone = (id, field, val) => {
    const updated = (formData.milestones || []).map(m => m.id === id ? { ...m, [field]: val } : m);
    handleChange('milestones', updated);
  };

  const handleRemoveMilestone = (id) => {
    const updated = (formData.milestones || []).filter(m => m.id !== id);
    handleChange('milestones', updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const calculateDaysTogether = () => {
    const milestones = formData.milestones || [];
    const firstMet = milestones.find(m => m.type === 'First Met') || milestones[0];
    if (!firstMet || !firstMet.date) return 1265;
    const start = new Date(firstMet.date);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysTogether = calculateDaysTogether();
  const firstMetMilestone = (formData.milestones || []).find(m => m.type === 'First Met');

  const loveLanguages = ['Physical Touch', 'Quality Time', 'Words of Affirmation', 'Acts of Service', 'Receiving Gifts'];
  const milestoneTypes = ['First Met', 'First Date', 'Engagement', 'Marriage', 'Moved In Together', 'First Trip', 'Custom'];

  const cardBg = theme === 'dark' ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-md';
  const insetBg = theme === 'dark' ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200 text-slate-800';
  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-5 pb-24">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className={`p-1.5 rounded-xl border ${cardBg}`}>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#FF2D55]" /> Couple Profile Settings
            </h2>
            <p className={`text-xs ${subText}`}>Personalize info for you & your partner</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 bg-[#FF2D55] hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {savedSuccess ? 'Saved!' : 'Save'}
        </button>
      </div>

      {/* DAYS TOGETHER SUMMARY BANNER */}
      <div className={`border border-[#FF2D55]/30 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden ${cardBg}`}>
        <div className="absolute inset-0 bg-[#FF2D55]/5" />
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FF2D55] flex items-center justify-center text-white shadow-glow">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#FF2D55] tracking-wider">Together For</div>
            <div className="text-base font-bold font-mono">{daysTogether.toLocaleString()} Days 💕</div>
          </div>
        </div>

        <div className={`text-right text-[11px] relative z-10 ${subText}`}>
          First Met: <span className="font-medium">{firstMetMilestone ? firstMetMilestone.date : '2023-02-14'}</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* 1. RELATIONSHIP CARD */}
        <div className={`border rounded-2xl p-4 space-y-3 shadow-lg ${cardBg}`}>
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-2">
            <Heart className="w-4 h-4 text-[#FF2D55]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Relationship Details</h3>
          </div>

          <div>
            <label className={`text-[11px] block mb-1 ${subText}`}>Couple Nickname</label>
            <input
              type="text"
              value={formData.coupleNickname || ''}
              onChange={(e) => handleChange('coupleNickname', e.target.value)}
              placeholder="e.g. Tay & Alex 💕"
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
            />
          </div>
        </div>

        {/* 2. RELATIONSHIP MILESTONES CARD */}
        <div className={`border rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${cardBg}`}>
          <button
            type="button"
            onClick={() => setIsMilestonesExpanded(!isMilestonesExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF2D55]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">Relationship Milestones</h3>
              <span className="text-[10px] bg-[#FF2D55]/10 text-[#FF2D55] px-2 py-0.5 rounded-full border border-[#FF2D55]/20 font-bold">
                {(formData.milestones || []).length} Milestones
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isMilestonesExpanded ? <ChevronUp className={`w-4 h-4 ${subText}`} /> : <ChevronDown className={`w-4 h-4 ${subText}`} />}
            </div>
          </button>

          {isMilestonesExpanded && (
            <div className="p-4 pt-0 space-y-3 animate-fade-in border-t border-slate-200 dark:border-white/5 mt-1">
              <p className={`text-[11px] mt-2 ${subText}`}>
                Add milestones like First Met, Engagement, or Wedding. Days together and annual anniversaries are automatically calculated! 📅
              </p>

              <div className="space-y-3">
                {(formData.milestones || []).map((m) => (
                  <div key={m.id} className={`p-3 border rounded-xl space-y-2.5 relative ${insetBg}`}>
                    <div className="flex items-center justify-between">
                      <select
                        value={m.type}
                        onChange={(e) => handleUpdateMilestone(m.id, 'type', e.target.value)}
                        className={`text-xs font-bold px-2 py-1 border rounded-lg focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
                      >
                        {milestoneTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(m.id)}
                        className="p-1 text-[#94A3B8] hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleUpdateMilestone(m.id, 'title', e.target.value)}
                        placeholder="Milestone Title"
                        className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
                      />
                      <input
                        type="date"
                        value={m.date}
                        onChange={(e) => handleUpdateMilestone(m.id, 'date', e.target.value)}
                        className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddMilestone}
                className="w-full py-2 bg-[#FF2D55]/10 hover:bg-[#FF2D55]/20 text-[#FF2D55] border border-[#FF2D55]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Relationship Milestone
              </button>
            </div>
          )}
        </div>

        {/* 3. YOUR PROFILE */}
        <div className={`border rounded-2xl p-4 space-y-3 shadow-lg ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#FF2D55]" /> Your Profile
            </h3>
            <span className="text-[10px] text-[#FF2D55] font-bold">You</span>
          </div>

          <div className="flex items-center space-x-3">
            <img src={formData.userAvatar} alt="You" className="w-14 h-14 rounded-full object-cover border-2 border-[#FF2D55]" />
            <div className="space-y-1 flex-1">
              <input
                ref={userFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('userAvatar', e)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => userFileInputRef.current && userFileInputRef.current.click()}
                className="px-3 py-1 bg-[#FF2D55] text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 shadow-md hover:bg-rose-600 transition-all active:scale-95"
              >
                <Upload className="w-3 h-3" /> Change Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={`text-[10px] block mb-1 ${subText}`}>Name</label>
              <input
                type="text"
                value={formData.userName || ''}
                onChange={(e) => handleChange('userName', e.target.value)}
                className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
              />
            </div>
            <div>
              <label className={`text-[10px] block mb-1 ${subText}`}>Location</label>
              <input
                type="text"
                value={formData.userLocation || ''}
                onChange={(e) => handleChange('userLocation', e.target.value)}
                className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#FF2D55] ${insetBg}`}
              />
            </div>
          </div>
        </div>

        {/* 4. PARTNER PROFILE */}
        <div className={`border rounded-2xl p-4 space-y-3 shadow-lg ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" /> Partner's Profile
            </h3>
            <span className="text-[10px] text-indigo-500 font-bold">Partner</span>
          </div>

          <div className="flex items-center space-x-3">
            <img src={formData.partnerAvatar} alt="Partner" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500" />
            <div className="space-y-1 flex-1">
              <input
                ref={partnerFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('partnerAvatar', e)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => partnerFileInputRef.current && partnerFileInputRef.current.click()}
                className="px-3 py-1 bg-indigo-600 text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 shadow-md hover:bg-indigo-500 transition-all active:scale-95"
              >
                <Upload className="w-3 h-3" /> Change Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={`text-[10px] block mb-1 ${subText}`}>Name</label>
              <input
                type="text"
                value={formData.partnerName || ''}
                onChange={(e) => handleChange('partnerName', e.target.value)}
                className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${insetBg}`}
              />
            </div>
            <div>
              <label className={`text-[10px] block mb-1 ${subText}`}>Location</label>
              <input
                type="text"
                value={formData.partnerLocation || ''}
                onChange={(e) => handleChange('partnerLocation', e.target.value)}
                className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${insetBg}`}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
