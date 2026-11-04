import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Role, UserStatus } from '../../types';

export const AccessView: React.FC = () => {
  const {
    users,
    currentUser,
    approveUserAccess,
    rejectUserAccess,
    updateUserRole,
    revokeUserAccess,
    setIsInviteModalOpen,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'pending' | 'approved'>('pending');

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const approvedUsers = users.filter((u) => u.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                Manajemen Hak Akses Email & Peran Pengguna
              </h1>
              <p className="text-xs text-slate-500">
                Kelola izin peran Admin dan Anggota, verifikasi permohonan akses baru, dan kelola whitelist email
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <UserPlus className="h-4 w-4 text-emerald-400" />
          <span>Undang / Whitelist Email</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Pengguna
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {users.length}
          </p>
          <span className="text-[11px] text-slate-500">Semua entri akun</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Permohonan Pending
          </span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">
            {pendingUsers.length}
          </p>
          <span className="text-[11px] text-amber-600 font-semibold">
            Menunggu Verifikasi
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Administrator
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">
            {users.filter((u) => u.role === 'admin' && u.status === 'approved').length}
          </p>
          <span className="text-[11px] text-slate-500">Akses Penuh</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Anggota Aktif
          </span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1 font-mono">
            {users.filter((u) => u.role === 'anggota' && u.status === 'approved').length}
          </p>
          <span className="text-[11px] text-slate-500">Member Tim</span>
        </div>
      </div>

      {/* Tab Switcher: Pending Requests vs Active Whitelist */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTabSub('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabSub === 'pending'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Permohonan Akses Baru</span>
          {pendingUsers.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTabSub('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabSub === 'approved'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Daftar Pengguna & Whitelist Aktif</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
            {approvedUsers.length}
          </span>
        </button>
      </div>

      {/* Tab Content 1: Pending Queue */}
      {activeTabSub === 'pending' && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-slate-700">Tidak ada permohonan akses tertunda</p>
              <p className="text-slate-400 mt-1">
                Semua email yang mendaftar telah ditinjau oleh administrator.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-amber-200 shadow-xs p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Menunggu Persetujuan
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {user.registeredAt
                          ? new Date(user.registeredAt).toLocaleDateString('id-ID')
                          : 'Baru saja'}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {user.department || 'Digital Team'}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded ${
                              user.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            Minta: {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {user.reason && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                        "{user.reason}"
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => rejectUserAccess(user.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => approveUserAccess(user.id)}
                      className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Setujui Akses</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Approved Whitelist Table */}
      {activeTabSub === 'approved' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Departemen / Unit</th>
                  <th className="py-3 px-4 w-36">Peran Akses</th>
                  <th className="py-3 px-4 w-28">Status</th>
                  <th className="py-3 px-4 w-32">Login Terakhir</th>
                  <th className="py-3 px-4 w-24 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {approvedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-slate-600">
                        {user.department || 'Digital Banking'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {/* Direct Role Selector Dropdown */}
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                          user.role === 'admin'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        <option value="anggota">Anggota</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Aktif
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Belum pernah'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Cabut dan hapus akses akun email ${user.email}?`)) {
                              revokeUserAccess(user.id);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Hapus Akses"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
