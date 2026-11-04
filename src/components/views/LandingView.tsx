import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckSquare,
  Briefcase,
  Users,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingView: React.FC = () => {
  const {
    users,
    switchUser,
    setIsLoginModalOpen,
    setIsRegisterModalOpen,
    setIsWorkspaceModalOpen,
    workspace,
  } = useApp();

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in">
      {/* Hero Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Progress Palace Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Sistem Tracking Progres & Manajemen Akses
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Platform kolaboratif untuk manajemen proyek digital, pelacakan butir pekerjaan lintas unit, pembaruan status harian, serta kontrol hak akses email bagi peran Admin dan Anggota.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <LogIn className="h-4 w-4" />
              <span>Masuk dengan Email</span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
            >
              <UserPlus className="h-4 w-4 text-emerald-400" />
              <span>Ajukan Pendaftaran Akses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instant Demo Personas - Experience the App */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">
            Masuk Langsung dengan Akun Demo
          </h2>
          <p className="text-xs text-slate-500">
            Pilih salah satu profil untuk langsung menjelajahi sistem sesuai peran hak akses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {users
            .filter((u) => u.status === 'approved')
            .slice(0, 6)
            .map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-emerald-400 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        u.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {u.department || u.email}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit">
            <Briefcase className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Portofolio & Roadmap</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Kelola inisiatif strategis, pantau pencapaian milestone, dan tinjau target waktu penyelesaian per squad.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
            <CheckSquare className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Papan Tugas & Progres Harian</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tampilan Tabel dan Kanban interaktif dengan slider progres, filter frekuensi rutin, dan riwayat log.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Kontrol Akses Email & Whitelist</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Perlindungan akses email terverifikasi, persetujuan admin untuk pendaftar baru, serta multi-workspace untuk segala tim.
          </p>
        </div>
      </div>
    </div>
  );
};
