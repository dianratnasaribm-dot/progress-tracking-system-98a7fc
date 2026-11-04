import React, { useState } from 'react';
import { X, Building2, Plus, Check, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkspaceModal: React.FC = () => {
  const {
    isWorkspaceModalOpen,
    setIsWorkspaceModalOpen,
    workspace,
    workspaces,
    switchWorkspace,
    createWorkspace,
  } = useApp();

  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isWorkspaceModalOpen) return null;

  const handleClose = () => {
    setIsWorkspaceModalOpen(false);
    setIsCreating(false);
    setNewWsName('');
    setNewWsDesc('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    createWorkspace(newWsName.trim(), newWsDesc.trim() || undefined);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Pilih atau Buat Workspace Tim
            </h3>
            <p className="text-xs text-slate-500">
              Setiap workspace memiliki data proyek, tugas, dan anggota tersendiri
            </p>
          </div>
        </div>

        {!isCreating ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Daftar Workspace Tersedia</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {workspaces.map((ws) => {
                  const isActive = ws.id === workspace.id;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => {
                        switchWorkspace(ws.id);
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Layers className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {ws.name}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {ws.description || 'Workspace kolaborasi tim'}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          <Check className="h-3 w-3" />
                          Aktif
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Workspace Baru untuk Organisasi / Tim Lain</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Organisasi / Tim / Workspace <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                placeholder="contoh: Squad Fintech Innovation / PT Maju Digital"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Workspace
              </label>
              <textarea
                rows={2}
                value={newWsDesc}
                onChange={(e) => setNewWsDesc(e.target.value)}
                placeholder="Jelaskan tujuan atau divisi dari workspace ini..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Buat & Gunakan Workspace</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
