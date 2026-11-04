import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Tag,
  Users,
  Edit2,
  Trash2,
  Sliders,
  Check,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    currentUser,
    setIsNewProjectModalOpen,
    setProjectToEdit,
    deleteProject,
    toggleMilestone,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCode = p.code.toLowerCase().includes(q);
        const matchesLead = p.leadName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCode && !matchesLead) return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      return true;
    });
  }, [projects, search, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                Portofolio Proyek & Roadmap Inisiatif
              </h1>
              <p className="text-xs text-slate-500">
                Lacak status, milestone, target waktu, dan penanggung jawab seluruh inisiatif
              </p>
            </div>
          </div>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <PlusCircle className="h-4 w-4 text-emerald-400" />
            <span>Tambah Proyek Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua ({projects.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari inisiatif proyek..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const completedMilestones =
            project.milestones?.filter((m) => m.completed).length || 0;
          const totalMilestones = project.milestones?.length || 0;

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Code, Priority, Actions */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {project.code || 'PRJ'}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        project.priority === 'Tinggi'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : project.priority === 'Sedang'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {project.priority}
                    </span>
                  </div>

                  {currentUser?.role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setProjectToEdit(project)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Edit Proyek"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(`Hapus proyek "${project.title}" beserta tugas terkait?`)
                          ) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-600">Progres Inisiatif</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                {totalMilestones > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2">
                      <span>Milestones</span>
                      <span className="text-slate-400 font-normal">
                        {completedMilestones}/{totalMilestones} selesai
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {project.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(project.id, m.id)}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs group transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`h-4 w-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                                m.completed
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-slate-300 group-hover:border-emerald-500'
                              }`}
                            >
                              {m.completed && <Check className="h-3 w-3" />}
                            </div>
                            <span
                              className={`truncate text-[11px] ${
                                m.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-700 font-medium'
                              }`}
                            >
                              {m.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {m.dueDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer: Lead, Dates, Tags */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>PIC: {project.leadName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{project.dueDate || 'Desember 2026'}</span>
                  </div>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-50 text-slate-500 border border-slate-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
