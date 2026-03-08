import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, Trash2, Save, RefreshCw, Star } from 'lucide-react';

interface SystemSettings {
  win_points: number;
  draw_points: number;
  loss_points: number;
  yellow_card_points: number;
  red_card_points: number;
  championship_name: string;
}

interface Backup {
  id: number;
  filename: string;
  created_at: string;
  moderator: string;
}

export function Settings({ onSettingsUpdate }: { onSettingsUpdate?: () => void }) {
  const [settings, setSettings] = useState<SystemSettings>({
    win_points: 6,
    draw_points: 3,
    loss_points: 2,
    yellow_card_points: -2,
    red_card_points: -4,
    championship_name: 'CAMPEOCHE - 2026'
  });
  const [backups, setBackups] = useState<Backup[]>([]);
  const [moderatorName, setModeratorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchBackups();
  }, []);

  const fetchSettings = () => {
    setLoading(true);
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.error('Failed to fetch settings', err))
      .finally(() => setLoading(false));
  };

  const fetchBackups = () => {
    fetch('/api/backups')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBackups(data);
      })
      .catch(err => console.error('Failed to fetch backups', err));
  };

  const handleCreateBackup = async () => {
    if (!moderatorName.trim()) {
      alert('Por favor, informe o nome do moderador para realizar o backup.');
      return;
    }

    setCreatingBackup(true);
    try {
      const res = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moderator: moderatorName.toUpperCase() })
      });

      if (res.ok) {
        alert('Backup realizado com sucesso!');
        setModeratorName('');
        fetchBackups();
      } else {
        alert('Erro ao realizar backup.');
      }
    } catch (error) {
      console.error('Failed to create backup', error);
      alert('Erro ao realizar backup.');
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Configurações salvas com sucesso!');
      if (onSettingsUpdate) onSettingsUpdate();
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SystemSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: field === 'championship_name' ? value : (parseInt(value) || 0)
    }));
  };

  if (loading) return <div className="text-white p-8 text-center">Carregando configurações...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-[#000435] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800 overflow-hidden">
        <div className="bg-gradient-to-r from-[#000435] via-[#0e1e5b] to-[#000435] px-6 py-6 border-b border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-600 p-2 rounded-full shadow-[0_0_10px_rgba(75,85,99,0.5)]">
              <SettingsIcon size={20} className="text-white" />
            </div>
            <h3 className="font-black text-xl uppercase tracking-widest text-white">Configurações do Sistema</h3>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Championship Info Section */}
          <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="bg-cyan-500/20 p-3 rounded-lg">
                <Star className="text-cyan-400" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-4">Informações do Campeonato</h4>
                <div className="max-w-md">
                  <label className="block text-blue-300 font-bold uppercase text-xs tracking-wider mb-2">Nome do Campeonato</label>
                  <input 
                    type="text" 
                    value={settings.championship_name}
                    onChange={(e) => handleChange('championship_name', e.target.value)}
                    placeholder="Ex: CAMPEOCHE - 2026"
                    className="w-full bg-[#0e1e5b] border border-blue-700 rounded px-4 py-2 text-white font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <p className="mt-2 text-xs text-blue-400/60 italic">Este nome será exibido no cabeçalho e rodapé de todas as páginas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Rules Section */}
          <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <SettingsIcon className="text-green-400" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-4">Regras de Pontuação</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-blue-300 font-bold uppercase text-xs tracking-wider mb-3">Pontuação</h5>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center text-sm border-b border-blue-800/30 pb-2">
                        <span className="text-gray-300">Vitória</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={settings.win_points}
                            onChange={(e) => handleChange('win_points', e.target.value)}
                            className="w-20 bg-[#0e1e5b] border border-blue-700 rounded px-3 py-1 text-right font-mono font-bold text-green-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="text-xs text-gray-500 w-8">pts</span>
                        </div>
                      </li>
                      <li className="flex justify-between items-center text-sm border-b border-blue-800/30 pb-2">
                        <span className="text-gray-300">Empate</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={settings.draw_points}
                            onChange={(e) => handleChange('draw_points', e.target.value)}
                            className="w-20 bg-[#0e1e5b] border border-blue-700 rounded px-3 py-1 text-right font-mono font-bold text-blue-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="text-xs text-gray-500 w-8">pts</span>
                        </div>
                      </li>
                      <li className="flex justify-between items-center text-sm border-b border-blue-800/30 pb-2">
                        <span className="text-gray-300">Derrota</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={settings.loss_points}
                            onChange={(e) => handleChange('loss_points', e.target.value)}
                            className="w-20 bg-[#0e1e5b] border border-blue-700 rounded px-3 py-1 text-right font-mono font-bold text-yellow-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="text-xs text-gray-500 w-8">pts</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-blue-300 font-bold uppercase text-xs tracking-wider mb-3">Penalidades</h5>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center text-sm border-b border-blue-800/30 pb-2">
                        <span className="text-gray-300">Cartão Amarelo</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={settings.yellow_card_points}
                            onChange={(e) => handleChange('yellow_card_points', e.target.value)}
                            className="w-20 bg-[#0e1e5b] border border-blue-700 rounded px-3 py-1 text-right font-mono font-bold text-yellow-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="text-xs text-gray-500 w-8">pts</span>
                        </div>
                      </li>
                      <li className="flex justify-between items-center text-sm border-b border-blue-800/30 pb-2">
                        <span className="text-gray-300">Cartão Vermelho</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={settings.red_card_points}
                            onChange={(e) => handleChange('red_card_points', e.target.value)}
                            className="w-20 bg-[#0e1e5b] border border-blue-700 rounded px-3 py-1 text-right font-mono font-bold text-red-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="text-xs text-gray-500 w-8">pts</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backup & Database Section */}
          <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Database className="text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-4">Backup do Sistema</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Create Backup Form */}
                  <div className="space-y-4">
                    <p className="text-blue-300 text-sm">
                      Crie um ponto de restauração do banco de dados. O sistema mantém os últimos 5 backups.
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={moderatorName}
                        onChange={(e) => setModeratorName(e.target.value)}
                        placeholder="NOME DO MODERADOR"
                        className="flex-1 bg-[#0e1e5b] border border-blue-700 rounded px-4 py-2 text-white font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 uppercase text-sm"
                      />
                      <button 
                        onClick={handleCreateBackup}
                        disabled={creatingBackup}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50 text-sm whitespace-nowrap"
                      >
                        <RefreshCw size={16} className={creatingBackup ? 'animate-spin' : ''} />
                        {creatingBackup ? 'Salvando...' : 'Criar Backup'}
                      </button>
                    </div>
                  </div>

                  {/* Backup History Table */}
                  <div className="bg-[#000435] rounded-lg border border-blue-800/50 overflow-hidden">
                    <div className="bg-[#0e1e5b] px-4 py-2 border-b border-blue-800/50">
                      <h5 className="text-blue-300 font-bold uppercase text-[10px] tracking-widest">Últimos 5 Backups</h5>
                    </div>
                    <div className="divide-y divide-blue-900/30">
                      {backups.length === 0 ? (
                        <div className="p-4 text-center text-blue-400/50 text-xs italic">Nenhum backup realizado.</div>
                      ) : (
                        backups.map(backup => (
                          <div key={backup.id} className="p-3 flex justify-between items-center hover:bg-blue-900/10 transition-colors">
                            <div>
                              <div className="text-white font-bold text-xs uppercase">{backup.moderator}</div>
                              <div className="text-[10px] text-blue-400">
                                {new Date(backup.created_at).toLocaleDateString('pt-BR')} - {new Date(backup.created_at).toLocaleTimeString('pt-BR')}
                              </div>
                            </div>
                            <div className="text-[10px] text-blue-500 font-mono">
                              {backup.filename.length > 20 ? backup.filename.substring(0, 17) + '...' : backup.filename}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-900/10 rounded-lg p-6 border border-red-900/30">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-red-400 mb-2">Zona de Perigo</h4>
                <p className="text-red-300/70 text-sm mb-4">
                  Ações irreversíveis que afetam todos os dados do torneio.
                </p>
                <div className="text-xs text-red-400/50 italic">
                  Para zerar estatísticas, acesse a aba "Rodadas".
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
