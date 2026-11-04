import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import { AppProvider, useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { OverviewView } from '../components/views/OverviewView';
import { ProjectsView } from '../components/views/ProjectsView';
import { TasksView } from '../components/views/TasksView';
import { AccessView } from '../components/views/AccessView';
import { ReportsView } from '../components/views/ReportsView';
import { LandingView } from '../components/views/LandingView';

import { LoginModal } from '../components/modals/LoginModal';
import { RegisterModal } from '../components/modals/RegisterModal';
import { InviteModal } from '../components/modals/InviteModal';
import { ProjectModal } from '../components/modals/ProjectModal';
import { TaskModal } from '../components/modals/TaskModal';
import { TaskProgressModal } from '../components/modals/TaskProgressModal';
import { BulkUploadModal } from '../components/modals/BulkUploadModal';
import { WorkspaceModal } from '../components/modals/WorkspaceModal';

export const Route = createFileRoute('/')({
  component: AppRoot,
});

function AppRoot() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

function MainApp() {
  const { currentUser, activeTab, setActiveTab, users } = useApp();

  const pendingRequests = users.filter((u) => u.status === 'pending').length;

  // Protect access tab from non-admins
  useEffect(() => {
    if (activeTab === 'access' && currentUser?.role !== 'admin') {
      setActiveTab('overview');
    }
  }, [activeTab, currentUser?.role, setActiveTab]);

  const mobileNavItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'projects', label: 'Proyek', icon: Briefcase },
    { id: 'tasks', label: 'Tugas', icon: CheckSquare },
    ...(currentUser?.role === 'admin'
      ? [
          {
            id: 'access',
            label: 'Akses',
            icon: ShieldCheck,
            badge: pendingRequests > 0 ? pendingRequests : undefined,
          },
        ]
      : []),
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Brand Navbar */}
      <Navbar />

      {currentUser ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Active View Container */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            {activeTab === 'overview' && <OverviewView />}
            {activeTab === 'projects' && <ProjectsView />}
            {activeTab === 'tasks' && <TasksView />}
            {activeTab === 'access' && <AccessView />}
            {activeTab === 'reports' && <ReportsView />}
          </main>
        </div>
      ) : (
        <main className="flex-1 flex items-center justify-center p-4">
          <LandingView />
        </main>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {currentUser && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative flex flex-col items-center py-1 px-3 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="absolute top-0 right-1 px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-amber-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Dialog Modals */}
      <LoginModal />
      <RegisterModal />
      <InviteModal />
      <ProjectModal />
      <TaskModal />
      <TaskProgressModal />
      <BulkUploadModal />
      <WorkspaceModal />
    </div>
  );
}
