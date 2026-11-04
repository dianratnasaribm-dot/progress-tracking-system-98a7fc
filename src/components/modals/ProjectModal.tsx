import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Project, Milestone } from '../../types';

export const ProjectModal: React.FC = () => {
  const {
    isNewProjectModalOpen,
    setIsNewProjectModalOpen,
    projectToEdit,
    setProjectToEdit,
    addProject,
    updateProject,
  } = useApp();

  const isEditing = Boolean(projectToEdit);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
  const [status, setStatus] = useState<'Aktif' | 'Hold' | 'Selesai'>('Aktif');
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setCode(projectToEdit.code);
      setDescription(projectToEdit.description);
      setCategory(projectToEdit.category);
      setPriority(projectToEdit.priority);
      setStatus(projectToEdit.status);
      setProgress(projectToEdit.progress);
      setStartDate(projectToEdit.startDate);
      setDueDate(projectToEdit.dueDate);
      setBudget(projectToEdit.budget);
      setSpent(projectToEdit.spent);
      setLeadName(projectToEdit.leadName);
      setLeadEmail(projectToEdit.leadEmail);
      setTagsStr((projectToEdit.tags || []).join(', '));
      setMilestones(projectToEdit.milestones || []);
    } else {
      setTitle('');
      setCode('');
      setDescription('');
      setCategory('Digital Banking');
      setPriority('Sedang');
      setStatus('Aktif');
      setProgress(0);
      setStartDate(new Date().toISOString().slice(0, 10));
      setDueDate('2026-12-31');
      setBudget(50000000);
      setSpent(0);
      setLeadName('');
      setLeadEmail('');
      setTagsStr('');
      setMilestones([]);
    }
  }, [projectToEdit, isNewProjectModalOpen]);

  if (!isNewProjectModalOpen && !projectToEdit) return null;

  const handleClose = () => {
    setIsNewProjectModalOpen(false);
    setProjectToEdit(null);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const newM: Milestone = {
      id: `m-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      dueDate: newMilestoneDate || 'TBD',
      completed: false,
    };
    setMilestones([...milestones, newM]);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEditing && projectToEdit) {
      updateProject({
        ...projectToEdit,
        title: title.trim(),
        code: code.trim().toUpperCase() || 'PRJ',
        description: description.trim(),
        category: category.trim(),
        priority,
        status,
        progress: Number(progress),
        startDate,
        dueDate,
        budget: Number(budget),
        spent: Number(spent),
        leadName: leadName.trim(),
        leadEmail: leadEmail.trim(),
        tags,
        milestones,
      });
    } else {
      addProject({
        title: title.trim(),
        code: code.trim().toUpperCase() || 'PRJ',
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
        status,
        progress: Number(progress),
        startDate,
        dueDate,
        budget: Number(budget),
        spent: Number(spent),
        leadName: leadName.trim() || 'Project Lead',
        leadEmail: leadEmail.trim() || 'lead@organisasi.id',
        tags,
        milestones,
        assignedMembers: [],
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isEditing ? 'Ubah Informasi Proyek' : 'Tambah Proyek Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing ? 'Perbarui milestone, target waktu, dan detail proyek' : 'Buat inisiatif atau roadmap proyek baru untuk tim'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama / Judul Proyek <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="contoh: M-Smile Revamp Migration"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode / Inisial
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="contoh: MSMILE"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Proyek
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan dan ruang lingkup inisiatif ini..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="contoh: Payments / ATM"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Tinggi">Tinggi (High)</option>
                <option value="Sedang">Sedang (Medium)</option>
                <option value="Rendah">Rendah (Low)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Hold">Ditunda / Hold</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Selesai (Due Date)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIC / Project Lead
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="contoh: Hadi / Nico"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email PIC
              </label>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="contoh: hadi@bankmega.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Label / Tags (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="contoh: Sprint Squad 1-4, Tap to Pay, Security"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Milestones list */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Milestone Proyek
            </label>
            <div className="space-y-2 mb-3">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={m.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'}>
                      {m.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                      {m.dueDate}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Judul milestone (contoh: UAT Piloting Squad 3)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <input
                type="text"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                placeholder="Target (W4 Sep)"
                className="w-28 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
              {isEditing ? 'Simpan Perubahan' : 'Buat Proyek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
