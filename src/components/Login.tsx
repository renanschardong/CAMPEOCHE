import React, { useState } from 'react';
import { Lock, User, X } from 'lucide-react';

const MODERATORS = [
  { nickname: 'MODERADOR 01', password: 'MODERADOR#0102' },
  { nickname: 'MODERADOR 02', password: 'MODERADOR#0203' },
  { nickname: 'MODERADOR 03', password: 'MODERADOR#0304' },
];

interface LoginProps {
  onLogin: () => void;
  onClose: () => void;
}

export function Login({ onLogin, onClose }: LoginProps) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const moderator = MODERATORS.find(
      (m) => m.nickname === nickname && m.password === password
    );

    if (moderator) {
      onLogin();
      onClose();
    } else {
      setError('Nickname ou senha incorretos.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#000435] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-blue-500/20 flex items-center justify-between bg-gradient-to-r from-blue-900/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Lock className="text-cyan-400" size={20} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white italic">
              Área do Moderador
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-blue-300 ml-1">
              Nickname
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-blue-900/20 border border-blue-500/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-blue-700 focus:outline-none focus:border-cyan-400 transition-colors font-bold"
                placeholder="Digite seu nickname"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-blue-300 ml-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-blue-900/20 border border-blue-500/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-blue-700 focus:outline-none focus:border-cyan-400 transition-colors font-bold"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            Entrar
          </button>
        </form>

        <div className="p-4 bg-blue-900/10 text-center">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">
            Acesso Restrito a Moderadores Autorizados
          </p>
        </div>
      </div>
    </div>
  );
}
