import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';

interface Stats {
  id: number;
  name: string;
  position: 'Linha' | 'Goleiro';
  total_points: number;
  total_goals: number;
  total_yellow_cards: number;
  total_red_cards: number;
  total_extra_points: number;
  total_lost_points: number;
  total_goals_conceded: number;
}

const TableHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <th className={`px-1 py-1 md:px-2 md:py-1.5 text-blue-300 font-bold uppercase text-[10px] md:text-xs tracking-wider border-b border-blue-900/50 ${className}`}>
    {children}
  </th>
);

const TableRow: React.FC<{ children: React.ReactNode; index: number; type: 'final' | 'third' }> = ({ children, index, type }) => (
  <tr className={`border-b border-blue-900/30 transition-colors ${
    type === 'final' 
      ? (index % 2 === 0 ? 'bg-blue-800/20' : 'bg-blue-800/10') 
      : (index % 2 === 0 ? 'bg-blue-400/10' : 'bg-blue-400/5')
  } hover:bg-blue-800/30`}>
    {children}
  </tr>
);

export function Playoffs() {
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

  // Only Linha players for playoffs classification usually, but I'll filter by position if needed.
  // Assuming the user wants the top 40 overall or top 40 Linha. Usually it's Linha.
  const sortedPlayers = [...stats]
    .filter(p => p.position === 'Linha')
    .sort((a, b) => (b.total_points || 0) - (a.total_points || 0));

  const sortedGoleiros = [...stats]
    .filter(p => p.position === 'Goleiro')
    .sort((a, b) => (b.total_points || 0) - (a.total_points || 0));

  const grandeFinal = sortedPlayers.slice(0, 20);
  const terceiroQuarto = sortedPlayers.slice(20, 40);
  const goleirosClassificados = sortedGoleiros.slice(0, 4);

  if (loading) return <div className="text-center py-12 text-blue-200">Carregando playoffs...</div>;

  return (
    <div className="space-y-8">
      {/* Grande Final */}
      <div className="bg-[#000435] rounded-xl shadow-[0_0_40px_rgba(30,64,175,0.2)] border border-blue-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#000435] via-blue-900/30 to-[#000435] px-4 py-3 md:px-6 md:py-5 border-b border-blue-700/50 flex items-center gap-3 md:gap-4">
            <div className="bg-blue-700 p-1.5 md:p-2 rounded-full shadow-[0_0_20px_rgba(29,78,216,0.5)] animate-pulse">
              <Trophy size={18} className="text-white md:w-6 md:h-6" fill="currentColor" />
            </div>
            <div>
              <h3 className="font-black text-lg md:text-2xl uppercase tracking-[0.2em] text-blue-400">Grande Final</h3>
              <p className="text-blue-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">Posições 1° ao 20°</p>
            </div>
          </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-900/20">
              <tr>
                <TableHeader className="w-16">Pos</TableHeader>
                <TableHeader>Atleta</TableHeader>
                <TableHeader className="text-center">Pontos</TableHeader>
                <TableHeader className="text-center">Gols</TableHeader>
                <TableHeader className="text-center">AM</TableHeader>
                <TableHeader className="text-center">VE</TableHeader>
                <TableHeader className="text-center">PE</TableHeader>
                <TableHeader className="text-center">PP</TableHeader>
                <TableHeader className="text-right pr-6">Status</TableHeader>
              </tr>
            </thead>
            <tbody>
              {grandeFinal.map((player, index) => (
                <TableRow key={player.id} index={index} type="final">
                  <td className="px-2 py-1 md:px-3 md:py-1.5 font-mono text-blue-500 font-black text-sm md:text-lg">{index + 1}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5">
                    <div className="font-black text-white text-xs md:text-xl uppercase italic tracking-wider whitespace-nowrap">{player.name}</div>
                  </td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-5 md:w-12 md:h-8 bg-blue-700 text-white font-black rounded shadow-lg text-[10px] md:text-lg">
                      {player.total_points}
                    </span>
                  </td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-blue-300 font-bold text-[10px] md:text-base">{player.total_goals}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-yellow-400 font-bold text-[10px] md:text-base">{player.total_yellow_cards}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-red-500 font-bold text-[10px] md:text-base">{player.total_red_cards}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-emerald-400 font-bold text-[10px] md:text-base">{player.total_extra_points}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-rose-400 font-bold text-[10px] md:text-base">{player.total_lost_points}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-right pr-4 md:pr-6">
                    <div className="flex items-center justify-end gap-1 text-blue-500 font-bold text-[9px] md:text-xs uppercase tracking-tighter">
                      <Star size={10} className="md:w-3.5 md:h-3.5" fill="currentColor" />
                      <span className="hidden sm:inline">Classificado</span>
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terceiro e Quarto */}
      <div className="bg-[#000435] rounded-xl shadow-[0_0_40px_rgba(96,165,250,0.2)] border border-blue-400/50 overflow-hidden">
        <div className="bg-gradient-to-r from-[#000435] via-blue-400/10 to-[#000435] px-4 py-3 md:px-6 md:py-5 border-b border-blue-400/50 flex items-center gap-3 md:gap-4">
          <div className="bg-blue-400 p-1.5 md:p-2 rounded-full shadow-[0_0_20px_rgba(96,165,250,0.5)]">
            <Medal size={18} className="text-[#000435] md:w-6 md:h-6" fill="currentColor" />
          </div>
          <div>
            <h3 className="font-black text-lg md:text-2xl uppercase tracking-[0.2em] text-blue-300">Disputa 3° e 4° Lugar</h3>
            <p className="text-blue-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Posições 21° ao 40°</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-400/10">
              <tr>
                <TableHeader className="w-16">Pos</TableHeader>
                <TableHeader>Atleta</TableHeader>
                <TableHeader className="text-center">Pontos</TableHeader>
                <TableHeader className="text-center">Gols</TableHeader>
                <TableHeader className="text-center">AM</TableHeader>
                <TableHeader className="text-center">VE</TableHeader>
                <TableHeader className="text-center">PE</TableHeader>
                <TableHeader className="text-center">PP</TableHeader>
                <TableHeader className="text-right pr-6">Status</TableHeader>
              </tr>
            </thead>
            <tbody>
              {terceiroQuarto.map((player, index) => (
                <TableRow key={player.id} index={index} type="third">
                  <td className="px-2 py-1 md:px-3 md:py-1.5 font-mono text-blue-400 font-black text-sm md:text-lg">{index + 21}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5">
                    <div className="font-black text-white text-xs md:text-xl uppercase italic tracking-wider whitespace-nowrap">{player.name}</div>
                  </td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-5 md:w-12 md:h-8 bg-blue-400 text-[#000435] font-black rounded shadow-lg text-[10px] md:text-lg">
                      {player.total_points}
                    </span>
                  </td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-blue-300 font-bold text-[10px] md:text-base">{player.total_goals}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-yellow-400 font-bold text-[10px] md:text-base">{player.total_yellow_cards}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-red-500 font-bold text-[10px] md:text-base">{player.total_red_cards}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-emerald-400 font-bold text-[10px] md:text-base">{player.total_extra_points}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-rose-400 font-bold text-[10px] md:text-base">{player.total_lost_points}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-right pr-4 md:pr-6">
                    <div className="flex items-center justify-end gap-1 text-blue-400 font-bold text-[9px] md:text-xs uppercase tracking-tighter">
                      <Star size={10} className="md:w-3.5 md:h-3.5" fill="currentColor" />
                      <span className="hidden sm:inline">Classificado</span>
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goleiros Classificados */}
      <div className="bg-[#000435] rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/50 overflow-hidden">
        <div className="bg-gradient-to-r from-[#000435] via-emerald-900/20 to-[#000435] px-4 py-3 md:px-6 md:py-5 border-b border-emerald-500/50 flex items-center gap-3 md:gap-4">
          <div className="bg-emerald-600 p-1.5 md:p-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <Star size={18} className="text-white md:w-6 md:h-6" fill="currentColor" />
          </div>
          <div>
            <h3 className="font-black text-lg md:text-2xl uppercase tracking-[0.2em] text-emerald-400">Goleiros Classificados</h3>
            <p className="text-emerald-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">Top 4 Goleiros</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-900/20">
              <tr>
                <TableHeader className="w-16">Pos</TableHeader>
                <TableHeader>Atleta</TableHeader>
                <TableHeader className="text-center">Pontos</TableHeader>
                <TableHeader className="text-center">Gols</TableHeader>
                <TableHeader className="text-center">GS</TableHeader>
                <TableHeader className="text-center">AM</TableHeader>
                <TableHeader className="text-center">VE</TableHeader>
                <TableHeader className="text-center">PE</TableHeader>
                <TableHeader className="text-center">PP</TableHeader>
                <TableHeader className="text-right pr-6">Status</TableHeader>
              </tr>
            </thead>
            <tbody>
              {goleirosClassificados.map((player, index) => (
                <TableRow key={player.id} index={index} type="final">
                  <td className="px-2 py-1 md:px-3 md:py-1.5 font-mono text-emerald-500 font-black text-sm md:text-lg">{index + 1}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5">
                    <div className="font-black text-white text-xs md:text-xl uppercase italic tracking-wider whitespace-nowrap">{player.name}</div>
                  </td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-5 md:w-12 md:h-8 bg-emerald-600 text-white font-black rounded shadow-lg text-[10px] md:text-lg">
                      {player.total_points}
                    </span>
                  </td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-blue-300 font-bold text-[10px] md:text-base">{player.total_goals}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-orange-400 font-bold text-[10px] md:text-base">{player.total_goals_conceded}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-yellow-400 font-bold text-[10px] md:text-base">{player.total_yellow_cards}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-red-500 font-bold text-[10px] md:text-base">{player.total_red_cards}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-emerald-400 font-bold text-[10px] md:text-base">{player.total_extra_points}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-center text-rose-400 font-bold text-[10px] md:text-base">{player.total_lost_points}</td>
                  <td className="px-1 py-1 md:px-1 md:py-1.5 text-right pr-4 md:pr-6">
                    <div className="flex items-center justify-end gap-1 text-emerald-500 font-bold text-[9px] md:text-xs uppercase tracking-tighter">
                      <Star size={10} className="md:w-3.5 md:h-3.5" fill="currentColor" />
                      <span className="hidden sm:inline">Classificado</span>
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
