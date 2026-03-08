import React, { useState } from 'react';
import { X, Lock, User, Star, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: string, pass: string) => boolean;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (success) {
      onClose();
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000435]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0e1e5b] border-2 border-blue-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,102,255,0.3)] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-[-20px] right-[-20px] text-white">
            <Star size={120} fill="currentColor" />
          </div>
          <div className="absolute bottom-[-10px] left-[-10px] text-white">
            <Star size={60} fill="currentColor" />
          </div>
        </div>

        {/* Header */}
        <div className="relative p-4 md:p-6 border-b border-blue-500/20 flex items-center justify-between bg-gradient-to-r from-[#000435] to-[#0e1e5b]">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-white rounded-full p-1 md:p-1.5 shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              <ShieldCheck size={16} className="text-[#0e1e5b] md:w-5 md:h-5" fill="currentColor" />
            </div>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter italic text-white">
              Área do Moderador
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-blue-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative p-6 md:p-8 space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-300 flex items-center gap-2">
                <User size={12} className="md:w-3.5 md:h-3.5" /> Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#000435] border border-blue-500/30 rounded-lg px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-blue-800 uppercase font-bold tracking-wider"
                placeholder="MODERADOR XX"
                required
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-300 flex items-center gap-2">
                <Lock size={12} className="md:w-3.5 md:h-3.5" /> Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#000435] border border-blue-500/30 rounded-lg px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-blue-800 font-bold tracking-wider"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-red-900/20 p-2 md:p-3 rounded border border-red-500/30 animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-white via-cyan-100 to-white text-[#000435] font-black uppercase tracking-widest py-3 md:py-4 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm md:text-base"
          >
            Acessar Sistema
          </button>

          <p className="text-center text-[10px] text-blue-400 uppercase tracking-[0.2em] font-medium opacity-60">
            Tema Champions League • Acesso Restrito
          </p>
        </form>
      </div>
    </div>
  );
}
