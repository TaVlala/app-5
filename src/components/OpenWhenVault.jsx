import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Unlock, Plus, Heart, Calendar, Image as ImageIcon, Upload, X, Clock, Key, Check, ChevronDown, ChevronUp, Sparkles, Activity, Star, Filter, ArrowUpDown, Smile, Play, Mic, Palette, Trash2, Camera } from 'lucide-react';

export default function OpenWhenVault({ onSendNote, currentMood, theme = 'dark' }) {
  const [activeSubTab, setActiveSubTab] = useState('letters'); // 'letters' | 'memories'

  // Filter & Sort State
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Balanced Emotional Mood List
  const emotionalMoods = [
    { label: 'Just Chilling / Normal ☁️', category: 'Neutral', icon: '☁️' },
    { label: 'Calm & Content ☕', category: 'Neutral', icon: '☕' },
    { label: 'Thoughtful & Nostalgic ✨', category: 'Neutral', icon: '✨' },
    { label: 'Super Happy & Excited 🎉', category: 'Positive', icon: '🎉' },
    { label: 'Feeling Loved & Cherished 💕', category: 'Positive', icon: '💕' },
    { label: 'Proud & Accomplished 🏆', category: 'Positive', icon: '🏆' },
    { label: 'Missing You Deeply 💭', category: 'Affectionate', icon: '💭' },
    { label: 'Craving Cuddles & Hugs 🫂', category: 'Affectionate', icon: '🫂' },
    { label: 'Want to be Kissed 💋', category: 'Affectionate', icon: '💋' },
    { label: 'Having a Tough Day 🌧️', category: 'Support', icon: '🌧️' },
    { label: 'Stressed / Overwhelmed ⚡', category: 'Support', icon: '⚡' },
    { label: 'Can’t Sleep 🌙', category: 'Support', icon: '🌙' }
  ];

  // ─── LETTERS STATE ──────────────────────────────────────
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('together_vault_letters');
      const rawNotes = saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: 'Open When You Miss Me 💭',
          category: 'Missing You',
          unlocked: true,
          unlockDate: 'Unlocked Today',
          unlockMood: 'Missing You Deeply 💭',
          content: 'My darling, whenever you feel far away, remember that every single second brings us closer to our reunion. Press the heartbeat button on our home page to feel my heart beating for you in real time. I love you endlessly!',
          author: 'Alex',
          icon: '💭',
          isFavorite: true,
          creatorFeeling: 'Missing You Deeply 💭',
          attachmentType: 'hug',
          attachmentData: { label: 'Tight Hug (2.5s)' },
          customSignoff: 'Forever and always yours, Alex 💕'
        },
        {
          id: 2,
          title: 'Open When You Have a Bad Day 🌧️',
          category: 'Support',
          unlocked: true,
          unlockDate: 'Unlocked Yesterday',
          unlockMood: 'Having a Tough Day 🌧️',
          content: 'Take a deep breath. You are stronger than any bad day. I wish I was there to wrap my arms around you and give you a 2.5-second tight hug. Remember I am always in your corner.',
          author: 'Alex',
          icon: '🌧️',
          isFavorite: false,
          creatorFeeling: 'Calm & Content ☕',
          attachmentType: 'kiss',
          attachmentData: { label: 'Sweet Kiss (1.5s)' },
          customSignoff: 'Holding you tight, Alex 🤗'
        },
        {
          id: 3,
          title: 'Open On Our 2-Year Anniversary 🥂',
          category: 'Milestone',
          unlocked: false,
          specificTargetDate: '2026-10-24',
          unlockDate: '2026-10-24',
          unlockMood: null,
          content: 'Happy 2-Year Anniversary! Look at how far we have come together...',
          author: 'Alex',
          icon: '🥂',
          isFavorite: true,
          creatorFeeling: 'Feeling Loved & Cherished 💕',
          attachmentType: 'heartbeat',
          attachmentData: { beats: 8 },
          customSignoff: 'Yours forever, Alex 🥂'
        },
        {
          id: 4,
          title: 'Open When You Can’t Sleep 🌙',
          category: 'Night',
          unlocked: false,
          unlockDate: 'Mood: Can’t Sleep 🌙',
          unlockMood: 'Can’t Sleep 🌙',
          content: 'Close your eyes and listen to my voice hug recording in the studio...',
          author: 'Alex',
          icon: '🌙',
          isFavorite: false,
          creatorFeeling: 'Calm & Content ☕',
          attachmentType: 'voice',
          attachmentData: { duration: '5s' },
          customSignoff: 'Sweet dreams my love, Alex 🌙'
        }
      ];

      const todayStr = new Date().toISOString().split('T')[0];
      return rawNotes.filter(note => {
        if (note.specificTargetDate && note.specificTargetDate < todayStr && !note.isFavorite && !note.savedToVault) {
          return false;
        }
        return true;
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('together_vault_letters', JSON.stringify(notes));
  }, [notes]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [lockedModalNote, setLockedModalNote] = useState(null);
  const [requestPending, setRequestPending] = useState(false);
  const [permissionGrantedText, setPermissionGrantedText] = useState(null);

  // New Letter Popover State
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Love');
  const [unlockType, setUnlockType] = useState('date');
  const [newUnlockDate, setNewUnlockDate] = useState('2026-08-14');
  const [selectedUnlockMood, setSelectedUnlockMood] = useState('Missing You Deeply 💭');

  const [isExtraAffectionExpanded, setIsExtraAffectionExpanded] = useState(false);
  const [newCreatorFeeling, setNewCreatorFeeling] = useState('Just Chilling / Normal ☁️');
  const [selectedAttachmentType, setSelectedAttachmentType] = useState('none');
  const [newCustomSignoff, setNewCustomSignoff] = useState('Forever yours, Taylor 💕');

  const [recordedHug, setRecordedHug] = useState(null);
  const [recordedKiss, setRecordedKiss] = useState(null);
  const [recordedHeartbeats, setRecordedHeartbeats] = useState(0);
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const [attachedDoodle, setAttachedDoodle] = useState(null);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  const modalDoodleCanvasRef = useRef(null);
  const [isDoodleDrawing, setIsDoodleDrawing] = useState(false);
  const [doodleColor, setDoodleColor] = useState('#FF2D55');

  const [hugPressing, setHugPressing] = useState(false);
  const [hugDuration, setHugDuration] = useState(0);
  const hugIntervalRef = useRef(null);
  const hugStartTimeRef = useRef(null);

  const [kissPressing, setKissPressing] = useState(false);
  const [kissDuration, setKissDuration] = useState(0);
  const kissIntervalRef = useRef(null);
  const kissStartTimeRef = useRef(null);

  const popoverSpikeQueueRef = useRef([]);
  const playbackCanvasRef = useRef(null);
  const letterPhotoInputRef = useRef(null);

  // ─── SHARED MEMORIES STATE ──────────────────────────────
  const [memories, setMemories] = useState(() => {
    try {
      const saved = localStorage.getItem('together_vault_memories');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: 'Sunset at the Beach 🌅',
          date: '2026-07-14',
          category: 'photo',
          isFavorite: true,
          imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 2,
          title: 'Heart Doodle Art 🎨',
          date: '2026-07-28',
          category: 'doodle',
          isFavorite: true,
          imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 3,
          title: 'Bedtime Voice Hug 🎙️',
          date: '2026-07-30',
          category: 'voice',
          isFavorite: false,
          imageUrl: null
        },
        {
          id: 4,
          title: 'Evening Coffee Date ☕',
          date: '2026-06-20',
          category: 'photo',
          isFavorite: false,
          imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('together_vault_memories', JSON.stringify(memories));
  }, [memories]);

  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryDate, setMemoryDate] = useState('2026-08-01');
  const [memoryImage, setMemoryImage] = useState('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80');
  const memoryFileInputRef = useRef(null);

  const toggleFavoriteNote = (e, id) => {
    e.stopPropagation();
    setNotes(notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  const toggleFavoriteMemory = (e, id) => {
    e.stopPropagation();
    setMemories(memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const togglePlayVoiceMemory = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setTimeout(() => setPlayingAudioId(null), 3000);
    }
  };

  const handleMatchMoodUnlock = (note, moodLabel) => {
    setPermissionGrantedText(`Mood Matched! (${moodLabel}) 🔓 Letter Unlocked!`);
    const updatedNotes = notes.map(n => n.id === note.id ? { ...n, unlocked: true } : n);
    setNotes(updatedNotes);

    setTimeout(() => {
      setLockedModalNote(null);
      setSelectedNote({ ...note, unlocked: true });
      setPermissionGrantedText(null);
    }, 1500);
  };

  const startHugPress = () => {
    setHugPressing(true);
    hugStartTimeRef.current = Date.now();
    setHugDuration(0);
    hugIntervalRef.current = setInterval(() => {
      setHugDuration(Date.now() - hugStartTimeRef.current);
    }, 40);
  };

  const endHugPress = () => {
    if (!hugPressing) return;
    clearInterval(hugIntervalRef.current);
    const totalTime = Date.now() - hugStartTimeRef.current;
    let label = 'Gentle Hug (0.5s)';
    if (totalTime >= 2500) label = 'Tight Hug (2.5s)';
    else if (totalTime >= 1500) label = 'Warm Hug (1.5s)';

    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    setRecordedHug(label);
    setHugPressing(false);
    setHugDuration(0);
  };

  const startKissPress = () => {
    setKissPressing(true);
    kissStartTimeRef.current = Date.now();
    setKissDuration(0);
    kissIntervalRef.current = setInterval(() => {
      setKissDuration(Date.now() - kissStartTimeRef.current);
    }, 40);
  };

  const endKissPress = () => {
    if (!kissPressing) return;
    clearInterval(kissIntervalRef.current);
    const totalTime = Date.now() - kissStartTimeRef.current;
    let label = 'Quick Peck (0.5s)';
    if (totalTime >= 2500) label = 'Long Kiss (2.5s)';
    else if (totalTime >= 1500) label = 'Sweet Kiss (1.5s)';

    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    setRecordedKiss(label);
    setKissPressing(false);
    setKissDuration(0);
  };

  const triggerHeartbeatTap = () => {
    setRecordedHeartbeats(prev => prev + 1);
    if (navigator.vibrate) navigator.vibrate(60);
    const midY = 24;
    popoverSpikeQueueRef.current = [...popoverSpikeQueueRef.current, midY - 2, midY - 6, midY + 10, midY - 20, midY + 12, midY - 4, midY];
  };

  const handleLetterPhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      setAttachedPhoto(uploadEvt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const saveDoodleAttachment = () => {
    const canvas = modalDoodleCanvasRef.current;
    if (canvas) {
      setAttachedDoodle(canvas.toDataURL());
    }
  };

  useEffect(() => {
    if (!selectedNote || (selectedNote.attachmentType !== 'heartbeat' && !selectedNote.heartbeatBeats)) return;
    const canvas = playbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    let points = Array(width).fill(midY);
    let frame = 0;
    let animId;
    let beats = (selectedNote.attachmentData && selectedNote.attachmentData.beats) || selectedNote.heartbeatBeats || 6;
    let queue = [];
    for (let i = 0; i < beats; i++) {
      queue.push(...[midY - 4, midY + 12, midY - 32, midY + 18, midY - 8, midY, midY, midY, midY]);
    }

    const renderPlayback = () => {
      frame++;
      if (frame % 2 === 0) {
        points.shift();
        let nextY = queue.length > 0 ? queue.shift() : midY;
        points.push(nextY);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#FF2D55';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < points.length; x++) {
        if (x === 0) ctx.moveTo(x, points[x]);
        else ctx.lineTo(x, points[x]);
      }
      ctx.stroke();

      animId = requestAnimationFrame(renderPlayback);
    };

    renderPlayback();
    return () => cancelAnimationFrame(animId);
  }, [selectedNote]);

  const handleRequestEarlyPermission = (note) => {
    setRequestPending(true);
    setPermissionGrantedText(null);

    setTimeout(() => {
      setRequestPending(false);
      setPermissionGrantedText(`Alex granted permission! 🔓 Letter unlocked.`);

      const updatedNotes = notes.map(n => n.id === note.id ? { ...n, unlocked: true } : n);
      setNotes(updatedNotes);

      setTimeout(() => {
        setLockedModalNote(null);
        setSelectedNote({ ...note, unlocked: true });
        setPermissionGrantedText(null);
      }, 1500);
    }, 2000);
  };

  const handleMemoryFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      setMemoryImage(uploadEvt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemorySubmit = (e) => {
    e.preventDefault();
    if (!memoryTitle) return;
    const newMem = {
      id: Date.now(),
      title: memoryTitle,
      date: memoryDate,
      category: 'photo',
      isFavorite: false,
      imageUrl: memoryImage
    };
    setMemories([newMem, ...memories]);
    setShowAddMemoryModal(false);
    setMemoryTitle('');
  };

  const handleCreateNoteSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    const unlockDisplay = unlockType === 'date' ? `Unlocks ${newUnlockDate}` : `Mood: ${selectedUnlockMood}`;

    let attachmentData = null;
    if (selectedAttachmentType === 'hug') attachmentData = { label: recordedHug || 'Warm Hug (1.5s)' };
    else if (selectedAttachmentType === 'kiss') attachmentData = { label: recordedKiss || 'Sweet Kiss (1.5s)' };
    else if (selectedAttachmentType === 'heartbeat') attachmentData = { beats: recordedHeartbeats || 6 };
    else if (selectedAttachmentType === 'photo') attachmentData = { url: attachedPhoto };
    else if (selectedAttachmentType === 'doodle') attachmentData = { url: attachedDoodle };
    else if (selectedAttachmentType === 'voice') attachmentData = { duration: '5s' };

    const newN = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      unlocked: false,
      unlockDate: unlockDisplay,
      specificTargetDate: unlockType === 'date' ? newUnlockDate : null,
      unlockMood: unlockType === 'condition' ? selectedUnlockMood : null,
      content: newContent,
      author: 'You',
      icon: '💌',
      isFavorite: false,
      creatorFeeling: newCreatorFeeling,
      attachmentType: selectedAttachmentType,
      attachmentData: attachmentData,
      customSignoff: newCustomSignoff
    };

    setNotes([newN, ...notes]);
    setShowCreateNoteModal(false);
    onSendNote && onSendNote(newN);
    setNewTitle('');
    setNewContent('');
    setSelectedAttachmentType('none');
    setRecordedHug(null);
    setRecordedKiss(null);
    setRecordedHeartbeats(0);
    setAttachedPhoto(null);
    setAttachedDoodle(null);
  };

  const getFilteredAndSortedLetters = () => {
    let list = [...notes];
    if (filterCategory === 'favorites') {
      list = list.filter(n => n.isFavorite);
    } else if (filterCategory === 'unlocked') {
      list = list.filter(n => n.unlocked);
    } else if (filterCategory === 'locked') {
      list = list.filter(n => !n.unlocked);
    }

    if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);
    else if (sortBy === 'oldest') list.sort((a, b) => a.id - b.id);
    else if (sortBy === 'favorites') list.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    else if (sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  };

  const getFilteredAndSortedMemories = () => {
    let list = [...memories];
    if (filterCategory === 'favorites') {
      list = list.filter(m => m.isFavorite);
    } else if (filterCategory === 'photo') {
      list = list.filter(m => !m.category || m.category === 'photo');
    } else if (filterCategory === 'doodle') {
      list = list.filter(m => m.category === 'doodle');
    } else if (filterCategory === 'voice') {
      list = list.filter(m => m.category === 'voice');
    }

    if (sortBy === 'newest') list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === 'oldest') list.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === 'favorites') list.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    else if (sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  };

  const filteredLetters = getFilteredAndSortedLetters();
  const filteredMemories = getFilteredAndSortedMemories();

  const cardBg = theme === 'dark' ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-md';
  const insetBg = theme === 'dark' ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200 text-slate-800';
  const subText = theme === 'dark' ? 'text-[#94A3B8]' : 'text-slate-500';

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-5 pb-24">
      {/* TOP SUB-TAB NAVIGATION */}
      <div className="flex items-center justify-between">
        <div className={`flex space-x-2 p-1 rounded-2xl border ${cardBg}`}>
          <button
            onClick={() => { setActiveSubTab('letters'); setFilterCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'letters'
                ? 'bg-[#FF2D55] text-white shadow-md'
                : subText
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Open When Letters
          </button>
          <button
            onClick={() => { setActiveSubTab('memories'); setFilterCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'memories'
                ? 'bg-[#FF2D55] text-white shadow-md'
                : subText
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Shared Memories
          </button>
        </div>

        {activeSubTab === 'letters' ? (
          <button
            onClick={() => setShowCreateNoteModal(true)}
            className="p-2 bg-[#FF2D55] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md hover:bg-rose-600 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Letter
          </button>
        ) : (
          <button
            onClick={() => setShowAddMemoryModal(true)}
            className="p-2 bg-[#FF2D55] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md hover:bg-rose-600 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Memory
          </button>
        )}
      </div>

      {/* COMBINED FILTER & SORT DROPDOWN TOOLBAR */}
      <div className={`border rounded-2xl p-2 flex items-center justify-between text-xs gap-2 shadow-lg ${cardBg}`}>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border flex-1 ${insetBg}`}>
          <Filter className="w-3.5 h-3.5 text-[#FF2D55]" />
          <span className={`text-[10px] uppercase font-bold ${subText}`}>Filter:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer w-full"
          >
            <option value="all">All Items</option>
            <option value="favorites">⭐ Favorites Only</option>
            
            {activeSubTab === 'letters' ? (
              <>
                <option value="unlocked">🔓 Unlocked Only</option>
                <option value="locked">🔒 Locked Only</option>
              </>
            ) : (
              <>
                <option value="photo">📷 Photos Only</option>
                <option value="doodle">🎨 Doodles Only</option>
                <option value="voice">🎙️ Voice Notes Only</option>
              </>
            )}
          </select>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border flex-1 ${insetBg}`}>
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
          <span className={`text-[10px] uppercase font-bold ${subText}`}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer w-full"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="favorites">Favorites First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* ─── TAB 1: OPEN WHEN LETTERS ──────── */}
      {activeSubTab === 'letters' && (
        <div className="space-y-3">
          {filteredLetters.length === 0 ? (
            <div className={`text-center py-10 rounded-2xl border text-xs ${cardBg}`}>
              No letters match your selected filter. 💌
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredLetters.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    if (note.unlocked) {
                      setSelectedNote(note);
                    } else {
                      setLockedModalNote(note);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between h-36 transition-all select-none relative cursor-pointer active:scale-95 shadow-lg ${cardBg}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      note.unlocked ? 'bg-[#FF2D55]/10 border border-[#FF2D55]/30' : 'bg-amber-500/10 border border-amber-500/30'
                    }`}>
                      {note.icon}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleFavoriteNote(e, note.id)}
                        className="p-1 rounded-full text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-current' : 'opacity-40'}`} />
                      </button>
                      {note.unlocked ? (
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                          <Unlock className="w-2.5 h-2.5" /> Read
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold line-clamp-2 leading-snug">{note.title}</h3>
                  </div>

                  <div className={`border-t border-slate-200 dark:border-white/5 pt-1.5 flex items-center justify-between text-[10px] ${subText}`}>
                    <span>From {note.author}</span>
                    <span className="truncate max-w-[60px] text-amber-500 font-medium">
                      {note.unlocked ? note.category : 'Tap Request'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: SHARED MEMORIES GALLERY ───── */}
      {activeSubTab === 'memories' && (
        <div className="space-y-3">
          {filteredMemories.length === 0 ? (
            <div className={`text-center py-10 rounded-2xl border text-xs ${cardBg}`}>
              No memories saved in your Vault yet. 🖼️
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredMemories.map((item) => (
                <div key={item.id} className={`relative group rounded-2xl overflow-hidden border shadow-lg flex flex-col justify-between ${cardBg}`}>
                  <button
                    onClick={(e) => toggleFavoriteMemory(e, item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-amber-400 backdrop-blur-md border border-white/20 active:scale-110 transition-all z-10"
                  >
                    <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : 'opacity-60'}`} />
                  </button>

                  {item.category === 'voice' ? (
                    <div className={`w-full h-40 p-4 flex flex-col items-center justify-center space-y-2 text-center ${insetBg}`}>
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-500">
                        <Mic className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold">Voice Note Clip</span>
                      <button
                        onClick={() => togglePlayVoiceMemory(item.id)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md active:scale-95"
                      >
                        <Play className={`w-3 h-3 fill-current ${playingAudioId === item.id ? 'animate-spin' : ''}`} />
                        {playingAudioId === item.id ? 'Playing...' : 'Listen 🎙️'}
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-40 bg-slate-100 dark:bg-[#0F172A]">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      {item.category === 'doodle' && (
                        <span className="absolute top-2 left-2 bg-[#FF2D55] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <Palette className="w-2.5 h-2.5" /> Doodle
                        </span>
                      )}
                    </div>
                  )}

                  <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-xs font-bold text-white line-clamp-1">{item.title}</span>
                    <span className="text-[10px] text-slate-300 font-mono mt-0.5">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* READ UNLOCKED LETTER MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`border rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto no-scrollbar ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedNote.icon}</span>
                {selectedNote.creatorFeeling && (
                  <span className="text-[10px] font-semibold text-[#FF2D55] bg-[#FF2D55]/10 px-2 py-0.5 rounded-full border border-[#FF2D55]/20">
                    Wrote while feeling {selectedNote.creatorFeeling}
                  </span>
                )}
              </div>
              <button onClick={() => setSelectedNote(null)} className={subText}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-bold">{selectedNote.title}</h3>

            <p className={`text-xs leading-relaxed p-4 rounded-2xl border font-serif italic ${insetBg}`}>
              "{selectedNote.content}"
            </p>

            {(selectedNote.attachmentType && selectedNote.attachmentType !== 'none') || selectedNote.hugIntensity || selectedNote.kissIntensity || selectedNote.heartbeatBeats ? (
              <div className={`p-3 rounded-2xl border border-[#FF2D55]/30 space-y-3 relative overflow-hidden ${insetBg}`}>
                <div className="text-[10px] uppercase font-bold text-[#FF2D55] tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Attached Media Experience</span>
                  <span className="text-emerald-500 animate-pulse font-mono">Playing</span>
                </div>

                {(selectedNote.attachmentType === 'hug' || selectedNote.hugIntensity) && (
                  <div className="p-3 rounded-xl border border-amber-500/30 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl animate-bounce">🫂</span>
                      <div>
                        <div className="text-xs font-bold text-amber-500">
                          {(selectedNote.attachmentData && selectedNote.attachmentData.label) || selectedNote.hugIntensity || 'Warm Hug (1.5s)'}
                        </div>
                        <div className={`text-[10px] ${subText}`}>Holding you warm across distance</div>
                      </div>
                    </div>
                    <span className="text-xs text-amber-500 font-bold animate-ping">🤗</span>
                  </div>
                )}

                {(selectedNote.attachmentType === 'kiss' || selectedNote.kissIntensity) && (
                  <div className="p-3 rounded-xl border border-pink-500/30 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl animate-bounce">💋</span>
                      <div>
                        <div className="text-xs font-bold text-pink-500">
                          {(selectedNote.attachmentData && selectedNote.attachmentData.label) || selectedNote.kissIntensity || 'Sweet Kiss (1.5s)'}
                        </div>
                        <div className={`text-[10px] ${subText}`}>Sending sweet peck to your lips</div>
                      </div>
                    </div>
                    <span className="text-xs text-pink-500 font-bold animate-ping">💕</span>
                  </div>
                )}

                {(selectedNote.attachmentType === 'heartbeat' || selectedNote.heartbeatBeats) && (
                  <div className="p-3 rounded-xl border border-rose-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-rose-500 font-semibold">
                      <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-[#FF2D55]" /> Recorded Pulse Wave</span>
                      <span className="font-mono text-emerald-500">Syncing</span>
                    </div>
                    <div className={`h-10 w-full rounded-lg overflow-hidden border flex items-center ${insetBg}`}>
                      <canvas ref={playbackCanvasRef} width={280} height={40} className="w-full h-full block" />
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="text-right text-xs text-[#FF2D55] font-bold font-serif pt-1">
              {selectedNote.customSignoff || `With all my love, ${selectedNote.author} 💕`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
