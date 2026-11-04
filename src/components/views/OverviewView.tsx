import React, { useMemo } from 'react';
import {
  Briefcase,
  CheckSquare,
  TrendingUp,
  Users,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  UserCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OverviewView: React.FC = () => {
  const {
    workspace,
    currentUser,
    projects,
    tasks,
    users,
    activityLogs,
    filterMember,
    filterProject,
    filterFrequency,
    filterPriority,
    filterStatus,
    searchQuery,
    setFilterMember,
    setFilterProject,
    setFilterFrequency,
    setFilterPriority,
    setFilterStatus,
    setIsNewProjectModalOpen,
    setIsNewTaskModalOpen,
    setIsUploadTasksModalOpen,
    setActiveTaskForProgress,
    setTaskToEdit,
    exportDataToCSV,
    setActiveTab,
  } = useApp();

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  const avgProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const sum = tasks.reduce((acc, t) => acc + (t.progress || 0), 0);
    return Math.round(sum / tasks.length);
  }, [tasks]);

  const activeMembers = useMemo(() => {
    return users.filter((u) => u.status === 'approved');
  }, [users]);

  // Unique filters
  const uniqueJobDists = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.jobDistribution) set.add(t.jobDistribution);
    });
    return Array.from(set);
  }, [tasks]);

  const uniqueMembers = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.teamMember) set.add(t.teamMember);
    });
    return Array.from(set);
  }, [tasks]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesJob = t.jobDistribution.toLowerCase().includes(q);
        const matchesMember = t.teamMember.toLowerCase().includes(q);
        const matchesSub = (t.subJobDistribution || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesJob && !matchesMember && !matchesSub) return false;
      }
      if (filterMember !== 'all' && t.teamMember !== filterMember) return false;
      if (filterProject !== 'all' && t.jobDistribution !== filterProject) return false;
      if (filterFrequency !== 'all' && t.frequency !== filterFrequency) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      return true;
    });
  }, [tasks, searchQuery, filterMember, filterProject, filterFrequency, filterPriority, filterStatus]);

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                {currentUser?.role === 'admin'
                  ? 'Ringkasan Eksekutif & Manajemen'
                  : 'Workspace Anggota Tim'}
              </span>
              <span className="text-xs text-slate-400">· {todayStr}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Selamat datang, {currentUser?.name || 'Tamu'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {workspace.description ||
                'Sistem Tracking Progres & Manajemen Akses: Pantau portofolio proyek, progres butir tugas harian, dan koordinasi tim terpusat.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Tambah Pekerjaan</span>
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                <span>Tambah Proyek</span>
              </button>
            )}
            <button
              onClick={exportDataToCSV}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Unduh Laporan dalam format CSV"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Proyek */}
        <div
          onClick={() => setActiveTab('projects')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Proyek
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {projects.length}
            </span>
            <span className="text-xs text-slate-500">Inisiatif Aktif</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-2 flex items-center gap-1">
            <span>Lihat Roadmap & Milestones</span>
            <ArrowUpRight className="h-3 w-3" />
          </p>
        </div>

        {/* Total Butir Tugas */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Butir Tugas
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {totalTasks}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {completedTasks} Selesai
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {inProgressTasks} On Progress · {todoTasks} Belum Mulai
          </p>
        </div>

        {/* Rata-rata Progres */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rata-rata Progres
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {avgProgress}%
            </span>
            <span className="text-xs text-slate-500">Tingkat Pencapaian</span>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        {/* Anggota Tim */}
        <div
          onClick={() => currentUser?.role === 'admin' && setActiveTab('access')}
          className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-xs transition-all ${
            currentUser?.role === 'admin'
              ? 'hover:border-purple-300 hover:shadow-md cursor-pointer'
              : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Anggota Tim
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {activeMembers.length}
            </span>
            <span className="text-xs text-slate-500">User Terdaftar</span>
          </div>
          <div className="mt-3 flex -space-x-1 overflow-hidden">
            {activeMembers.slice(0, 5).map((u) => (
              <img
                key={u.id}
                src={u.avatar}
                alt={u.name}
                title={u.name}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-800">
              Filter Papan & Butir Pekerjaan
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              (Menampilkan {filteredTasks.length} dari {tasks.length} butir)
            </span>
          </div>
          {(filterMember !== 'all' ||
            filterProject !== 'all' ||
            filterFrequency !== 'all' ||
            filterPriority !== 'all' ||
            filterStatus !== 'all') && (
            <button
              onClick={() => {
                setFilterMember('all');
                setFilterProject('all');
                setFilterFrequency('all');
                setFilterPriority('all');
                setFilterStatus('all');
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Member */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Anggota Tim (PIC)
            </label>
            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Anggota</option>
              {uniqueMembers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Job Distribution */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Job Distribution
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Area</option>
              {uniqueJobDists.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          {/* Frekuensi */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Frekuensi
            </label>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Frekuensi</option>
              <option value="Project">Project</option>
              <option value="Weekly Update">Weekly Update</option>
              <option value="Monthly Update">Monthly Update</option>
            </select>
          </div>

          {/* Prioritas */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Prioritas
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Prioritas</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="todo">Belum Mulai</option>
              <option value="in_progress">Sedang Berjalan</option>
              <option value="review">Review / UAT</option>
              <option value="done">Selesai</option>
              <option value="dropped">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Quick Tasks Update List & Project Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Tasks Tracking & Update Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pembaruan Cepat Progres Tugas
              </h2>
              <p className="text-xs text-slate-500">
                Klik tombol slider untuk memperbarui persentase penyelesaian
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Buka Papan Tugas Lengkap</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Tidak ada butir pekerjaan yang sesuai dengan filter pencarian.
              </div>
            ) : (
              filteredTasks.slice(0, 8).map((task) => {
                const isDone = task.status === 'done';
                return (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {task.jobDistribution}
                        </span>
                        {task.subJobDistribution && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            · {task.subJobDistribution}
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                            task.priority === 'Tinggi'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : task.priority === 'Sedang'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-50 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {task.frequency}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <img
                            src={task.assignedToAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                            alt={task.teamMember}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                          {task.teamMember}
                        </span>
                        <span>· ETA: {task.eta || task.dueDate}</span>
                      </div>
                    </div>

                    {/* Progress Slider Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {task.progress}%
                        </span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              isDone ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTaskForProgress(task)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Update Progres"
                      >
                        <Sliders className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Update</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Projects Summary & Recent Activities */}
        <div className="space-y-6">
          {/* Projects Roadmap Snapshot */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">
                Portofolio Proyek ({projects.length})
              </h3>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 truncate max-w-[170px]">
                      {p.title}
                    </span>
                    <span className="font-mono font-bold text-emerald-600">
                      {p.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>PIC: {p.leadName}</span>
                    <span>{p.milestones?.filter((m) => m.completed).length || 0}/{p.milestones?.length || 0} Milestone</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Audit Stream */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">
              Riwayat Aktivitas Terbaru
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-700">{log.actorName}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="font-bold text-slate-800 text-[11px]">{log.action}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{log.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
