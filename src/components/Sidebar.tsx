import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  ShieldCheck,
  BarChart3,
  UserPlus,
  PlusCircle,
  FileSpreadsheet,
  Building2,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ActiveTab } from '../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    users,
    projects,
    tasks,
    setIsInviteModalOpen,
    setIsNewProjectModalOpen,
    setIsNewTaskModalOpen,
    setIsUploadTasksModalOpen,
    setIsWorkspaceModalOpen,
    workspace,
  } = useApp();

  const pendingRequestsCount = users.filter((u) => u.status === 'pending').length;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; adminOnly?: boolean }[] = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'projects', label: 'Proyek & Roadmap', icon: Briefcase, badge: projects.length },
    { id: 'tasks', label: 'Papan Tugas', icon: CheckSquare, badge: tasks.length },
    {
      id: 'access',
      label: 'Manajemen Akses',
      icon: ShieldCheck,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      adminOnly: true,
    },
    { id: 'reports', label: 'Laporan & Kinerja', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Current Workspace Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Tim
          </span>
          <button
            onClick={() => setIsWorkspaceModalOpen(true)}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Ganti
          </button>
        </div>
        <p className="text-xs font-bold text-slate-900 mt-1 truncate">{workspace.name}</p>
        <p className="text-[11px] text-slate-500 line-clamp-1">{workspace.description}</p>
      </div>

      {/* Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Menu Navigasi
        </p>
        {navItems.map((item) => {
          if (item.adminOnly && currentUser?.role !== 'admin') return null;
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? 'bg-slate-800 text-emerald-300'
                      : item.id === 'access' && pendingRequestsCount > 0
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Aksi Cepat
        </p>

        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4 text-emerald-600" />
          <span>Tambah Pekerjaan</span>
        </button>

        {currentUser?.role === 'admin' && (
          <>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-blue-600" />
              <span>Tambah Proyek Baru</span>
            </button>

            <button
              onClick={() => setIsUploadTasksModalOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-purple-600" />
              <span>Impor Massal (CSV)</span>
            </button>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 text-amber-600" />
              <span>Undang / Whitelist Email</span>
            </button>
          </>
        )}
      </div>

      {/* Active Team Preview */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>Anggota Terdaftar</span>
          </div>
          <span className="text-[11px] font-bold text-slate-700">{users.length}</span>
        </div>
        <div className="flex -space-x-1.5 overflow-hidden py-1 px-1">
          {users.slice(0, 7).map((u) => (
            <img
              key={u.id}
              src={u.avatar}
              alt={u.name}
              title={`${u.name} (${u.role})`}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
            />
          ))}
          {users.length > 7 && (
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 ring-2 ring-white">
              +{users.length - 7}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
