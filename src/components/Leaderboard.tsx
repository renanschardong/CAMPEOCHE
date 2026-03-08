import React, { useState, useEffect } from 'react';
import { ShieldAlert, Star } from 'lucide-react';

interface Stats {
  id: number;
  name: string;
  position: 'Linha' | 'Goleiro';
  total_goals: number;
  total_yellow_cards: number;
  total_goals_conceded: number;
  total_points: number;
  total_wins: number;
  total_draws: number;
  total_losses: number;
  total_red_cards: number;
  total_extra_points: number;
  total_lost_points: number;
  matches_played: number;
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  r5: number;
  r6: number;
  r7: number;
  r8: number;
  r9: number;
}

const TableHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <th className={`px-1 py-1 md:px-2 md:py-1.5 text-blue-300 font-bold uppercase text-[10px] md:text-xs tracking-wider border-b border-blue-900/50 ${className}`}>
    {children}
  </th>
);

const TableRow: React.FC<{ children: React.ReactNode; index: number; position: number; isLinha: boolean }> = ({ children, index, position, isLinha }) => {
  let bgColor = index % 2 === 0 ? 'bg-blue-900/10' : 'bg-transparent';
  
  if (isLinha) {
    if (position <= 20) {
      bgColor = index % 2 === 0 ? 'bg-blue-800/30' : 'bg-blue-800/20';
    } else if (position <= 40) {
      bgColor = index % 2 === 0 ? 'bg-blue-400/20' : 'bg-blue-400/10';
    }
  }

  return (
    <tr className={`border-b border-blue-900/30 transition-colors ${bgColor} hover:bg-blue-800/30`}>
      {children}
    </tr>
  );
};

