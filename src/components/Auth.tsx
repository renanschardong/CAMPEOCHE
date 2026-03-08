import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldCheck, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: (user: { id: number; username: string; role: string }) => void;
  onClose: () => void;
}

export function Auth({ onLogin, onClose }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      if (username && password) {
        if (isLogin) {
          onLogin({ id: 1, username, role: 'admin' });
        } else {
          setIsLogin(true);
          setError('Cadastro realizado com sucesso! Faça o login.');
          setUsername('');
          setPassword('');
        }
      } else {
        setError('Preencha todos os campos');
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000435]/90 backdrop-blur-sm p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/40 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-[#000435] border border-blue-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white text-center uppercase tracking-widest mb-2">
            Pelada FC
          </h2>
          <p className="text-blue-400 text-center text-sm mb-8">
            {isLogin ? 'Bem-vindo de volta, atleta!' : 'Crie sua conta para começar'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 ml-1">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-blue-900/20 border border-blue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Seu nome de usuário"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 ml-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-blue-900/20 border border-blue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`text-xs p-3 rounded-lg border ${error.includes('sucesso') ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-red-900/20 border-red-800 text-red-400'}`}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-blue-900/50 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-white text-sm transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre agora'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
