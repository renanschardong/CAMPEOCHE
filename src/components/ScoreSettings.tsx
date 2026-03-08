import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface ScoreSettingsData {
  yellow_card_points: number;
  red_card_points: number;
  win_points: number;
  draw_points: number;
  loss_points: number;
}

export function ScoreSettings() {
  const [settings, setSettings] = useState<ScoreSettingsData>({
    yellow_card_points: -2,
    red_card_points: -4,
    win_points: 6,
    draw_points: 3,
    loss_points: 2
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/score-settings');
      const data = await res.json();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ScoreSettingsData, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/score-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Configurações salvas com sucesso!');
      } else {
        alert('Erro ao salvar configurações.');
      }
    } catch (error) {
      console.error('Error saving settings', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center p-8">Carregando configurações...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#000435] p-8 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-blue-800">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
          <AlertCircle className="text-cyan-400" />
          Configurações de Pontuação
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Penalidades */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-red-400 uppercase border-b border-red-900/50 pb-2">Penalidades</h3>
            
            <div className="flex justify-between items-center bg-red-900/10 p-4 rounded-lg border border-red-900/30">
              <label className="font-bold text-red-200">Cartão Amarelo</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.yellow_card_points}
                  onChange={(e) => handleChange('yellow_card_points', parseInt(e.target.value))}
                  className="w-20 text-center p-2 bg-[#0e1e5b] border border-red-700 rounded focus:ring-2 focus:ring-red-500 outline-none text-white font-bold"
                />
                <span className="text-sm text-red-400">pts</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-red-900/10 p-4 rounded-lg border border-red-900/30">
              <label className="font-bold text-red-200">Cartão Vermelho</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.red_card_points}
                  onChange={(e) => handleChange('red_card_points', parseInt(e.target.value))}
                  className="w-20 text-center p-2 bg-[#0e1e5b] border border-red-700 rounded focus:ring-2 focus:ring-red-500 outline-none text-white font-bold"
                />
                <span className="text-sm text-red-400">pts</span>
              </div>
            </div>
          </div>

          {/* Pontuação */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-green-400 uppercase border-b border-green-900/50 pb-2">Pontuação</h3>
            
            <div className="flex justify-between items-center bg-green-900/10 p-4 rounded-lg border border-green-900/30">
              <label className="font-bold text-green-200">Vitória</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.win_points}
                  onChange={(e) => handleChange('win_points', parseInt(e.target.value))}
                  className="w-20 text-center p-2 bg-[#0e1e5b] border border-green-700 rounded focus:ring-2 focus:ring-green-500 outline-none text-white font-bold"
                />
                <span className="text-sm text-green-400">pts</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-900/10 p-4 rounded-lg border border-gray-700/30">
              <label className="font-bold text-gray-200">Empate</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.draw_points}
                  onChange={(e) => handleChange('draw_points', parseInt(e.target.value))}
                  className="w-20 text-center p-2 bg-[#0e1e5b] border border-gray-600 rounded focus:ring-2 focus:ring-gray-500 outline-none text-white font-bold"
                />
                <span className="text-sm text-gray-400">pts</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-red-900/10 p-4 rounded-lg border border-red-900/30">
              <label className="font-bold text-red-200">Derrota</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.loss_points}
                  onChange={(e) => handleChange('loss_points', parseInt(e.target.value))}
                  className="w-20 text-center p-2 bg-[#0e1e5b] border border-red-700 rounded focus:ring-2 focus:ring-red-500 outline-none text-white font-bold"
                />
                <span className="text-sm text-red-400">pts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end pt-6 border-t border-blue-900/50">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black uppercase tracking-widest rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
}
