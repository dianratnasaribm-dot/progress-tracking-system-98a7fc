export type Role = 'admin' | 'anggota';

export type UserStatus = 'approved' | 'pending' | 'rejected' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  department?: string;
  phone?: string;
  reason?: string;
  registeredAt?: string;
  lastLogin?: string;
  invitedBy?: string;
  workspaceId?: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface AssignedMember {
  email: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  status: 'Aktif' | 'Hold' | 'Selesai';
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  spent: number;
  leadName: string;
  leadEmail: string;
  assignedMembers: AssignedMember[];
  milestones: Milestone[];
  tags: string[];
  workspaceId?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'dropped';

export interface ProgressLog {
  id: string;
  timestamp: string;
  updatedBy: string;
  previousProgress: number;
  newProgress: number;
  note: string;
}

export interface Task {
  id: string;
  no?: number;
  projectId: string;
  projectTitle?: string;
  jobDistribution: string;
  subJobDistribution: string;
  area: string;
  frequency: string;
  teamMember: string;
  title: string;
  description?: string;
  assignedToEmail: string;
  assignedToName: string;
  assignedToAvatar?: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  status: TaskStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  eta: string;
  keterangan: string;
  estimatedHours?: number;
  spentHours?: number;
  workspaceId?: string;
  logs: ProgressLog[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: Role;
  action: string;
  target: string;
  type: 'project' | 'task' | 'access' | 'system';
  workspaceId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'task' | 'task_update' | 'access_request' | 'system' | 'mention';
  targetRole?: Role;
  linkTab?: string;
  workspaceId?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export type ActiveTab = 'overview' | 'projects' | 'tasks' | 'access' | 'reports';
