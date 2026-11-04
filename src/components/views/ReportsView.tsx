import React, { useMemo } from 'react';
import {
  BarChart3,
  Download,
  Users,
  CheckCircle2,
  Clock,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { tasks, projects, users, exportDataToCSV } = useApp();

  // 1. Performance per Team Member
  const memberStats = useMemo(() => {
    const map = new Map<
      string,
      { name: string; avatar?: string; total: number; done: number; inProgress: number; avgProgress: number }
    >();

    tasks.forEach((t) => {
      const name = t.teamMember || 'Unassigned';
      if (!map.has(name)) {
        const u = users.find((user) => user.name.toLowerCase() === name.toLowerCase());
        map.set(name, {
          name,
          avatar: u?.avatar || t.assignedToAvatar,
          total: 0,
          done: 0,
          inProgress: 0,
          avgProgress: 0,
        });
      }
      const entry = map.get(name)!;
      entry.total += 1;
      if (t.status === 'done') entry.done += 1;
      if (t.status === 'in_progress') entry.inProgress += 1;
      entry.avgProgress += t.progress || 0;
    });

    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        avgProgress: Math.round(entry.avgProgress / (entry.total || 1)),
        completionRate: Math.round((entry.done / (entry.total || 1)) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, [tasks, users]);

  // 2. Status Distribution
  const statusStats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const dropped = tasks.filter((t) => t.status === 'dropped').length;
    return { done, inProgress, review, todo, dropped };
  }, [tasks]);

  // 3. Priority Distribution
  const priorityStats = useMemo(() => {
    const high = tasks.filter((t) => t.priority === 'Tinggi').length;
    const medium = tasks.filter((t) => t.priority === 'Sedang').length;
    const low = tasks.filter((t) => t.priority === 'Rendah').length;
    return { high, medium, low };
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                Laporan & Analitik Kinerja Tim
              </h1>
              <p className="text-xs text-slate-500">
                Distribusi beban kerja, rasio penyelesaian tugas, dan statistik kinerja per inisiatif
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={exportDataToCSV}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Download className="h-4 w-4 text-emerald-400" />
          <span>Ekspor Laporan CSV Lengkap</span>
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Penyelesaian Keseluruhan
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {Math.round(
                (statusStats.done / (tasks.length || 1)) * 100
              )}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              ({statusStats.done} dari {tasks.length} tugas selesai)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{
                width: `${Math.round((statusStats.done / (tasks.length || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tugas Aktif Berjalan
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600 font-mono">
              {statusStats.inProgress + statusStats.review}
            </span>
            <span className="text-xs text-slate-500">
              ({statusStats.inProgress} On Progress, {statusStats.review} Review/UAT)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Dipantau berkala melalui weekly/sprint review
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tingkat Prioritas Tinggi
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 font-mono">
              {priorityStats.high}
            </span>
            <span className="text-xs text-slate-500">
              Tugas Prioritas Tinggi
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            {priorityStats.medium} Sedang · {priorityStats.low} Rendah
          </p>
        </div>
      </div>

      {/* Member Workload Table & Progress Bars */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Beban Kerja & Kinerja Anggota Tim
            </h2>
            <p className="text-xs text-slate-500">
              Rincian jumlah butir tugas dan tingkat progres per orang
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">
                <th className="py-3 px-4">Anggota Tim (PIC)</th>
                <th className="py-3 px-4 w-28 text-center">Total Tugas</th>
                <th className="py-3 px-4 w-28 text-center">Selesai</th>
                <th className="py-3 px-4 w-32 text-center">On Progress</th>
                <th className="py-3 px-4 min-w-[200px]">Rata-rata Progres</th>
                <th className="py-3 px-4 w-28 text-right">Rasio Selesai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {memberStats.map((member) => (
                <tr key={member.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          member.avatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={member.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="font-bold text-slate-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                    {member.total}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                    {member.done}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-blue-600">
                    {member.inProgress}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${member.avgProgress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-700 w-10 text-right">
                        {member.avgProgress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {member.completionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