export function Leaderboard() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats/leaderboard');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort for General Classification (Points DESC)
  const classificationLinha = Array.isArray(stats) 
    ? [...stats]
        .filter(p => p.position === 'Linha')
        .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
    : [];

  const classificationGoleiros = Array.isArray(stats)
    ? [...stats]
        .filter(p => p.position === 'Goleiro')
        .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
    : [];

  if (loading) return <div className="text-center py-12 text-blue-200">Carregando estatísticas...</div>;

  return (
    <div className="space-y-6">
      {/* Classification Linha */}
      <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
        <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-4 py-2.5 border-b border-blue-800 flex items-center gap-3">
          <div className="bg-blue-600 p-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            <Star size={14} className="text-white" fill="currentColor" />
          </div>
          <h3 className="font-black text-xs md:text-base uppercase tracking-widest text-white">Classificação - Linha</h3>
          <div className="ml-auto flex gap-3 text-[9px] uppercase font-bold tracking-tighter">
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-blue-700 rounded"></div> Final</div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-blue-400 rounded"></div> 3°/4°</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0e1e5b]">
              <tr>
                <TableHeader>#</TableHeader>
                <TableHeader>Atleta</TableHeader>
                <TableHeader className="text-center">Total</TableHeader>
                <TableHeader className="text-center">Jogos</TableHeader>
                <TableHeader className="text-center">Gols</TableHeader>
                <TableHeader className="text-center">1°</TableHeader>
                <TableHeader className="text-center">2°</TableHeader>
                <TableHeader className="text-center">3°</TableHeader>
                <TableHeader className="text-center">4°</TableHeader>
                <TableHeader className="text-center">5°</TableHeader>
                <TableHeader className="text-center">6°</TableHeader>
                <TableHeader className="text-center">7°</TableHeader>
                <TableHeader className="text-center">8°</TableHeader>
                <TableHeader className="text-center bg-blue-600/20">9°</TableHeader>
                <TableHeader className="text-center bg-blue-900/40">V</TableHeader>
                <TableHeader className="text-center bg-blue-900/40">E</TableHeader>
                <TableHeader className="text-center bg-blue-900/40">D</TableHeader>
                <TableHeader className="text-center bg-yellow-900/20 text-yellow-200">AM</TableHeader>
                <TableHeader className="text-center bg-red-900/20 text-red-200">VE</TableHeader>
                <TableHeader className="text-center bg-emerald-900/20 text-emerald-200">PE</TableHeader>
                <TableHeader className="text-center bg-rose-900/20 text-rose-200">PP</TableHeader>
              </tr>
            </thead>
            <tbody>
              {classificationLinha.map((player, index) => (
                <TableRow key={player.id} index={index} position={index + 1} isLinha={true}>
                  <td className={`w-8 px-1 py-0.5 md:py-1 font-mono font-bold text-[10px] md:text-sm ${
                    index + 1 <= 20 ? 'text-blue-300' : index + 1 <= 40 ? 'text-blue-200' : 'text-blue-400'
                  }`}>{index + 1}</td>
                  <td className="px-1 py-0.5 md:py-1">
                    <div className="font-bold text-white text-[10px] md:text-base whitespace-nowrap">{player.name}</div>
                  </td>
                  <td className="px-1 py-0.5 md:py-1 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-4 md:w-10 md:h-6 font-black rounded shadow-lg text-[9px] md:text-sm ${
                      index + 1 <= 20 ? 'bg-blue-700 text-white' : index + 1 <= 40 ? 'bg-blue-400 text-[#000435]' : 'bg-white text-[#000435]'
                    }`}>
                      {player.total_points || 0}
                    </span>
                  </td>
                  <td className="px-1 py-0.5 md:py-1 text-center text-blue-300 text-[10px] md:text-sm">{player.matches_played}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300 text-[10px] md:text-sm">{player.total_goals}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r1 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r2 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r3 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r4 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r5 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r6 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r7 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r8 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-200 font-bold bg-blue-600/10 text-[9px] md:text-xs">{player.r9 || '-'}</td>
                  
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-green-400 bg-blue-900/20 text-[9px] md:text-sm">{player.total_wins || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-gray-400 bg-blue-900/20 text-[9px] md:text-sm">{player.total_draws || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-red-400 bg-blue-900/20 text-[9px] md:text-sm">{player.total_losses || 0}</td>
                  
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-yellow-400 bg-yellow-900/10 text-[9px] md:text-sm">{player.total_yellow_cards || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-red-500 bg-red-900/10 text-[9px] md:text-sm">{player.total_red_cards || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-emerald-400 bg-emerald-900/10 text-[9px] md:text-sm">{player.total_extra_points || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-rose-400 bg-rose-900/10 text-[9px] md:text-sm">{player.total_lost_points || 0}</td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classification Goleiros */}
      <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
        <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-4 py-2.5 border-b border-blue-800 flex items-center gap-3">
          <div className="bg-cyan-600 p-1 rounded-full shadow-[0_0_10px_rgba(8,145,178,0.5)]">
            <ShieldAlert size={14} className="text-white" />
          </div>
          <h3 className="font-black text-xs md:text-base uppercase tracking-widest text-white">Classificação - Goleiros</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0e1e5b]">
              <tr>
                <TableHeader>#</TableHeader>
                <TableHeader>Atleta</TableHeader>
                <TableHeader className="text-center">Total</TableHeader>
                <TableHeader className="text-center">Jogos</TableHeader>
                <TableHeader className="text-center">Gols Sofridos</TableHeader>
                <TableHeader className="text-center">1°</TableHeader>
                <TableHeader className="text-center">2°</TableHeader>
                <TableHeader className="text-center">3°</TableHeader>
                <TableHeader className="text-center">4°</TableHeader>
                <TableHeader className="text-center">5°</TableHeader>
                <TableHeader className="text-center">6°</TableHeader>
                <TableHeader className="text-center">7°</TableHeader>
                <TableHeader className="text-center">8°</TableHeader>
                <TableHeader className="text-center bg-blue-600/20">9°</TableHeader>
                <TableHeader className="text-center bg-blue-900/40">V</TableHeader>
                <TableHeader className="text-center bg-blue-900/40">E</TableHeader>
                <TableHeader className="text-center bg-blue-900/40">D</TableHeader>
                <TableHeader className="text-center bg-yellow-900/20 text-yellow-200">AM</TableHeader>
                <TableHeader className="text-center bg-red-900/20 text-red-200">VE</TableHeader>
                <TableHeader className="text-center bg-emerald-900/20 text-emerald-200">PE</TableHeader>
                <TableHeader className="text-center bg-rose-900/20 text-rose-200">PP</TableHeader>
              </tr>
            </thead>
            <tbody>
              {classificationGoleiros.map((player, index) => (
                <TableRow key={player.id} index={index} position={index + 1} isLinha={false}>
                  <td className="w-8 px-1 py-0.5 md:py-1 font-mono text-blue-400 font-bold text-[10px] md:text-sm">{index + 1}</td>
                  <td className="px-1 py-0.5 md:py-1">
                    <div className="font-bold text-white text-[10px] md:text-base whitespace-nowrap">{player.name}</div>
                  </td>
                  <td className="px-1 py-0.5 md:py-1 text-center">
                    <span className="inline-block px-1.5 py-0.5 md:px-2 md:py-1 bg-white text-[#000435] font-black rounded shadow-[0_0_10px_rgba(255,255,255,0.3)] text-[9px] md:text-sm">
                      {player.total_points || 0}
                    </span>
                  </td>
                  <td className="px-1 py-0.5 md:py-1 text-center text-blue-300 text-[10px] md:text-sm">{player.matches_played}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300 text-[10px] md:text-sm">{player.total_goals_conceded}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r1 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r2 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r3 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r4 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r5 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r6 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r7 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-300/70 text-[9px] md:text-xs">{player.r8 || '-'}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center text-blue-200 font-bold bg-blue-600/10 text-[9px] md:text-xs">{player.r9 || '-'}</td>
                  
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-green-400 bg-blue-900/20 text-[9px] md:text-sm">{player.total_wins || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-gray-400 bg-blue-900/20 text-[9px] md:text-sm">{player.total_draws || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-red-400 bg-blue-900/20 text-[9px] md:text-sm">{player.total_losses || 0}</td>
                  
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-yellow-400 bg-yellow-900/10 text-[9px] md:text-sm">{player.total_yellow_cards || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-red-500 bg-red-900/10 text-[9px] md:text-sm">{player.total_red_cards || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-emerald-400 bg-emerald-900/10 text-[9px] md:text-sm">{player.total_extra_points || 0}</td>
                  <td className="px-0.5 py-0.5 md:py-1 text-center font-bold text-rose-400 bg-rose-900/10 text-[9px] md:text-sm">{player.total_lost_points || 0}</td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
