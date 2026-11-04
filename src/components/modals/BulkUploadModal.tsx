import React, { useState } from 'react';
import { X, FileSpreadsheet, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BulkUploadModal: React.FC = () => {
  const { isUploadTasksModalOpen, setIsUploadTasksModalOpen, bulkAddTasks, projects, users } = useApp();

  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);

  if (!isUploadTasksModalOpen) return null;

  const handleClose = () => {
    setIsUploadTasksModalOpen(false);
    setRawText('');
    setError('');
    setParsedPreview([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    setError('');
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setError('Data CSV kosong atau tidak memiliki baris data.');
      setParsedPreview([]);
      return;
    }

    const items: any[] = [];
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      // simple CSV quote regex
      const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
      const cleanCols = matches.map((c) => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

      const title = cleanCols[6] || cleanCols[0] || `Tugas Baru #${i}`;
      const jobDist = cleanCols[1] || 'General';
      const subJob = cleanCols[2] || '-';
      const area = cleanCols[3] || 'Task';
      const freq = cleanCols[4] || 'Project';
      const member = cleanCols[5] || users[0]?.name || 'Anggota Tim';
      const eta = cleanCols[8] || '2026-12-31';
      const prio = cleanCols[9] || 'Sedang';
      const rawStatus = (cleanCols[10] || 'todo').toLowerCase();

      let status = 'todo';
      let progress = 0;
      if (rawStatus.includes('done') || rawStatus.includes('selesai')) {
        status = 'done';
        progress = 100;
      } else if (rawStatus.includes('progress') || rawStatus.includes('jalan')) {
        status = 'in_progress';
        progress = 60;
      } else if (rawStatus.includes('review') || rawStatus.includes('uat')) {
        status = 'review';
        progress = 85;
      }

      const matchingProject = projects.find((p) =>
        p.title.toLowerCase().includes(jobDist.toLowerCase())
      ) || projects[0];

      const matchingUser = users.find((u) =>
        u.name.toLowerCase().includes(member.toLowerCase())
      ) || users[0];

      items.push({
        projectId: matchingProject?.id || 'prj-utf',
        projectTitle: matchingProject?.title || jobDist,
        jobDistribution: jobDist,
        subJobDistribution: subJob,
        area,
        frequency: freq,
        teamMember: matchingUser?.name || member,
        title,
        description: cleanCols[11] || '',
        assignedToName: matchingUser?.name || member,
        assignedToEmail: matchingUser?.email || 'team@organisasi.id',
        assignedToAvatar: matchingUser?.avatar,
        priority: prio.includes('High') || prio.includes('Tinggi') ? 'Tinggi' : prio.includes('Low') || prio.includes('Rendah') ? 'Rendah' : 'Sedang',
        status,
        progress,
        startDate: cleanCols[7] || new Date().toISOString().slice(0, 10),
        dueDate: eta,
        eta,
        keterangan: cleanCols[11] || '-',
        estimatedHours: freq === 'Project' ? 16 : 8,
        spentHours: Math.round((progress / 100) * (freq === 'Project' ? 16 : 8)),
      });
    }

    setParsedPreview(items);
  };

  const handleImport = () => {
    if (parsedPreview.length === 0) {
      setError('Tidak ada data tugas yang valid untuk diimpor.');
      return;
    }

    bulkAddTasks(parsedPreview);
    handleClose();
  };

  const sampleTemplate = `No,Job Distribution,Sub-Job Distribution,Area,Frekuensi Kegiatan,Team Member,List of work,Waktu Mulai,ETA (Waktu Selesai),Prioritas,Status,Keterangan
1,"User Trust & Fraud","Onboarding","Improvement","Project","Luthfan","Integrasi Blacklist GCN Database","01/08/2026","30/09/2026","Tinggi","On Progress","Pengayaan data watchlist"
2,"Money Movement","Transfer Valas","Product Dev","Project","Nico","Phase 2 - 24/7 Valas","15/08/2026","31/12/2026","Tinggi","On Progress","Target Live Q4"`;

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Impor Massal Butir Tugas
            </h3>
            <p className="text-xs text-slate-500">
              Unggah file CSV atau tempelkan data spreadsheet
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer relative">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              Klik atau seret file CSV ke sini
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Mendukung format file CSV dengan delimiter koma (,)
            </p>
          </div>

          {/* Paste CSV text area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Atau Tempelkan Teks CSV
              </label>
              <button
                type="button"
                onClick={() => {
                  setRawText(sampleTemplate);
                  parseCSV(sampleTemplate);
                }}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
              >
                Gunakan Contoh Format
              </button>
            </div>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                parseCSV(e.target.value);
              }}
              placeholder="No,Job Distribution,Sub-Job Distribution,Area,Frekuensi Kegiatan,Team Member,List of work,..."
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Preview Table */}
          {parsedPreview.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">
                  Pratinjau Impor ({parsedPreview.length} tugas ditemukan)
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Siap diimpor
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {parsedPreview.slice(0, 10).map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.jobDistribution} · PIC: {item.teamMember} · Prioritas: {item.priority}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold uppercase text-slate-600 shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
                {parsedPreview.length > 10 && (
                  <div className="p-2 text-center text-[11px] text-slate-400 font-medium">
                    ... dan {parsedPreview.length - 10} tugas lainnya
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={parsedPreview.length === 0}
              onClick={handleImport}
              className={`px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all flex items-center gap-1.5 ${
                parsedPreview.length > 0
                  ? 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Impor {parsedPreview.length} Tugas Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
