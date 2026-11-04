import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().default("ws-default"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("anggota"), // admin | anggota
  status: text("status").notNull().default("pending"), // approved | pending | rejected | suspended
  avatar: text("avatar"),
  department: text("department"),
  phone: text("phone"),
  reason: text("reason"),
  registeredAt: timestamp("registered_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  invitedBy: text("invited_by"),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().default("ws-default"),
  title: text("title").notNull(),
  code: text("code"),
  description: text("description"),
  category: text("category"),
  priority: text("priority").default("Sedang"), // Tinggi | Sedang | Rendah
  status: text("status").default("Aktif"), // Aktif | Hold | Selesai
  progress: integer("progress").default(0),
  startDate: text("start_date"),
  dueDate: text("due_date"),
  budget: integer("budget").default(0),
  spent: integer("spent").default(0),
  leadName: text("lead_name"),
  leadEmail: text("lead_email"),
  assignedMembers: text("assigned_members").default("[]"), // JSON string
  milestones: text("milestones").default("[]"), // JSON string
  tags: text("tags").default("[]"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().default("ws-default"),
  no: integer("no"),
  projectId: text("project_id"),
  projectTitle: text("project_title"),
  jobDistribution: text("job_distribution"),
  subJobDistribution: text("sub_job_distribution"),
  area: text("area"),
  frequency: text("frequency").default("Project"), // Project | Weekly Update | Monthly Update | Rutin
  teamMember: text("team_member"),
  title: text("title").notNull(),
  description: text("description"),
  assignedToEmail: text("assigned_to_email"),
  assignedToName: text("assigned_to_name"),
  assignedToAvatar: text("assigned_to_avatar"),
  priority: text("priority").default("Sedang"), // Tinggi | Sedang | Rendah
  status: text("status").default("todo"), // todo | in_progress | review | done | dropped
  progress: integer("progress").default(0),
  startDate: text("start_date"),
  dueDate: text("due_date"),
  eta: text("eta"),
  keterangan: text("keterangan"),
  estimatedHours: integer("estimated_hours").default(8),
  spentHours: integer("spent_hours").default(0),
  logs: text("logs").default("[]"), // JSON string array of ProgressLog
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().default("ws-default"),
  timestamp: timestamp("timestamp").defaultNow(),
  actorName: text("actor_name"),
  actorEmail: text("actor_email"),
  actorRole: text("actor_role"),
  action: text("action").notNull(),
  target: text("target"),
  type: text("type").default("task"),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().default("ws-default"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  timestamp: text("timestamp"),
  read: boolean("read").default(false),
  type: text("type").default("system"),
  targetRole: text("target_role"),
  linkTab: text("link_tab"),
  createdAt: timestamp("created_at").defaultNow(),
});
