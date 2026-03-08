import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PlayerList } from './components/PlayerList';
import { RoundManager } from './components/RoundManager';
import { Leaderboard } from './components/Leaderboard';
import { Statistics } from './components/Statistics';
import { Playoffs } from './components/Playoffs';
import { Settings } from './components/Settings';
import { LoginModal } from './components/LoginModal';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [championshipName, setChampionshipName] = useState('CAMPEOCHE - 2026');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.championship_name) {
          setChampionshipName(data.championship_name);
          document.title = data.championship_name;
        }
      })
      .catch(err => console.error('Failed to fetch settings', err));
  }, []);

  const moderators = [
    { user: 'MODERADOR 01', pass: 'MODERADOR#0102' },
    { user: 'MODERADOR 02', pass: 'MODERADOR#0203' },
    { user: 'MODERADOR 03', pass: 'MODERADOR#0304' },
  ];

  const handleLogin = (user: string, pass: string) => {
    const found = moderators.find(m => m.user === user.toUpperCase() && m.pass === pass);
    if (found) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (['players', 'rounds', 'settings'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        championshipName={championshipName}
      >
        {activeTab === 'dashboard' && <Leaderboard />}
        {activeTab === 'playoffs' && <Playoffs />}
        {activeTab === 'statistics' && <Statistics />}
        {activeTab === 'players' && <PlayerList />}
        {activeTab === 'rounds' && <RoundManager />}
        {activeTab === 'settings' && <Settings onSettingsUpdate={() => {
          fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
              if (data && data.championship_name) {
                setChampionshipName(data.championship_name);
                document.title = data.championship_name;
              }
            });
        }} />}
      </Layout>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <MusicPlayer />
    </>
  );
}

