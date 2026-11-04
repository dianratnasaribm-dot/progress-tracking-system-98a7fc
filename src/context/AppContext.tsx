import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type {
  User,
  Project,
  Task,
  ActivityLog,
  Notification,
  Workspace,
  Role,
  TaskStatus,
  ActiveTab,
} from '../types';
import {
  DEFAULT_WORKSPACE,
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

const STORAGE_KEYS = {
  WORKSPACE: 'pp_active_workspace_v5',
  WORKSPACES: 'pp_workspaces_v5',
  USERS: 'pp_users_v5',
  CURRENT_USER_ID: 'pp_current_user_id_v5',
  PROJECTS: 'pp_projects_v5',
  TASKS: 'pp_tasks_v5',
  LOGS: 'pp_logs_v5',
  NOTIFICATIONS: 'pp_notifications_v5',
};

interface AppContextType {
  workspace: Workspace;
  workspaces: Workspace[];
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  activeTab: ActiveTab;
  searchQuery: string;
  filterMember: string;
  filterProject: string;
  filterFrequency: string;
  filterPriority: string;
  filterStatus: string;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  isInviteModalOpen: boolean;
  isWorkspaceModalOpen: boolean;
  isNewProjectModalOpen: boolean;
  isNewTaskModalOpen: boolean;
  isUploadTasksModalOpen: boolean;
  activeTaskForProgress: Task | null;
  projectToEdit: Project | null;
  taskToEdit: Task | null;
  
  // Setters
  setActiveTab: (tab: ActiveTab) => void;
  setSearchQuery: (q: string) => void;
  setFilterMember: (m: string) => void;
  setFilterProject: (p: string) => void;
  setFilterFrequency: (f: string) => void;
  setFilterPriority: (p: string) => void;
  setFilterStatus: (s: string) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  setIsRegisterModalOpen: (open: boolean) => void;
  setIsInviteModalOpen: (open: boolean) => void;
  setIsWorkspaceModalOpen: (open: boolean) => void;
  setIsNewProjectModalOpen: (open: boolean) => void;
  setIsNewTaskModalOpen: (open: boolean) => void;
  setIsUploadTasksModalOpen: (open: boolean) => void;
  setActiveTaskForProgress: (task: Task | null) => void;
  setProjectToEdit: (project: Project | null) => void;
  setTaskToEdit: (task: Task | null) => void;

  // Actions
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, description?: string) => Workspace;
  switchUser: (user: User) => void;
  logout: () => void;
  loginWithEmail: (email: string) => { success: boolean; message: string; user?: User; status?: string };
  registerEmailAccess: (data: {
    name: string;
    email: string;
    role: Role;
    department: string;
    phone?: string;
    reason: string;
  }) => { success: boolean; message: string };
  approveUserAccess: (userId: string) => void;
  rejectUserAccess: (userId: string) => void;
  updateUserRole: (userId: string, newRole: Role) => void;
  revokeUserAccess: (userId: string) => void;
  whitelistEmailDirect: (data: { name: string; email: string; role: Role; department?: string }) => void;
  addProject: (data: Omit<Project, 'id'>) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addTask: (data: Omit<Task, 'id' | 'logs'>) => Task;
  bulkAddTasks: (rawTasks: any[]) => { success: boolean; count: number };
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTaskProgress: (taskId: string, progress: number, status?: TaskStatus, note?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  exportDataToCSV: () => void;
  resetToDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Workspaces State
  const [workspacesList, setWorkspacesList] = useState<Workspace[]>(() => {
    if (typeof window === 'undefined') return [DEFAULT_WORKSPACE];
    const saved = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [DEFAULT_WORKSPACE];
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_WORKSPACE.id;
    return localStorage.getItem(STORAGE_KEYS.WORKSPACE) || DEFAULT_WORKSPACE.id;
  });

  const activeWorkspace = useMemo(() => {
    return (
      workspacesList.find((w) => w.id === activeWorkspaceId) ||
      workspacesList[0] ||
      DEFAULT_WORKSPACE
    );
  }, [workspacesList, activeWorkspaceId]);

  // 2. Users State
  const [usersList, setUsersList] = useState<User[]>(() => {
    if (typeof window === 'undefined') return INITIAL_USERS;
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return 'usr-1';
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved !== null ? (saved === '' ? null : saved) : 'usr-1';
  });

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return usersList.find((u) => u.id === currentUserId) || null;
  }, [usersList, currentUserId]);

  // 3. Projects State
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PROJECTS;
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PROJECTS;
  });

  // 4. Tasks State
  const [tasksList, setTasksList] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TASKS;
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TASKS;
  });

  // 5. Activity Logs State
  const [logsList, setLogsList] = useState<ActivityLog[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ACTIVITY_LOGS;
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // 6. Notifications State
  const [notificationsList, setNotificationsList] = useState<Notification[]>(() => {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Navigation & Filters
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isUploadTasksModalOpen, setIsUploadTasksModalOpen] = useState(false);
  const [activeTaskForProgress, setActiveTaskForProgress] = useState<Task | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspacesList));
    }
  }, [workspacesList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WORKSPACE, activeWorkspaceId);
    }
  }, [activeWorkspaceId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersList));
    }
  }, [usersList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId || '');
    }
  }, [currentUserId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsList));
    }
  }, [projectsList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksList));
    }
  }, [tasksList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logsList));
    }
  }, [logsList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationsList));
    }
  }, [notificationsList]);

  // Background Database Sync on Mount
  useEffect(() => {
    const fetchFromDb = async () => {
      try {
        const res = await fetch(`/api/bootstrap?workspaceId=${encodeURIComponent(activeWorkspaceId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.tasks && data.tasks.length > 0) {
            // If local storage is empty or first run, hydrate from server
            const hasCustomLocal = localStorage.getItem('pp_has_custom_modifications');
            if (!hasCustomLocal) {
              if (data.users) setUsersList(data.users);
              if (data.projects) setProjectsList(data.projects);
              if (data.tasks) setTasksList(data.tasks);
              if (data.activityLogs) setLogsList(data.activityLogs);
              if (data.notifications) setNotificationsList(data.notifications);
            }
          }
        }
      } catch (err) {
        // Silently use local state if API is offline
      }
    };
    fetchFromDb();
  }, [activeWorkspaceId]);

  // Helper to add Activity Log
  const logActivity = (action: string, target: string, type: 'project' | 'task' | 'access' | 'system' = 'task') => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser ? currentUser.name : 'Sistem',
      actorEmail: currentUser ? currentUser.email : 'system@progresspalace.id',
      actorRole: currentUser ? currentUser.role : 'admin',
      action,
      target,
      type,
      workspaceId: activeWorkspaceId,
    };
    setLogsList((prev) => [newLog, ...prev]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pp_has_custom_modifications', 'true');
    }
  };

  // Workspace actions
  const switchWorkspace = (workspaceId: string) => {
    const ws = workspacesList.find((w) => w.id === workspaceId);
    if (ws) {
      setActiveWorkspaceId(workspaceId);
      logActivity('Beralih Workspace', `Beralih ke workspace "${ws.name}"`, 'system');
    }
  };

  const createWorkspace = (name: string, description?: string): Workspace => {
    const id = `ws-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newWs: Workspace = {
      id,
      name,
      slug,
      description: description || `Workspace tim untuk ${name}`,
      createdAt: new Date().toISOString(),
    };
    setWorkspacesList((prev) => [...prev, newWs]);
    setActiveWorkspaceId(id);
    logActivity('Membuat Workspace Baru', `Workspace "${name}" berhasil dibuat`, 'system');

    // Async sync to DB
    fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWs),
    }).catch(() => {});

    return newWs;
  };

  // User & Access Actions
  const switchUser = (user: User) => {
    setCurrentUserId(user.id);
    logActivity('Beralih Akun', `Login sebagai ${user.name} (${user.role.toUpperCase()})`, 'access');
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const loginWithEmail = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return {
        success: false,
        message: 'Email tidak ditemukan dalam sistem. Silakan ajukan pendaftaran akses terlebih dahulu.',
        status: 'not_found',
      };
    }

    if (found.status === 'pending') {
      return {
        success: false,
        message: 'Permohonan akses untuk email ini masih menunggu persetujuan Administrator.',
        status: 'pending',
        user: found,
      };
    }

    if (found.status === 'rejected') {
      return {
        success: false,
        message: 'Permohonan akses email ini ditolak oleh Administrator. Hubungi administrator proyek.',
        status: 'rejected',
        user: found,
      };
    }

    if (found.status === 'suspended') {
      return {
        success: false,
        message: 'Akses akun email ini dinonaktifkan sementara.',
        status: 'suspended',
        user: found,
      };
    }

    // Success
    setCurrentUserId(found.id);
    setUsersList((prev) =>
      prev.map((u) => (u.id === found.id ? { ...u, lastLogin: new Date().toISOString() } : u))
    );
    logActivity('Masuk Sistem', `Berhasil login melalui email ${cleanEmail}`, 'access');

    return {
      success: true,
      message: `Selamat datang kembali, ${found.name}!`,
      user: found,
      status: 'approved',
    };
  };

  const registerEmailAccess = (data: {
    name: string;
    email: string;
    role: Role;
    department: string;
    phone?: string;
    reason: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return {
        success: false,
        message: `Email ${cleanEmail} sudah terdaftar dengan status: ${existing.status.toUpperCase()}.`,
      };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      status: 'pending',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      department: data.department.trim(),
      phone: data.phone || '',
      reason: data.reason.trim(),
      registeredAt: new Date().toISOString(),
      workspaceId: activeWorkspaceId,
    };

    setUsersList((prev) => [newUser, ...prev]);

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Pendaftaran Akses Email Baru',
      message: `${data.name} (${cleanEmail}) mengajukan permohonan akses peran ${data.role.toUpperCase()}.`,
      timestamp: 'Baru saja',
      read: false,
      type: 'access_request',
      targetRole: 'admin',
      linkTab: 'access',
      workspaceId: activeWorkspaceId,
    };

    setNotificationsList((prev) => [notif, ...prev]);
    logActivity('Pendaftaran Akses Email', `Pendaftaran baru diajukan oleh ${data.name} (${cleanEmail})`, 'access');

    // Async sync to DB
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch(() => {});

    return {
      success: true,
      message: 'Permohonan akses berhasil dikirim! Administrator akan memverifikasi email Anda.',
    };
  };

  const approveUserAccess = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'approved' } : u))
    );
    logActivity('Menyetujui Akses Email', `${target.name} (${target.email}) disetujui sebagai ${target.role.toUpperCase()}`, 'access');

    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    }).catch(() => {});
  };

  const rejectUserAccess = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected' } : u))
    );
    logActivity('Menolak Akses Email', `Permintaan akses untuk ${target.email} ditolak`, 'access');

    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' }),
    }).catch(() => {});
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;

    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    logActivity('Mengubah Peran Pengguna', `Peran ${target.name} diubah menjadi ${newRole.toUpperCase()}`, 'access');

    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    }).catch(() => {});
  };

  const revokeUserAccess = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;

    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    logActivity('Menghapus Akses Email', `Akses akun ${target.email} dihapus permanen`, 'access');

    fetch(`/api/users/${userId}`, { method: 'DELETE' }).catch(() => {});
  };

  const whitelistEmailDirect = (data: { name: string; email: string; role: Role; department?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === existing.id
            ? { ...u, status: 'approved', role: data.role, department: data.department || u.department }
            : u
        )
      );
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: cleanEmail,
      role: data.role,
      status: 'approved',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      department: data.department || 'Digital Team',
      registeredAt: new Date().toISOString(),
      invitedBy: currentUser?.name || 'Administrator',
      reason: 'Diundang langsung melalui whitelist Administrator',
      workspaceId: activeWorkspaceId,
    };

    setUsersList((prev) => [newUser, ...prev]);
    logActivity('Undang Akses Email Langsung', `Email ${cleanEmail} ditambahkan ke whitelist sebagai ${data.role.toUpperCase()}`, 'access');

    fetch('/api/users/whitelist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch(() => {});
  };

  // Projects Actions
  const addProject = (data: Omit<Project, 'id'>): Project => {
    const newProject: Project = {
      ...data,
      id: `prj-${Date.now()}`,
      workspaceId: activeWorkspaceId,
    };
    setProjectsList((prev) => [newProject, ...prev]);
    logActivity('Membuat Proyek Baru', `Proyek "${newProject.title}" ditambahkan`, 'project');

    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    }).catch(() => {});

    return newProject;
  };

  const updateProject = (project: Project) => {
    setProjectsList((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    logActivity('Memperbarui Proyek', `Data proyek "${project.title}" diperbarui`, 'project');

    fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    }).catch(() => {});
  };

  const deleteProject = (projectId: string) => {
    const target = projectsList.find((p) => p.id === projectId);
    setProjectsList((prev) => prev.filter((p) => p.id !== projectId));
    // also remove tasks under this project
    setTasksList((prev) => prev.filter((t) => t.projectId !== projectId));
    if (target) {
      logActivity('Menghapus Proyek', `Proyek "${target.title}" beserta tugasnya dihapus`, 'project');
    }

    fetch(`/api/projects/${projectId}`, { method: 'DELETE' }).catch(() => {});
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const calcProgress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
        const updatedProj = { ...p, milestones: updatedMilestones, progress: calcProgress };

        fetch(`/api/projects/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProj),
        }).catch(() => {});

        return updatedProj;
      })
    );
  };

  // Tasks Actions
  const addTask = (data: Omit<Task, 'id' | 'logs'>): Task => {
    const newTask: Task = {
      ...data,
      id: `tsk-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          updatedBy: currentUser?.name || 'Sistem',
          previousProgress: 0,
          newProgress: data.progress || 0,
          note: 'Tugas pertama kali dibuat.',
        },
      ],
    };
    setTasksList((prev) => [newTask, ...prev]);
    logActivity('Menambahkan Tugas', `Tugas "${newTask.title}" untuk ${newTask.assignedToName}`, 'task');

    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    }).catch(() => {});

    return newTask;
  };

  const bulkAddTasks = (rawTasks: any[]) => {
    const timestamp = Date.now();
    const formatted: Task[] = rawTasks.map((t, index) => ({
      ...t,
      id: t.id || `tsk-${timestamp}-${index}-${Math.floor(Math.random() * 1000)}`,
      workspaceId: activeWorkspaceId,
      logs: [
        {
          id: `log-${timestamp}-${index}`,
          timestamp: new Date().toISOString(),
          updatedBy: currentUser?.name || 'Administrator',
          previousProgress: 0,
          newProgress: t.progress || 0,
          note: 'Diunggah melalui fitur Impor Massal Tugas.',
        },
      ],
    }));

    setTasksList((prev) => [...formatted, ...prev]);
    logActivity('Unggah Data Tugas Massal', `Mengunggah ${formatted.length} butir tugas ke sistem`, 'task');

    const notif: Notification = {
      id: `notif-${timestamp}`,
      title: 'Data Tugas Baru Diunggah',
      message: `${currentUser?.name || 'Administrator'} berhasil mengunggah ${formatted.length} data tugas.`,
      timestamp: 'Baru saja',
      read: false,
      type: 'task_update',
      linkTab: 'tasks',
      workspaceId: activeWorkspaceId,
    };
    setNotificationsList((prev) => [notif, ...prev]);

    fetch('/api/tasks/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: formatted }),
    }).catch(() => {});

    return { success: true, count: formatted.length };
  };

  const updateTask = (task: Task) => {
    setTasksList((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    logActivity('Memperbarui Tugas', `Detail tugas "${task.title}" diperbarui`, 'task');

    fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).catch(() => {});
  };

  const deleteTask = (taskId: string) => {
    const target = tasksList.find((t) => t.id === taskId);
    setTasksList((prev) => prev.filter((t) => t.id !== taskId));
    if (target) {
      logActivity('Menghapus Tugas', `Tugas "${target.title}" telah dihapus`, 'task');
    }

    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' }).catch(() => {});
  };

  const updateTaskProgress = (taskId: string, progress: number, status?: TaskStatus, note?: string) => {
    const clamped = Math.min(100, Math.max(0, progress));
    let nextStatus = status;

    setTasksList((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentStatus = nextStatus || t.status;
        let determinedStatus = currentStatus;
        if (!nextStatus) {
          if (clamped === 100) determinedStatus = 'done';
          else if (clamped > 0 && t.status === 'todo') determinedStatus = 'in_progress';
        }

        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          updatedBy: currentUser?.name || 'Anggota Tim',
          previousProgress: t.progress,
          newProgress: clamped,
          note: note || `Progres diperbarui menjadi ${clamped}%`,
        };

        const updatedTask: Task = {
          ...t,
          progress: clamped,
          status: determinedStatus,
          logs: [newLog, ...(t.logs || [])],
        };

        fetch(`/api/tasks/${t.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        }).catch(() => {});

        return updatedTask;
      })
    );

    const taskItem = tasksList.find((t) => t.id === taskId);
    if (taskItem) {
      logActivity('Update Progres Tugas', `"${taskItem.title}" diperbarui ke ${clamped}% (${nextStatus || taskItem.status})`, 'task');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const exportDataToCSV = () => {
    const headers = [
      'No',
      'Job Distribution',
      'Sub-Job Distribution',
      'Area',
      'Frekuensi Kegiatan',
      'Team Member',
      'List of work',
      'Waktu Mulai',
      'ETA (Waktu Selesai)',
      'Prioritas',
      'Status',
      'Keterangan',
    ];

    const rows = tasksList.map((t, idx) => [
      String(t.no || idx + 1),
      `"${(t.jobDistribution || '').replace(/"/g, '""')}"`,
      `"${(t.subJobDistribution || '').replace(/"/g, '""')}"`,
      `"${(t.area || '').replace(/"/g, '""')}"`,
      `"${(t.frequency || 'Project').replace(/"/g, '""')}"`,
      `"${(t.teamMember || t.assignedToName).replace(/"/g, '""')}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.startDate || '').replace(/"/g, '""')}"`,
      `"${(t.eta || t.dueDate || '').replace(/"/g, '""')}"`,
      `"${t.priority}"`,
      `"${
        t.status === 'done'
          ? 'Done'
          : t.status === 'dropped'
          ? 'Droped'
          : t.status === 'in_progress'
          ? t.frequency?.includes('Update')
            ? '📅 Scheduled'
            : 'On Progress'
          : 'Not Started'
      }"`,
      `"${(t.keterangan || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Progress_Palace_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setWorkspacesList([DEFAULT_WORKSPACE]);
    setActiveWorkspaceId(DEFAULT_WORKSPACE.id);
    setUsersList(INITIAL_USERS);
    setCurrentUserId('usr-1');
    setProjectsList(INITIAL_PROJECTS);
    setTasksList(INITIAL_TASKS);
    setLogsList(INITIAL_ACTIVITY_LOGS);
    setNotificationsList(INITIAL_NOTIFICATIONS);
    setActiveTab('overview');
    logActivity('Reset Sistem', 'Data berhasil dikembalikan ke kondisi demo default', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        workspace: activeWorkspace,
        workspaces: workspacesList,
        currentUser,
        users: usersList,
        projects: projectsList,
        tasks: tasksList,
        activityLogs: logsList,
        notifications: notificationsList,
        activeTab,
        searchQuery,
        filterMember,
        filterProject,
        filterFrequency,
        filterPriority,
        filterStatus,
        isLoginModalOpen,
        isRegisterModalOpen,
        isInviteModalOpen,
        isWorkspaceModalOpen,
        isNewProjectModalOpen,
        isNewTaskModalOpen,
        isUploadTasksModalOpen,
        activeTaskForProgress,
        projectToEdit,
        taskToEdit,
        setActiveTab,
        setSearchQuery,
        setFilterMember,
        setFilterProject,
        setFilterFrequency,
        setFilterPriority,
        setFilterStatus,
        setIsLoginModalOpen,
        setIsRegisterModalOpen,
        setIsInviteModalOpen,
        setIsWorkspaceModalOpen,
        setIsNewProjectModalOpen,
        setIsNewTaskModalOpen,
        setIsUploadTasksModalOpen,
        setActiveTaskForProgress,
        setProjectToEdit,
        setTaskToEdit,
        switchWorkspace,
        createWorkspace,
        switchUser,
        logout,
        loginWithEmail,
        registerEmailAccess,
        approveUserAccess,
        rejectUserAccess,
        updateUserRole,
        revokeUserAccess,
        whitelistEmailDirect,
        addProject,
        updateProject,
        deleteProject,
        toggleMilestone,
        addTask,
        bulkAddTasks,
        updateTask,
        deleteTask,
        updateTaskProgress,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        exportDataToCSV,
        resetToDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
