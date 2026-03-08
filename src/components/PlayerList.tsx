import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Trash2, Shield, User, Pencil, Check, X, FileSpreadsheet, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Player {
  id: number;
  name: string;
  position: 'Linha' | 'Goleiro';
}

export function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState<'Linha' | 'Goleiro'>('Linha');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error('Failed to fetch players', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const playersToImport = data.map(row => {
          const name = row.NOME || row.Nome || row.name || row.Name;
          let position = row.POSIÇÃO || row.Posição || row.posicao || row.Posicao || row.position || row.Position || 'Linha';
          
          // Normalize position
          if (typeof position === 'string') {
            if (position.toLowerCase().includes('gol')) {
              position = 'Goleiro';
            } else {
              position = 'Linha';
            }
          }

          return { name: name?.toString().toUpperCase(), position };
        }).filter(p => p.name);

        if (playersToImport.length === 0) {
          alert('Nenhum dado válido encontrado no Excel. Certifique-se de ter uma coluna "NOME".');
          return;
        }

        if (confirm(`Deseja importar ${playersToImport.length} jogadores?`)) {
          const res = await fetch('/api/players/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players: playersToImport }),
          });

          if (res.ok) {
            alert('Jogadores importados com sucesso!');
            fetchPlayers();
          } else {
            alert('Erro ao importar jogadores.');
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

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, position: newPosition }),
      });
      if (res.ok) {
        setNewName('');
        fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to add player', error);
    }
  };

  const deletePlayer = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este jogador?')) return;
    try {
      await fetch(`/api/players/${id}`, { method: 'DELETE' });
      fetchPlayers();
    } catch (error) {
      console.error('Failed to delete player', error);
    }
  };

  const deleteAllPlayers = async () => {
    if (!confirm('ATENÇÃO: Isso excluirá TODOS os atletas e suas estatísticas. Tem certeza?')) return;
    try {
      const res = await fetch('/api/players', { method: 'DELETE' });
      if (res.ok) {
        fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to delete all players', error);
    }
  };

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id: number) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to update player', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#000435] p-6 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800">
        <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-cyan-400" />
          Adicionar Jogador
        </h2>
        <form onSubmit={addPlayer} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="NOME DO ATLETA"
            className="flex-1 px-4 py-3 bg-[#0e1e5b] border border-blue-700 rounded-lg text-white placeholder-blue-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none uppercase font-bold tracking-wide"
          />
          <select
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value as 'Linha' | 'Goleiro')}
            className="px-4 py-3 bg-[#0e1e5b] border border-blue-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none uppercase font-bold tracking-wide"
          >
            <option value="Linha">Linha</option>
            <option value="Goleiro">Goleiro</option>
          </select>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black uppercase tracking-widest rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Adicionar
          </button>
        </form>
      </div>

      <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-blue-800 bg-[#0e1e5b] flex items-center justify-between">
          <h3 className="font-black text-white uppercase tracking-widest">Lista de Atletas</h3>
          <div className="flex items-center gap-2">
            {players.length > 0 && (
              <button
                onClick={deleteAllPlayers}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all border border-red-600/50"
              >
                <Trash2 size={14} />
                Excluir Todos
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-blue-300">Carregando...</div>
        ) : players.length === 0 ? (
          <div className="p-8 text-center text-blue-300">Nenhum jogador cadastrado.</div>
        ) : (
          <ul className="divide-y divide-blue-900/50">
            {players.map((player) => (
              <li key={player.id} className="px-6 py-4 flex items-center justify-between hover:bg-blue-900/20 transition-colors group">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-full ${player.position === 'Goleiro' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {player.position === 'Goleiro' ? <Shield size={20} /> : <User size={20} />}
                  </div>
                  <div className="flex-1">
                    {editingId === player.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-1 bg-[#0e1e5b] border border-cyan-500 rounded text-white outline-none uppercase font-bold"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(player.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <button onClick={() => saveEdit(player.id)} className="text-green-400 hover:text-green-300 p-1">
                          <Check size={20} />
                        </button>
                        <button onClick={cancelEditing} className="text-red-400 hover:text-red-300 p-1">
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-white text-lg">{player.name}</p>
                        <p className="text-xs text-blue-400 uppercase tracking-wider">{player.position}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingId !== player.id && (
                    <>
                      <button
                        onClick={() => startEditing(player)}
                        className="text-blue-400 hover:text-cyan-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                        title="Editar"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => deletePlayer(player.id)}
                        className="text-blue-500 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                        title="Excluir"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

