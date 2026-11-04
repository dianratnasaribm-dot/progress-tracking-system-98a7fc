import React, { useState } from 'react';
import { X, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, setIsRegisterModalOpen, loginWithEmail, users, switchUser } =
    useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Silakan masukkan alamat email Anda.');
      return;
    }

    const res = loginWithEmail(email);
    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => {
        setIsLoginModalOpen(false);
        setEmail('');
        setSuccess('');
      }, 700);
    } else {
      setError(res.message);
    }
  };

  const handleSelectQuickUser = (user: (typeof users)[0]) => {
    switchUser(user);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-emerald-400">
            <LogIn className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Masuk ke Progress Palace</h3>
            <p className="text-xs text-slate-500">Gunakan email yang telah terdaftar atau disetujui</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email Terdaftar
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: dianratnasari.bm@gmail.com"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk ke Dashboard</span>
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Akses Cepat Demo Persona
          </p>
          <div className="grid grid-cols-2 gap-2">
            {users.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectQuickUser(u)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-6 w-6 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-slate-500">
          Belum punya akses?{' '}
          <button
            type="button"
            onClick={() => {
              setIsLoginModalOpen(false);
              setIsRegisterModalOpen(true);
            }}
            className="font-bold text-emerald-600 hover:text-emerald-700 underline"
          >
            Ajukan Pendaftaran Akses
          </button>
        </div>
      </div>
    </div>
  );
};
