import React, { useState, useEffect } from 'react';
import { X, Sliders, History, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { TaskStatus } from '../../types';

export const TaskProgressModal: React.FC = () => {
  const { activeTaskForProgress, setActiveTaskForProgress, updateTaskProgress } = useApp();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (activeTaskForProgress) {
      setProgress(activeTaskForProgress.progress);
      setStatus(activeTaskForProgress.status);
      setNote('');
      setSuccess(false);
    }
  }, [activeTaskForProgress]);

  if (!activeTaskForProgress) return null;

  const handleClose = () => {
    setActiveTaskForProgress(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaskProgress(
      activeTaskForProgress.id,
      progress,
      status,
      note.trim() || undefined
    );
    setSuccess(true);
    setTimeout(() => {
      handleClose();
    }, 700);
  };

  const setPreset = (val: number) => {
    setProgress(val);
    if (val === 100) setStatus('done');
    else if (val > 0 && status === 'todo') setStatus('in_progress');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Pembaruan Progres Tugas
            </h3>
            <p className="text-xs text-slate-500">
              Geser persentase penyelesaian & simpan riwayat log
            </p>
          </div>
        </div>

        {/* Task Summary Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {activeTaskForProgress.jobDistribution} · {activeTaskForProgress.subJobDistribution}
          </span>
          <h4 className="text-xs font-bold text-slate-900 mt-0.5">
            {activeTaskForProgress.title}
          </h4>
          <p className="text-[11px] text-slate-500 mt-1">
            PIC: <strong className="text-slate-700">{activeTaskForProgress.teamMember}</strong> | Target: {activeTaskForProgress.eta || activeTaskForProgress.dueDate}
          </p>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Progres tugas berhasil diperbarui dan tercatat di riwayat!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">Persentase Selesai</label>
              <span className="text-base font-extrabold text-emerald-600 font-mono">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => {
                const val = Number(e.target.value);
                setProgress(val);
                if (val === 100) setStatus('done');
                else if (val > 0 && status === 'todo') setStatus('in_progress');
              }}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            {/* Quick Presets */}
            <div className="flex gap-2 mt-2">
              {[0, 25, 50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPreset(val)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    progress === val
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Papan Kerja
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="todo">Belum Mulai (Todo)</option>
              <option value="in_progress">Sedang Berjalan (In Progress)</option>
              <option value="review">Tahap Review / UAT</option>
              <option value="done">Selesai (Done)</option>
              <option value="dropped">Dibatalkan (Drop)</option>
            </select>
          </div>

          {/* Progress Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Progres Terbaru
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="contoh: SIT selesai, lanjut pengujian UAT bersama tim produk..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Progress Logs History */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <History className="h-3.5 w-3.5 text-slate-400" />
              <span>Riwayat Pembaruan ({activeTaskForProgress.logs?.length || 0})</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {(!activeTaskForProgress.logs || activeTaskForProgress.logs.length === 0) ? (
                <p className="text-[11px] text-slate-400 italic">Belum ada riwayat catatan.</p>
              ) : (
                activeTaskForProgress.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]"
                  >
                    <div className="flex items-center justify-between text-slate-500 mb-0.5">
                      <span className="font-semibold text-slate-700">{log.updatedBy}</span>
                      <span>{new Date(log.timestamp).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p className="text-slate-600">{log.note}</p>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {log.previousProgress}% ➔ {log.newProgress}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
            >
              Simpan Progres
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
