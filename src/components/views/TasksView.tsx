import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Sliders,
  Filter,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Task, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    users,
    projects,
    currentUser,
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
    setSearchQuery,
    setIsNewTaskModalOpen,
    setIsUploadTasksModalOpen,
    setActiveTaskForProgress,
    setTaskToEdit,
    deleteTask,
    updateTaskProgress,
    exportDataToCSV,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [localSearch, setLocalSearch] = useState('');

  // Extract unique filter options
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
      const q = (localSearch || searchQuery).toLowerCase();
      if (q) {
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesJob = t.jobDistribution.toLowerCase().includes(q);
        const matchesMember = t.teamMember.toLowerCase().includes(q);
        const matchesSub = (t.subJobDistribution || '').toLowerCase().includes(q);
        const matchesArea = (t.area || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesJob && !matchesMember && !matchesSub && !matchesArea) {
          return false;
        }
      }
      if (filterMember !== 'all' && t.teamMember !== filterMember) return false;
      if (filterProject !== 'all' && t.jobDistribution !== filterProject) return false;
      if (filterFrequency !== 'all' && t.frequency !== filterFrequency) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      return true;
    });
  }, [tasks, localSearch, searchQuery, filterMember, filterProject, filterFrequency, filterPriority, filterStatus]);

  // Kanban Columns
  const kanbanColumns: { id: TaskStatus; label: string; color: string; badge: string }[] = [
    { id: 'todo', label: 'Belum Mulai', color: 'border-slate-300', badge: 'bg-slate-100 text-slate-700' },
    { id: 'in_progress', label: 'Sedang Berjalan', color: 'border-blue-300', badge: 'bg-blue-100 text-blue-800' },
    { id: 'review', label: 'Review / UAT', color: 'border-amber-300', badge: 'bg-amber-100 text-amber-800' },
    { id: 'done', label: 'Selesai', color: 'border-emerald-300', badge: 'bg-emerald-100 text-emerald-800' },
    { id: 'dropped', label: 'Dibatalkan', color: 'border-rose-300', badge: 'bg-rose-100 text-rose-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                Papan Tugas & Tracking Pekerjaan
              </h1>
              <p className="text-xs text-slate-500">
                {tasks.length} butir tugas terdaftar · Pantau progres & distribusikan penugasan
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Tambah Pekerjaan</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setIsUploadTasksModalOpen(true)}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 flex items-center gap-1.5 transition-all"
              title="Impor Massal dari CSV"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Impor CSV</span>
            </button>
          )}

          <button
            onClick={exportDataToCSV}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all"
            title="Download CSV"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Ekspor</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari kata kunci, sub-job, atau PIC..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Ditemukan <strong className="text-slate-800">{filteredTasks.length}</strong> butir pekerjaan
            </span>
            {(filterMember !== 'all' ||
              filterProject !== 'all' ||
              filterFrequency !== 'all' ||
              filterPriority !== 'all' ||
              filterStatus !== 'all' ||
              localSearch) && (
              <button
                onClick={() => {
                  setFilterMember('all');
                  setFilterProject('all');
                  setFilterFrequency('all');
                  setFilterPriority('all');
                  setFilterStatus('all');
                  setLocalSearch('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Anggota Tim (PIC)
            </label>
            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua PIC</option>
              {uniqueMembers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Job Distribution
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Job</option>
              {uniqueJobDists.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Frekuensi
            </label>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Frekuensi</option>
              <option value="Project">Project</option>
              <option value="Weekly Update">Weekly Update</option>
              <option value="Monthly Update">Monthly Update</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Prioritas
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Prioritas</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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

      {/* View Mode 1: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3">Job & Sub-Job</th>
                  <th className="py-3 px-3">Area</th>
                  <th className="py-3 px-3">Frekuensi</th>
                  <th className="py-3 px-3">PIC</th>
                  <th className="py-3 px-3 min-w-[280px]">List of Work (Tugas)</th>
                  <th className="py-3 px-3 w-28">Target (ETA)</th>
                  <th className="py-3 px-3 w-24">Prioritas</th>
                  <th className="py-3 px-3 w-32">Status & Progres</th>
                  <th className="py-3 px-3 w-20 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      Tidak ada butir pekerjaan yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, idx) => {
                    const isDone = task.status === 'done';
                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {task.no || idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                            {task.jobDistribution}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                            {task.subJobDistribution || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-slate-600 block truncate max-w-[110px]">
                            {task.area || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                            {task.frequency}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={task.assignedToAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                              alt={task.teamMember}
                              className="h-5 w-5 rounded-full object-cover shrink-0"
                            />
                            <span className="font-bold text-slate-800 text-[11px]">
                              {task.teamMember}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900 leading-snug">
                            {task.title}
                          </p>
                          {task.keterangan && task.keterangan !== '-' && (
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                              {task.keterangan}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 text-[11px] font-medium">
                          {task.eta || task.dueDate || '-'}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              task.priority === 'Tinggi'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : task.priority === 'Sedang'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveTaskForProgress(task)}
                              className="group/btn flex items-center gap-1.5 text-left"
                              title="Klik untuk mengubah progres"
                            >
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full transition-all ${
                                    isDone ? 'bg-emerald-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="font-mono text-[11px] font-bold text-slate-700 group-hover/btn:text-emerald-600">
                                {task.progress}%
                              </span>
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setActiveTaskForProgress(task)}
                              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              title="Update Progres"
                            >
                              <Sliders className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setTaskToEdit(task)}
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              title="Edit Tugas"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus tugas "${task.title}"?`)) {
                                  deleteTask(task.id);
                                }
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Hapus Tugas"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{col.label}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${col.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-white/50 rounded-xl border border-dashed border-slate-200">
                      Kosong
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {task.jobDistribution}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              task.priority === 'Tinggi'
                                ? 'bg-rose-50 text-rose-700'
                                : task.priority === 'Sedang'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {task.title}
                        </h4>

                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              task.status === 'done' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <img
                              src={task.assignedToAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                              alt={task.teamMember}
                              className="h-4 w-4 rounded-full object-cover"
                            />
                            {task.teamMember}
                          </span>
                          <span className="font-mono font-bold text-slate-800">
                            {task.progress}%
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => setActiveTaskForProgress(task)}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <Sliders className="h-3 w-3" />
                            Update
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setTaskToEdit(task)}
                              className="p-1 rounded text-slate-400 hover:text-slate-600"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus tugas "${task.title}"?`)) {
                                  deleteTask(task.id);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
