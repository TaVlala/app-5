import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import AffectionHub from './components/AffectionHub.jsx';
import CreativeStudio from './components/CreativeStudio.jsx';
import OpenWhenVault from './components/OpenWhenVault.jsx';
import SharedHub from './components/SharedHub.jsx';
import CalendarPage from './components/CalendarPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import BottomNav from './components/BottomNav.jsx';
import PulsingNotification from './components/PulsingNotification.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [studioSubTab, setStudioSubTab] = useState('doodle');
  const [theme, setTheme] = useState('dark');
  const [partnerStatus, setPartnerStatus] = useState('Thinking of you');
  const [currentMood, setCurrentMood] = useState('Just Chilling / Normal ☁️');
  const [incomingNotification, setIncomingNotification] = useState(null);

  // Profile State
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('together_couple_profile');
      return saved ? JSON.parse(saved) : {
        milestones: [
          { id: 1, type: 'First Met', title: 'The Day We Met 💖', date: '2023-02-14' },
          { id: 2, type: 'Engagement', title: 'Engagement Anniversary 💍', date: '2024-07-20' },
          { id: 3, type: 'Marriage', title: 'Wedding Anniversary 💒', date: '2025-06-12' }
        ]
      };
    } catch {
      return {
        milestones: [
          { id: 1, type: 'First Met', title: 'The Day We Met 💖', date: '2023-02-14' },
          { id: 2, type: 'Engagement', title: 'Engagement Anniversary 💍', date: '2024-07-20' },
          { id: 3, type: 'Marriage', title: 'Wedding Anniversary 💒', date: '2025-06-12' }
        ]
      };
    }
  });

  const handleSaveProfile = (newProfile) => {
    setProfileData(newProfile);
    localStorage.setItem('together_couple_profile', JSON.stringify(newProfile));
  };

  // Handle Mood Update & Trigger Automatic Vault Unlocks
  const handleUpdateMood = (newMood) => {
    setCurrentMood(newMood);

    try {
      const savedLettersStr = localStorage.getItem('together_vault_letters');
      if (savedLettersStr) {
        const letters = JSON.parse(savedLettersStr);
        let unlockedAny = false;
        let unlockedTitle = '';

        const updatedLetters = letters.map(letter => {
          if (!letter.unlocked && letter.unlockMood && letter.unlockMood.toLowerCase().trim() === newMood.toLowerCase().trim()) {
            unlockedAny = true;
            unlockedTitle = letter.title;
            return { ...letter, unlocked: true };
          }
          return letter;
        });

        if (unlockedAny) {
          localStorage.setItem('together_vault_letters', JSON.stringify(updatedLetters));
          
          setIncomingNotification({
            title: `🔓 Open When Letter Unlocked!`,
            body: `"${unlockedTitle}" has unlocked because your mood matched (${newMood})!`
          });

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🔓 Open When Letter Unlocked!`, {
              body: `"${unlockedTitle}" has unlocked because your mood matched (${newMood})!`,
              icon: '/favicon.ico'
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Activity Feed
  const [activityList, setActivityList] = useState([
    {
      id: 1,
      type: 'hug',
      intensity: 'Alex sent you a Warm Hug',
      from: 'Alex',
      timestamp: '9:30 PM',
      icon: '🫂',
      expirationHours: 24,
      expiresAt: Date.now() + 24 * 3600 * 1000
    },
    {
      id: 2,
      type: 'heartbeat',
      intensity: 'Heartbeat synced live',
      from: 'Alex',
      timestamp: '8:45 PM',
      icon: '💓',
      expirationHours: 24,
      expiresAt: Date.now() + 24 * 3600 * 1000
    },
    {
      id: 3,
      type: 'voice',
      intensity: 'Alex sent a voice clip',
      from: 'Alex',
      timestamp: '7:12 PM',
      icon: '🎙️',
      expirationHours: 24,
      expiresAt: Date.now() + 24 * 3600 * 1000
    },
    {
      id: 4,
      type: 'vault',
      intensity: 'You unlocked Open When: Missing You',
      from: 'System',
      timestamp: 'Yesterday',
      icon: '💌',
      expirationHours: 24,
      expiresAt: Date.now() + 24 * 3600 * 1000
    }
  ]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const handleSendAffection = (newActivity) => {
    setActivityList((prev) => [newActivity, ...prev]);

    setTimeout(() => {
      const simulatedResponses = [
        { type: 'heartbeat', title: '💓 Live Heartbeat from Alex!', body: 'Alex is tapping their heart for you right now...', icon: '💓' },
        { type: 'hug', title: '🫂 Alex sent a Warm Hug!', body: 'Feeling close to you across 1,240 km...', icon: '🫂' },
        { type: 'kiss', title: '💋 Alex sent a Sweet Kiss!', body: 'Alex sent a quick peck back...', icon: '💋' },
      ];
      const randomRes = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      
      setIncomingNotification({
        title: randomRes.title,
        body: randomRes.body
      });

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(randomRes.title, {
          body: randomRes.body,
          icon: '/favicon.ico'
        });
      }

      setActivityList((prev) => [
        {
          id: Date.now(),
          type: randomRes.type,
          intensity: randomRes.title,
          from: 'Alex',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: randomRes.icon,
          expirationHours: 24,
          expiresAt: Date.now() + 24 * 3600 * 1000
        },
        ...prev
      ]);
      setPartnerStatus('Thinking of you 💕');
    }, 3000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0F172A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Pulsing Incoming Heartbeat Notification Banner */}
      <PulsingNotification
        notification={incomingNotification}
        onClose={() => setIncomingNotification(null)}
        onOpenHeartbeat={() => setActiveTab('vault')}
        theme={theme}
      />

      {/* Header Bar */}
      <Header 
        partnerStatus={partnerStatus}
        onSendQuickReaction={(reaction) => handleSendAffection({
          id: Date.now(),
          type: 'moment',
          intensity: reaction,
          from: 'You',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: reaction.slice(-2),
          expirationHours: 24,
          expiresAt: Date.now() + 24 * 3600 * 1000
        })}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenProfile={() => setActiveTab('profile')}
        milestones={profileData?.milestones || []}
        currentMood={currentMood}
        onUpdateMood={handleUpdateMood}
      />

      {/* Main Content Router */}
      <main className="max-w-md mx-auto">
        {activeTab === 'home' && (
          <AffectionHub 
            onSendAffection={handleSendAffection}
            theme={theme}
          />
        )}

        {activeTab === 'studio' && (
          <CreativeStudio 
            subTab={studioSubTab}
            setSubTab={setStudioSubTab}
            onSendStudioContent={handleSendAffection}
            theme={theme}
          />
        )}

        {activeTab === 'vault' && (
          <OpenWhenVault 
            currentMood={currentMood}
            onSendNote={(note) => handleSendAffection({
              id: Date.now(),
              type: 'vault',
              intensity: `Created new letter: ${note.title}`,
              from: 'You',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              icon: '💌',
              expirationHours: 24,
              expiresAt: Date.now() + 24 * 3600 * 1000
            })}
            theme={theme}
          />
        )}

        {activeTab === 'shared' && (
          <SharedHub activityList={activityList} theme={theme} />
        )}

        {activeTab === 'calendar' && (
          <CalendarPage milestones={profileData?.milestones || []} theme={theme} />
        )}

        {activeTab === 'profile' && (
          <ProfilePage 
            profileData={profileData}
            onSaveProfile={handleSaveProfile}
            onClose={() => setActiveTab('home')}
            theme={theme}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
    </div>
  );
}
