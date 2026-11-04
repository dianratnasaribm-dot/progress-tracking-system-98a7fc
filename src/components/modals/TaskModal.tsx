import React, { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Task, TaskStatus } from '../../types';

export const TaskModal: React.FC = () => {
  const {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    taskToEdit,
    setTaskToEdit,
    projects,
    users,
    addTask,
    updateTask,
  } = useApp();

  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [jobDistribution, setJobDistribution] = useState('');
  const [subJobDistribution, setSubJobDistribution] = useState('');
  const [area, setArea] = useState('');
  const [frequency, setFrequency] = useState('Project');
  const [teamMember, setTeamMember] = useState('');
  const [startDate, setStartDate] = useState('');
  const [eta, setEta] = useState('');
  const [priority, setPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [progress, setProgress] = useState(0);
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setProjectId(taskToEdit.projectId);
      setJobDistribution(taskToEdit.jobDistribution);
      setSubJobDistribution(taskToEdit.subJobDistribution);
      setArea(taskToEdit.area);
      setFrequency(taskToEdit.frequency);
      setTeamMember(taskToEdit.teamMember);
      setStartDate(taskToEdit.startDate);
      setEta(taskToEdit.eta);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setProgress(taskToEdit.progress);
      setKeterangan(taskToEdit.keterangan);
    } else {
      setTitle('');
      setProjectId(projects[0]?.id || 'prj-utf');
      setJobDistribution(projects[0]?.title || 'User Trust & Fraud');
      setSubJobDistribution('');
      setArea('Onboarding');
      setFrequency('Project');
      setTeamMember(users[0]?.name || 'Luthfan');
      setStartDate(new Date().toISOString().slice(0, 10));
      setEta('2026-12-31');
      setPriority('Sedang');
      setStatus('todo');
      setProgress(0);
      setKeterangan('');
    }
  }, [taskToEdit, isNewTaskModalOpen, projects, users]);

  if (!isNewTaskModalOpen && !taskToEdit) return null;

  const handleClose = () => {
    setIsNewTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setProjectId(pId);
    const p = projects.find((prj) => prj.id === pId);
    if (p) {
      setJobDistribution(p.category || p.title);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedUser = users.find((u) => u.name.toLowerCase() === teamMember.toLowerCase()) || users[0];

    if (isEditing && taskToEdit) {
      updateTask({
        ...taskToEdit,
        title: title.trim(),
        projectId,
        projectTitle: projects.find((p) => p.id === projectId)?.title || jobDistribution,
        jobDistribution,
        subJobDistribution: subJobDistribution.trim(),
        area: area.trim(),
        frequency,
        teamMember,
        assignedToName: selectedUser?.name || teamMember,
        assignedToEmail: selectedUser?.email || `${teamMember.toLowerCase()}@organisasi.id`,
        assignedToAvatar: selectedUser?.avatar,
        startDate,
        dueDate: eta || '2026-12-31',
        eta,
        priority,
        status,
        progress: Number(progress),
        keterangan: keterangan.trim(),
      });
    } else {
      addTask({
        projectId,
        projectTitle: projects.find((p) => p.id === projectId)?.title || jobDistribution,
        jobDistribution,
        subJobDistribution: subJobDistribution.trim() || 'General',
        area: area.trim() || 'Feature Dev',
        frequency,
        teamMember,
        title: title.trim(),
        description: keterangan.trim(),
        assignedToName: selectedUser?.name || teamMember,
        assignedToEmail: selectedUser?.email || `${teamMember.toLowerCase()}@organisasi.id`,
        assignedToAvatar: selectedUser?.avatar,
        priority,
        status,
        progress: Number(progress),
        startDate: startDate || new Date().toISOString().slice(0, 10),
        dueDate: eta || '2026-12-31',
        eta: eta || '-',
        keterangan: keterangan.trim() || '-',
        estimatedHours: frequency === 'Project' ? 16 : 8,
        spentHours: Math.round((Number(progress) / 100) * (frequency === 'Project' ? 16 : 8)),
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isEditing ? 'Ubah Rincian Tugas' : 'Tambah Pekerjaan Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing ? 'Perbarui informasi pekerjaan dan penugasan' : 'Masukkan butir pekerjaan ke papan tracking tim'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              List of Work (Nama / Rincian Pekerjaan) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="contoh: Penyesuaian service /jalur blacklist gcn database..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Terkait Proyek
              </label>
              <select
                value={projectId}
                onChange={handleProjectChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Distribution
              </label>
              <input
                type="text"
                value={jobDistribution}
                onChange={(e) => setJobDistribution(e.target.value)}
                placeholder="contoh: Money Movement / CC"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sub-Job Distribution
              </label>
              <input
                type="text"
                value={subJobDistribution}
                onChange={(e) => setSubJobDistribution(e.target.value)}
                placeholder="contoh: Transfer Valas / QRIS"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="contoh: Improvement / Reporting"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Frekuensi Kegiatan
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Project">Project</option>
                <option value="Weekly Update">Weekly Update</option>
                <option value="Monthly Update">Monthly Update</option>
                <option value="Daily Routine">Daily Routine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIC / Anggota Tim
              </label>
              <select
                value={teamMember}
                onChange={(e) => setTeamMember(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="todo">Belum Mulai (Todo)</option>
                <option value="in_progress">Sedang Berjalan</option>
                <option value="review">Tahap Review / UAT</option>
                <option value="done">Selesai (Done)</option>
                <option value="dropped">Dibatalkan (Drop)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Selesai (ETA)
              </label>
              <input
                type="text"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                placeholder="W4 Sep / 15/11/2026"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan / Catatan Tambahan
            </label>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Catatan khusus, blocker, atau rujukan BRD/PRD..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan Pekerjaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
