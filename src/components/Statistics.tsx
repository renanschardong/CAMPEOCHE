import React, { useState, useEffect } from 'react';
import { Trophy, ShieldAlert, Medal, Star, AlertTriangle } from 'lucide-react';

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
}

const TableHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <th className={`px-2 py-2 md:px-4 md:py-3 text-blue-300 font-bold uppercase text-[10px] md:text-xs tracking-wider border-b border-blue-900/50 ${className}`}>
    {children}
  </th>
);

const TableRow: React.FC<{ children: React.ReactNode; index: number }> = ({ children, index }) => (
  <tr className={`border-b border-blue-900/30 transition-colors ${index % 2 === 0 ? 'bg-blue-900/10' : 'bg-transparent'} hover:bg-blue-800/30`}>
    {children}
  </tr>
);

export function Statistics() {
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

  // Sort for Artilheiros (Goals DESC)
  const artilheiros = Array.isArray(stats)
    ? [...stats]
        .sort((a, b) => (b.total_goals || 0) - (a.total_goals || 0))
        .filter(p => (p.total_goals || 0) > 0)
    : [];

  // Sort for Goleiros (Goals Conceded ASC)
  const goleirosMenosVazados = Array.isArray(stats)
    ? [...stats]
        .filter(p => p.position === 'Goleiro')
        .sort((a, b) => (a.total_goals_conceded || 0) - (b.total_goals_conceded || 0))
    : [];

  // Sort for Yellow Cards
  const yellowCards = Array.isArray(stats)
    ? [...stats]
        .filter(p => (p.total_yellow_cards || 0) > 0)
        .sort((a, b) => (b.total_yellow_cards || 0) - (a.total_yellow_cards || 0))
    : [];

  // Sort for Red Cards
  const redCards = Array.isArray(stats)
    ? [...stats]
        .filter(p => (p.total_red_cards || 0) > 0)
        .sort((a, b) => (b.total_red_cards || 0) - (a.total_red_cards || 0))
    : [];

  if (loading) return <div className="text-center py-12 text-blue-200">Carregando estatísticas...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artilheiros */}
        <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
          <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-4 py-3 md:py-4 border-b border-blue-800 flex items-center gap-3">
            <Trophy size={18} className="text-yellow-400" />
            <h3 className="font-black text-sm md:text-lg uppercase tracking-widest text-white">Artilheiros</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0e1e5b]">
                <tr>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Atleta</TableHeader>
                  <TableHeader className="text-center">Gols</TableHeader>
                </tr>
              </thead>
              <tbody>
                {artilheiros.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-blue-400">
                      Nenhum gol registrado ainda.
                    </td>
                  </tr>
                ) : (
                    artilheiros.map((player, index) => (
                      <TableRow key={player.id} index={index}>
                        <td className="w-8 px-2 py-1.5 md:py-2 font-mono text-blue-400 font-bold text-xs md:text-base">{index + 1}</td>
                        <td className="px-2 py-1.5 md:py-2 font-medium text-white text-xs md:text-base">{player.name}</td>
                        <td className="w-16 px-2 py-1.5 md:py-2 text-center font-bold text-yellow-400 text-xs md:text-lg">{player.total_goals}</td>
                      </TableRow>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goleiros Menos Vazados */}
        <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
          <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-4 py-3 md:py-4 border-b border-blue-800 flex items-center gap-3">
            <ShieldAlert size={18} className="text-cyan-400" />
            <h3 className="font-black text-sm md:text-lg uppercase tracking-widest text-white">Goleiros Menos Vazados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0e1e5b]">
                <tr>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Atleta</TableHeader>
                  <TableHeader className="text-center">Gols Sofridos</TableHeader>
                </tr>
              </thead>
              <tbody>
                {goleirosMenosVazados.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-blue-400">
                      Nenhum goleiro registrado.
                    </td>
                  </tr>
                ) : (
                    goleirosMenosVazados.map((player, index) => (
                      <TableRow key={player.id} index={index}>
                        <td className="w-8 px-2 py-1.5 md:py-2 font-mono text-blue-400 font-bold text-xs md:text-base">{index + 1}</td>
                        <td className="px-2 py-1.5 md:py-2 font-medium text-white text-xs md:text-base">{player.name}</td>
                        <td className="w-24 px-2 py-1.5 md:py-2 text-center font-bold text-cyan-400 text-xs md:text-lg">{player.total_goals_conceded || 0}</td>
                      </TableRow>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cartões Amarelos */}
        <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
          <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-4 py-4 border-b border-blue-800 flex items-center gap-3">
            <Medal size={20} className="text-yellow-500" />
            <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-white">Cartões Amarelos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0e1e5b]">
                <tr>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Atleta</TableHeader>
                  <TableHeader className="text-center">Cartões</TableHeader>
                </tr>
              </thead>
              <tbody>
                {yellowCards.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-blue-400">
                      Nenhum cartão amarelo.
                    </td>
                  </tr>
                ) : (
                    yellowCards.map((player, index) => (
                      <TableRow key={player.id} index={index}>
                        <td className="w-8 px-2 py-1.5 md:py-2 font-mono text-blue-400 font-bold text-xs md:text-base">{index + 1}</td>
                        <td className="px-2 py-1.5 md:py-2 font-medium text-white text-xs md:text-base">{player.name}</td>
                        <td className="w-20 px-2 py-1.5 md:py-2 text-center">
                          <span className="bg-yellow-500 text-[#000435] font-black px-2 py-0.5 md:px-3 md:py-1 rounded shadow-lg text-xs md:text-base">
                            {player.total_yellow_cards}
                          </span>
                        </td>
                      </TableRow>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cartões Vermelhos */}
        <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
          <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-4 py-4 border-b border-blue-800 flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500" />
            <h3 className="font-black text-base md:text-lg uppercase tracking-widest text-white">Cartões Vermelhos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0e1e5b]">
                <tr>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Atleta</TableHeader>
                  <TableHeader className="text-center">Cartões</TableHeader>
                </tr>
              </thead>
              <tbody>
                {redCards.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-blue-400">
                      Nenhum cartão vermelho.
                    </td>
                  </tr>
                ) : (
                    redCards.map((player, index) => (
                      <TableRow key={player.id} index={index}>
                        <td className="w-8 px-2 py-1.5 md:py-2 font-mono text-blue-400 font-bold text-xs md:text-base">{index + 1}</td>
                        <td className="px-2 py-1.5 md:py-2 font-medium text-white text-xs md:text-base">{player.name}</td>
                        <td className="w-20 px-2 py-1.5 md:py-2 text-center">
                          <span className="bg-red-600 text-white font-black px-2 py-0.5 md:px-3 md:py-1 rounded shadow-lg text-xs md:text-base">
                            {player.total_red_cards}
                          </span>
                        </td>
                      </TableRow>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
