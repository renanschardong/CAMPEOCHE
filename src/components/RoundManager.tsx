import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save, AlertCircle, Star, ShieldAlert, Trophy, Medal, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Round {
  id: number;
  name: string;
}

interface Player {
  id: number;
  name: string;
  position: 'Linha' | 'Goleiro';
}

interface Performance {
  player_id: number;
  goals: number;
  yellow_cards: number;
  goals_conceded: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  red_cards: number;
  extra_points: number;
  lost_points: number;
}

interface SystemSettings {
  win_points: number;
  draw_points: number;
  loss_points: number;
  yellow_card_points: number;
  red_card_points: number;
}

export function RoundManager() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [qualifiedPlayerIds, setQualifiedPlayerIds] = useState<Set<number>>(new Set());
  const [qualifiedGoleiroIds, setQualifiedGoleiroIds] = useState<Set<number>>(new Set());
  const [qualifiedPlayersOrdered, setQualifiedPlayersOrdered] = useState<number[]>([]);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [newRoundName, setNewRoundName] = useState('');
  const [performances, setPerformances] = useState<Record<number, Performance>>({});
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    win_points: 6,
    draw_points: 3,
    loss_points: 2,
    yellow_card_points: -2,
    red_card_points: -4
  });

  useEffect(() => {
    fetchRounds();
    fetchPlayers();
    fetchSettings();
    fetchQualifiedPlayers();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRound) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const newPerformances: Record<number, Performance> = { ...performances };
        const perfsToSave: any[] = [];

        data.forEach(row => {
          const playerName = (row.ATLETA || row.Atleta || row.NOME || row.Nome || row.name || row.Name)?.toString().toUpperCase();
          if (!playerName) return;

          const player = players.find(p => p.name.toUpperCase() === playerName);
          if (!player) return;

          const perf: Performance = {
            player_id: player.id,
            goals: parseInt(row.GOLS || row.Gols || row.goals || 0),
            wins: parseInt(row.VITÓRIAS || row.Vitórias || row.vitorias || row.Vitorias || row.wins || 0),
            draws: parseInt(row.EMPATES || row.Empates || row.draws || 0),
            losses: parseInt(row.DERROTAS || row.Derrotas || row.losses || 0),
            yellow_cards: parseInt(row.AMARELO || row.Amarelo || row.yellow || 0),
            red_cards: parseInt(row.VERMELHO || row.Vermelho || row.red || 0),
            extra_points: parseInt(row.PE || row.Extra || row.extra || 0),
            goals_conceded: parseInt(row.SOFRIDOS || row.Sofridos || row.conceded || 0),
            points: 0,
            lost_points: 0
          };

          perf.points = calculateMatchPoints(perf, selectedRound);
          newPerformances[player.id] = perf;
          perfsToSave.push({
            ...perf,
            round_id: selectedRound
          });
        });

        if (perfsToSave.length === 0) {
          alert('Nenhum dado correspondente encontrado. Verifique se os nomes dos atletas coincidem.');
          return;
        }

        if (confirm(`Deseja importar resultados para ${perfsToSave.length} atletas?`)) {
          setPerformances(newPerformances);
          const res = await fetch('/api/performances/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ performances: perfsToSave }),
          });

          if (res.ok) {
            alert('Resultados importados e salvos com sucesso!');
          } else {
            alert('Erro ao salvar resultados no servidor.');
          }
        }
      } catch (error) {
        console.error('Error parsing Excel', error);
        alert('Erro ao ler o arquivo Excel.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const fetchQualifiedPlayers = async () => {
    try {
      const res = await fetch('/api/stats/leaderboard');
      const data = await res.json();
      // top 40 Linha players are qualified based on points BEFORE round 9
      const qualified = data
        .filter((p: any) => p.position === 'Linha')
        .map((p: any) => ({
          ...p,
          qualification_points: (p.total_points || 0) - (p.r9 || 0)
        }))
        .sort((a: any, b: any) => b.qualification_points - a.qualification_points)
        .slice(0, 40)
        .map((p: any) => p.id);
      
      setQualifiedPlayersOrdered(qualified);
      setQualifiedPlayerIds(new Set(qualified));

      const qualifiedGoleiros = data
        .filter((p: any) => p.position === 'Goleiro')
        .map((p: any) => ({
          ...p,
          qualification_points: (p.total_points || 0) - (p.r9 || 0)
        }))
        .sort((a: any, b: any) => b.qualification_points - a.qualification_points)
        .slice(0, 4)
        .map((p: any) => p.id);
      
      setQualifiedGoleiroIds(new Set(qualifiedGoleiros));
    } catch (error) {
      console.error('Failed to fetch qualified players', error);
    }
  };

  useEffect(() => {
    if (selectedRound) {
      fetchPerformances(selectedRound);
    } else {
      setPerformances({});
    }
  }, [selectedRound]);

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.error('Failed to fetch settings', err));
  };

  const fetchRounds = async () => {
    const res = await fetch('/api/rounds');
    const data = await res.json();
    setRounds(data);
    if (data.length > 0 && !selectedRound) {
      // Default to the last created round or specific logic
      setSelectedRound(data[data.length - 1].id);
    }
  };

  const fetchPlayers = async () => {
    const res = await fetch('/api/players');
    const data = await res.json();
    setPlayers(data);
  };

  const fetchPerformances = async (roundId: number) => {
    const res = await fetch(`/api/performances?round_id=${roundId}`);
    const data = await res.json();
    const perfMap: Record<number, Performance> = {};
    
    // Initialize with existing data
    data.forEach((p: any) => {
      perfMap[p.player_id] = {
        player_id: p.player_id,
        goals: p.goals,
        yellow_cards: p.yellow_cards,
        goals_conceded: p.goals_conceded,
        points: p.points,
        wins: p.wins || 0,
        draws: p.draws || 0,
        losses: p.losses || 0,
        red_cards: p.red_cards || 0,
        extra_points: p.extra_points || 0,
        lost_points: p.lost_points || 0
      };
    });

    setPerformances(perfMap);
  };

  const createRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoundName) return;
    
    const res = await fetch('/api/rounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRoundName }),
    });
    
    if (res.ok) {
      setNewRoundName('');
      fetchRounds();
    }
  };

  const calculateMatchPoints = (perf: Performance, roundId: number) => {
    let points = 
      (perf.wins * settings.win_points) + 
      (perf.draws * settings.draw_points) + 
      (perf.losses * settings.loss_points);
    
    if (roundId === 8) {
      points *= 2;
    }
    return points;
  };

  const calculateTotalPoints = (perf: Performance, roundId: number) => {
    let points = calculateMatchPoints(perf, roundId);
    
    points += (perf.yellow_cards * settings.yellow_card_points) + 
              (perf.red_cards * settings.red_card_points) +
              (perf.extra_points || 0);
    
    return points;
  };

  const updatePerformance = (playerId: number, field: keyof Performance, value: number) => {
    setPerformances(prev => {
      const currentPerf = prev[playerId] || {
        player_id: playerId,
        goals: 0,
        yellow_cards: 0,
        goals_conceded: 0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        red_cards: 0,
        extra_points: 0,
        lost_points: 0
      };

      const updatedPerf = {
        ...currentPerf,
        [field]: value
      };

      // Auto-calculate points if the changed field affects points
      if (['wins', 'draws', 'losses'].includes(field)) {
        updatedPerf.points = calculateMatchPoints(updatedPerf, selectedRound!);
      }

      return {
        ...prev,
        [playerId]: updatedPerf
      };
    });
  };

  const saveAll = async () => {
    if (!selectedRound) return;
    setSaving(true);
    
    try {
      const promises = players.map(player => {
        const perf = performances[player.id] || { 
          player_id: player.id, 
          goals: 0, 
          yellow_cards: 0, 
          goals_conceded: 0, 
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          red_cards: 0,
          extra_points: 0,
          lost_points: 0
        };
        return fetch('/api/performances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player_id: player.id,
            round_id: selectedRound,
            goals: perf.goals || 0,
            yellow_cards: perf.yellow_cards || 0,
            goals_conceded: perf.goals_conceded || 0,
            points: perf.points || 0,
            wins: perf.wins || 0,
            draws: perf.draws || 0,
            losses: perf.losses || 0,
            red_cards: perf.red_cards || 0,
            extra_points: perf.extra_points || 0,
            lost_points: perf.lost_points || 0
          })
        });
      });
      
      await Promise.all(promises);
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Error saving', error);
      alert('Erro ao salvar dados.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000); // Reset confirmation after 3s
      return;
    }

    try {
      await fetch('/api/stats', { method: 'DELETE' });
      setConfirmReset(false);
      // Refresh data
      if (selectedRound) {
        fetchPerformances(selectedRound);
      }
      alert('Todas as estatísticas foram zeradas.');
    } catch (error) {
      console.error('Failed to reset stats', error);
      alert('Erro ao zerar estatísticas.');
    }
  };

  const renderPlayerTable = (playerList: Player[], variant: 'Linha' | 'Goleiro') => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-blue-800 text-blue-300 text-[10px] uppercase tracking-wider">
            <th className="py-2 px-2 font-bold">Atleta</th>
            <th className="py-2 px-2 font-bold text-center w-16">Pontos</th>
            <th className="py-2 px-2 font-bold text-center w-16">Gols</th>
            {variant === 'Goleiro' && (
              <th className="py-2 px-2 font-bold text-center w-20">Gols Sofridos</th>
            )}
            <th className="py-2 px-2 font-bold text-center w-16 bg-green-900/20 text-green-300">Vitórias</th>
            <th className="py-2 px-2 font-bold text-center w-16 bg-gray-900/20 text-gray-300">Empates</th>
            <th className="py-2 px-2 font-bold text-center w-16 bg-red-900/20 text-red-300">Derrotas</th>
            <th className="py-2 px-2 font-bold text-center w-16 bg-yellow-900/20 text-yellow-300">Amarelo</th>
            <th className="py-2 px-2 font-bold text-center w-16 bg-red-900/20 text-red-300">Vermelho</th>
            <th className="py-2 px-2 font-bold text-center w-16 bg-emerald-900/20 text-emerald-300">PE</th>
            <th className="py-2 px-2 font-bold text-center w-16 bg-rose-900/20 text-rose-300">PP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-900/30">
          {playerList.map(player => {
            const perf = performances[player.id] || { 
              goals: 0, 
              yellow_cards: 0, 
              goals_conceded: 0, 
              points: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              red_cards: 0,
              extra_points: 0,
              lost_points: 0
            };
            return (
              <tr key={player.id} className="hover:bg-blue-900/20 transition-colors">
                <td className="py-1.5 px-2">
                  <div className="font-bold text-white text-sm">{player.name}</div>
                  <div className="text-[10px] text-blue-400 uppercase leading-none">{player.position}</div>
                </td>
                <td className="py-1.5 px-2 text-center">
                  <div className="w-12 text-center p-1 bg-[#0e1e5b] border border-blue-700 rounded font-black text-white text-base">
                    {calculateTotalPoints(perf, selectedRound!)}
                  </div>
                </td>
                <td className="py-1.5 px-2 text-center">
                  <input
                    type="number"
                    min="0"
                    value={perf.goals || 0}
                    onChange={(e) => updatePerformance(player.id, 'goals', parseInt(e.target.value) || 0)}
                    className="w-12 text-center p-1 bg-[#0e1e5b] border border-blue-700 rounded focus:ring-2 focus:ring-cyan-500 outline-none text-white font-bold text-sm"
                  />
                </td>
                {variant === 'Goleiro' && (
                  <td className="py-1.5 px-2 text-center">
                    <input
                      type="number"
                      min="0"
                      value={perf.goals_conceded || 0}
                      onChange={(e) => updatePerformance(player.id, 'goals_conceded', parseInt(e.target.value) || 0)}
                      className="w-12 text-center p-1 bg-[#0e1e5b] border border-blue-700 rounded focus:ring-2 focus:ring-cyan-500 outline-none text-white font-bold text-sm"
                    />
                  </td>
                )}
                
                {/* New Columns Inputs */}
                <td className="py-1.5 px-2 text-center bg-green-900/10">
                  <input
                    type="number"
                    min="0"
                    value={perf.wins || 0}
                    onChange={(e) => updatePerformance(player.id, 'wins', parseInt(e.target.value) || 0)}
                    className="w-10 text-center p-0.5 bg-[#0e1e5b] border border-green-900/50 rounded focus:ring-2 focus:ring-green-500 outline-none text-green-300 font-bold text-xs"
                  />
                </td>
                <td className="py-1.5 px-2 text-center bg-gray-900/10">
                  <input
                    type="number"
                    min="0"
                    value={perf.draws || 0}
                    onChange={(e) => updatePerformance(player.id, 'draws', parseInt(e.target.value) || 0)}
                    className="w-10 text-center p-0.5 bg-[#0e1e5b] border border-gray-700/50 rounded focus:ring-2 focus:ring-gray-500 outline-none text-gray-300 font-bold text-xs"
                  />
                </td>
                <td className="py-1.5 px-2 text-center bg-red-900/10">
                  <input
                    type="number"
                    min="0"
                    value={perf.losses || 0}
                    onChange={(e) => updatePerformance(player.id, 'losses', parseInt(e.target.value) || 0)}
                    className="w-10 text-center p-0.5 bg-[#0e1e5b] border border-red-900/50 rounded focus:ring-2 focus:ring-red-500 outline-none text-red-300 font-bold text-xs"
                  />
                </td>
                <td className="py-1.5 px-2 text-center bg-yellow-900/10">
                  <input
                    type="number"
                    min="0"
                    value={perf.yellow_cards || 0}
                    onChange={(e) => updatePerformance(player.id, 'yellow_cards', parseInt(e.target.value) || 0)}
                    className="w-10 text-center p-0.5 bg-[#0e1e5b] border border-yellow-700/50 rounded focus:ring-2 focus:ring-yellow-500 outline-none text-yellow-300 font-bold text-xs"
                  />
                </td>
                <td className="py-1.5 px-2 text-center bg-red-900/10">
                  <input
                    type="number"
                    min="0"
                    value={perf.red_cards || 0}
                    onChange={(e) => updatePerformance(player.id, 'red_cards', parseInt(e.target.value) || 0)}
                    className="w-10 text-center p-0.5 bg-[#0e1e5b] border border-red-900/50 rounded focus:ring-2 focus:ring-red-500 outline-none text-red-300 font-bold text-xs"
                  />
                </td>
                <td className="py-1.5 px-2 text-center bg-emerald-900/10">
                  <input
                    type="number"
                    min="0"
                    value={perf.extra_points || 0}
                    onChange={(e) => updatePerformance(player.id, 'extra_points', parseInt(e.target.value) || 0)}
                    className="w-10 text-center p-0.5 bg-[#0e1e5b] border border-emerald-900/50 rounded focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-300 font-bold text-xs"
                  />
                </td>
                <td className="py-1.5 px-2 text-center bg-rose-900/10">
                  <div className="text-rose-300 font-bold text-xs">
                    {Math.abs(perf.yellow_cards * settings.yellow_card_points + perf.red_cards * settings.red_card_points)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const playersLinha = players.filter(p => {
    if (selectedRound === 9) {
      return p.position === 'Linha' && qualifiedPlayerIds.has(p.id);
    }
    return p.position === 'Linha';
  });
  const playersGoleiros = players.filter(p => {
    if (selectedRound === 9) {
      return p.position === 'Goleiro' && qualifiedGoleiroIds.has(p.id); 
    }
    return p.position === 'Goleiro';
  });

  const finalPlayers = selectedRound === 9 
    ? playersLinha.filter(p => qualifiedPlayersOrdered.slice(0, 20).includes(p.id))
        .sort((a, b) => qualifiedPlayersOrdered.indexOf(a.id) - qualifiedPlayersOrdered.indexOf(b.id))
    : [];

  const thirdPlayers = selectedRound === 9 
    ? playersLinha.filter(p => qualifiedPlayersOrdered.slice(20, 40).includes(p.id))
        .sort((a, b) => qualifiedPlayersOrdered.indexOf(a.id) - qualifiedPlayersOrdered.indexOf(b.id))
    : [];

  return (
    <div className="space-y-8">
      {/* Round Selection / Creation */}
      <div className="bg-[#000435] p-6 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="font-bold text-blue-200 whitespace-nowrap uppercase tracking-wider">Rodada:</label>
            <select 
              value={selectedRound || ''} 
              onChange={(e) => setSelectedRound(Number(e.target.value))}
              className="w-full md:w-64 px-4 py-2 bg-[#0e1e5b] border border-blue-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none font-bold"
            >
              {rounds.length === 0 && <option value="">Nenhuma rodada</option>}
              {rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          
          <form onSubmit={createRound} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={newRoundName}
              onChange={(e) => setNewRoundName(e.target.value)}
              placeholder="NOVA RODADA"
              className="flex-1 px-4 py-2 bg-[#0e1e5b] border border-blue-700 rounded-lg text-white placeholder-blue-400 focus:ring-2 focus:ring-cyan-500 outline-none uppercase font-bold"
            />
            <button type="submit" className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-[0_0_10px_rgba(8,145,178,0.5)]">
              <Plus size={20} />
            </button>
          </form>
        </div>

        {selectedRound ? (
          <div>
            {selectedRound === 8 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/20 border border-amber-600/50 rounded-lg text-amber-200 text-sm flex items-center gap-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Star className="text-amber-400 fill-amber-400 animate-pulse" size={20} />
                <div className="font-bold uppercase tracking-wide">
                  <strong className="text-amber-400 text-lg mr-2">Rodada Final!</strong> 
                  Pontuação em dobro nesta rodada.
                </div>
              </div>
            )}

            {selectedRound === 9 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-600/50 rounded-lg text-blue-200 text-sm flex items-center gap-3 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <Trophy className="text-blue-400 animate-bounce" size={20} />
                <div className="font-bold uppercase tracking-wide">
                  <strong className="text-blue-400 text-lg mr-2">RODADA DA FINAL!</strong> 
                  Apenas os 40 melhores classificados participam. Pontuação normal.
                </div>
              </div>
            )}
            
            {selectedRound === 9 ? (
              <>
                <div className="mb-8 rounded-lg overflow-hidden border border-blue-700/50 shadow-[0_0_20px_rgba(29,78,216,0.2)]">
                  <div className="bg-gradient-to-r from-[#000435] via-blue-900/30 to-[#000435] px-6 py-6 border-b border-blue-700/50 flex items-center gap-3">
                    <div className="bg-blue-700 p-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      <Trophy size={20} className="text-white" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-widest text-blue-400 leading-none">Grande Final</h3>
                      <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mt-1">Disputa do 1° ao 20°</p>
                    </div>
                  </div>
                  {renderPlayerTable(finalPlayers, 'Linha')}
                </div>

                <div className="mb-8 rounded-lg overflow-hidden border border-blue-400/50 shadow-[0_0_20px_rgba(96,165,250,0.1)]">
                  <div className="bg-gradient-to-r from-[#000435] via-blue-400/10 to-[#000435] px-6 py-6 border-b border-blue-400/50 flex items-center gap-3">
                    <div className="bg-blue-400 p-2 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                      <Medal size={20} className="text-[#000435]" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-widest text-blue-300 leading-none">Disputa 3° e 4° Lugar</h3>
                      <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mt-1">Disputa do 21° ao 40°</p>
                    </div>
                  </div>
                  {renderPlayerTable(thirdPlayers, 'Linha')}
                </div>
              </>
            ) : (
              <div className="mb-8 rounded-lg overflow-hidden border border-blue-800/50">
                <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-6 py-6 border-b border-blue-800 flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    <Star size={20} className="text-white" fill="currentColor" />
                  </div>
                  <h3 className="font-black text-xl uppercase tracking-widest text-white">Jogadores de Linha</h3>
                </div>
                {renderPlayerTable(playersLinha, 'Linha')}
              </div>
            )}

            <div className="rounded-lg overflow-hidden border border-blue-800/50">
              <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-6 py-6 border-b border-blue-800 flex items-center gap-3">
                <div className="bg-cyan-600 p-2 rounded-full shadow-[0_0_10px_rgba(8,145,178,0.5)]">
                  <ShieldAlert size={20} className="text-white" />
                </div>
                <h3 className="font-black text-xl uppercase tracking-widest text-white">
                  {selectedRound === 9 ? 'Goleiros Classificados (Top 4)' : 'Goleiros'}
                </h3>
              </div>
              {renderPlayerTable(playersGoleiros, 'Goleiro')}
            </div>
            
            <div className="mt-8 flex flex-wrap justify-end gap-4">
              <button
                onClick={handleReset}
                className={`px-6 py-3 rounded-lg font-bold transition-all uppercase tracking-wider text-sm ${
                  confirmReset 
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                    : 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50'
                }`}
              >
                {confirmReset ? 'Confirmar Reset?' : 'Zerar Estatísticas'}
              </button>

              <button
                onClick={saveAll}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black uppercase tracking-widest rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-blue-300 flex flex-col items-center">
            <div className="bg-blue-900/30 p-6 rounded-full mb-4">
               <AlertCircle className="w-12 h-12 text-blue-400" />
            </div>
            <p className="text-lg font-medium uppercase tracking-wide">Selecione ou crie uma rodada para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}

