import React from 'react';
import { Star, LogIn, LogOut } from 'lucide-react';

export function Layout({ 
  children, 
  activeTab, 
  onTabChange, 
  isLoggedIn, 
  onLogout, 
  onOpenLogin,
  championshipName = 'CAMPEOCHE - 2026'
}: { 
  children: React.ReactNode, 
  activeTab: string, 
  onTabChange: (tab: string) => void,
  isLoggedIn: boolean,
  onLogout: () => void,
  onOpenLogin: () => void,
  championshipName?: string
}) {
  const publicTabs = [
    { id: 'dashboard', label: 'Classificação' },
    { id: 'playoffs', label: 'Playoffs' },
    { id: 'statistics', label: 'Estatísticas' },
  ];

  const privateTabs = [
    { id: 'players', label: 'Atletas' },
    { id: 'rounds', label: 'Rodadas' },
    { id: 'settings', label: 'Configurações' }
  ];

  const visibleTabs = isLoggedIn ? [...publicTabs, ...privateTabs] : publicTabs;

  return (
    <div className="min-h-screen bg-[#0e1e5b] text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Champions League Header */}
      <header className="relative overflow-hidden bg-[#000435] border-b border-blue-900 shadow-2xl">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
           {/* Radial gradient for the center glow */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#000435] to-[#000435]"></div>
           
           {/* "Shattered glass" lines using linear gradients */}
           <div className="absolute inset-0 opacity-30" style={{
             backgroundImage: `
               linear-gradient(45deg, transparent 45%, rgba(0,255,255,0.1) 49%, rgba(0,255,255,0.2) 50%, rgba(0,255,255,0.1) 51%, transparent 55%),
               linear-gradient(-45deg, transparent 45%, rgba(147,51,234,0.1) 49%, rgba(147,51,234,0.2) 50%, rgba(147,51,234,0.1) 51%, transparent 55%)
             `,
             backgroundSize: '100% 100%'
           }}></div>

           <div className="absolute top-[-50px] right-[-50px] text-white/5 transform rotate-12">
             <Star size={300} fill="currentColor" />
           </div>
           <div className="absolute bottom-[-20px] left-[10%] text-white/5 transform -rotate-12">
             <Star size={100} fill="currentColor" />
           </div>
        </div>

        {/* Login/Logout Button */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50">
          {isLoggedIn ? (
            <button 
              onClick={onLogout}
              className="flex items-center gap-1 md:gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 px-2.5 py-1 md:px-4 md:py-2 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest transition-all hover:scale-105"
            >
              <LogOut size={12} className="md:w-[14px] md:h-[14px]" /> Sair
            </button>
          ) : (
            <button 
              onClick={onOpenLogin}
              className="flex items-center gap-1 md:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 md:px-4 md:py-2 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest transition-all hover:scale-105 backdrop-blur-sm"
            >
              <LogIn size={12} className="md:w-[14px] md:h-[14px]" /> Entrar
            </button>
          )}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-4 md:py-6 flex flex-col items-center text-center">
          <div className="mb-1 flex items-center justify-center gap-2 md:gap-3">
             <div className="bg-white rounded-full p-1 md:p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
               <Star size={14} className="text-[#0e1e5b] md:w-5 md:h-5" fill="currentColor" />
             </div>
             <h1 className="text-xl sm:text-2xl md:text-5xl font-black tracking-widest uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
               {championshipName}
             </h1>
             <div className="bg-white rounded-full p-1 md:p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)]">
               <Star size={14} className="text-[#0e1e5b] md:w-5 md:h-5" fill="currentColor" />
             </div>
          </div>
          <p className="text-blue-200 text-[9px] md:text-base font-bold tracking-[0.2em] uppercase bg-blue-900/30 px-3 md:px-5 py-0.5 rounded-full border border-blue-500/30 backdrop-blur-sm">
            BANCÁRIO-LIVRE
          </p>
        </div>

        {/* Navigation */}
        <nav className="relative max-w-4xl mx-auto px-2 md:px-4 mt-1 md:mt-4 overflow-x-auto no-scrollbar">
          <div className="flex justify-center space-x-1 pb-2 md:pb-0 min-w-max md:min-w-0">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-2.5 md:px-3 py-1.5 md:py-2.5 font-black text-[10px] md:text-xs lg:text-sm uppercase tracking-widest transition-all duration-300 clip-path-slant whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#000435] bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] transform -translate-y-0.5 z-10'
                    : 'text-blue-300 hover:text-white hover:bg-white/10'
                }`}
                style={{
                  clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
      
      {/* Footer / Branding */}
      <footer className="py-8 text-center text-blue-400 text-xs uppercase tracking-widest opacity-50">
        {championshipName} Dados Oficiais
      </footer>
    </div>
  );
}
