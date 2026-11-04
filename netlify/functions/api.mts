import type { Config, Context } from "@netlify/functions";
import { eq, desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  workspaces,
  users,
  projects,
  tasks,
  activityLogs,
  notifications,
} from "../../db/schema.js";
import {
  DEFAULT_WORKSPACE,
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
} from "../../src/data/initialData.js";

async function ensureSeed(workspaceId: string = "ws-default") {
  try {
    const existingWs = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (existingWs.length === 0) {
      await db.insert(workspaces).values({
        id: DEFAULT_WORKSPACE.id,
        name: DEFAULT_WORKSPACE.name,
        slug: DEFAULT_WORKSPACE.slug,
        description: DEFAULT_WORKSPACE.description,
      });

      // Insert users
      for (const u of INITIAL_USERS) {
        await db.insert(users).values({
          id: u.id,
          workspaceId: DEFAULT_WORKSPACE.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          avatar: u.avatar || null,
          department: u.department || null,
          phone: u.phone || null,
          reason: u.reason || null,
        });
      }

      // Insert projects
      for (const p of INITIAL_PROJECTS) {
        await db.insert(projects).values({
          id: p.id,
          workspaceId: DEFAULT_WORKSPACE.id,
          title: p.title,
          code: p.code,
          description: p.description,
          category: p.category,
          priority: p.priority,
          status: p.status,
          progress: p.progress,
          startDate: p.startDate,
          dueDate: p.dueDate,
          budget: p.budget,
          spent: p.spent,
          leadName: p.leadName,
          leadEmail: p.leadEmail,
          assignedMembers: JSON.stringify(p.assignedMembers || []),
          milestones: JSON.stringify(p.milestones || []),
          tags: JSON.stringify(p.tags || []),
        });
      }

      // Insert tasks in batches
      const taskBatch = INITIAL_TASKS.map((t) => ({
        id: t.id,
        workspaceId: DEFAULT_WORKSPACE.id,
        no: t.no || 0,
        projectId: t.projectId,
        projectTitle: t.projectTitle || "",
        jobDistribution: t.jobDistribution,
        subJobDistribution: t.subJobDistribution,
        area: t.area,
        frequency: t.frequency,
        teamMember: t.teamMember,
        title: t.title,
        description: t.description || "",
        assignedToEmail: t.assignedToEmail,
        assignedToName: t.assignedToName,
        assignedToAvatar: t.assignedToAvatar || null,
        priority: t.priority,
        status: t.status,
        progress: t.progress,
        startDate: t.startDate,
        dueDate: t.dueDate,
        eta: t.eta,
        keterangan: t.keterangan,
        estimatedHours: t.estimatedHours || 8,
        spentHours: t.spentHours || 0,
        logs: JSON.stringify(t.logs || []),
      }));

      // Insert in chunks of 25 to respect Postgres parameter limits
      for (let i = 0; i < taskBatch.length; i += 25) {
        await db.insert(tasks).values(taskBatch.slice(i, i + 25));
      }

      // Insert logs
      for (const l of INITIAL_ACTIVITY_LOGS) {
        await db.insert(activityLogs).values({
          id: l.id,
          workspaceId: DEFAULT_WORKSPACE.id,
          actorName: l.actorName,
          actorEmail: l.actorEmail,
          actorRole: l.actorRole,
          action: l.action,
          target: l.target,
          type: l.type,
        });
      }

      // Insert notifications
      for (const n of INITIAL_NOTIFICATIONS) {
        await db.insert(notifications).values({
          id: n.id,
          workspaceId: DEFAULT_WORKSPACE.id,
          title: n.title,
          message: n.message,
          timestamp: n.timestamp,
          read: n.read,
          type: n.type,
          targetRole: n.targetRole || null,
          linkTab: n.linkTab || null,
        });
      }
    }
  } catch (err) {
    console.warn("DB seed warning (using fallback data if db offline):", err);
  }
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const pathname = url.pathname.replace(/^\/api/, "");
  const method = req.method;

  try {
    // 1. Healthcheck
    if (pathname === "/health" || pathname === "") {
      return Response.json({ status: "ok", app: "Progress Palace API" });
    }

    // 2. Workspaces
    if (pathname === "/workspaces") {
      if (method === "GET") {
        try {
          const allWs = await db.select().from(workspaces);
          if (allWs.length === 0) {
            await ensureSeed("ws-default");
            return Response.json([DEFAULT_WORKSPACE]);
          }
          return Response.json(allWs);
        } catch {
          return Response.json([DEFAULT_WORKSPACE]);
        }
      }
      if (method === "POST") {
        const body = await req.json();
        const newWs = {
          id: body.id || `ws-${Date.now()}`,
          name: body.name,
          slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: body.description || "",
        };
        try {
          await db.insert(workspaces).values(newWs);
        } catch (e) {
          console.warn("Could not insert workspace into DB:", e);
        }
        return Response.json(newWs, { status: 201 });
      }
    }

    // 3. Bootstrap full workspace data
    if (pathname === "/bootstrap") {
      const wsId = url.searchParams.get("workspaceId") || "ws-default";
      await ensureSeed(wsId);

      try {
        const [wsList, userList, projectList, taskList, logList, notifList] =
          await Promise.all([
            db.select().from(workspaces).where(eq(workspaces.id, wsId)),
            db.select().from(users).where(eq(users.workspaceId, wsId)),
            db.select().from(projects).where(eq(projects.workspaceId, wsId)),
            db.select().from(tasks).where(eq(tasks.workspaceId, wsId)),
            db.select().from(activityLogs).where(eq(activityLogs.workspaceId, wsId)).orderBy(desc(activityLogs.timestamp)),
            db.select().from(notifications).where(eq(notifications.workspaceId, wsId)),
          ]);

        // Parse JSON fields
        const formattedProjects = projectList.map((p) => ({
          ...p,
          assignedMembers: JSON.parse(p.assignedMembers || "[]"),
          milestones: JSON.parse(p.milestones || "[]"),
          tags: JSON.parse(p.tags || "[]"),
        }));

        const formattedTasks = taskList.map((t) => ({
          ...t,
          logs: JSON.parse(t.logs || "[]"),
        }));

        return Response.json({
          workspace: wsList[0] || DEFAULT_WORKSPACE,
          users: userList.length ? userList : INITIAL_USERS,
          projects: formattedProjects.length ? formattedProjects : INITIAL_PROJECTS,
          tasks: formattedTasks.length ? formattedTasks : INITIAL_TASKS,
          activityLogs: logList.length ? logList : INITIAL_ACTIVITY_LOGS,
          notifications: notifList.length ? notifList : INITIAL_NOTIFICATIONS,
        });
      } catch (err) {
        console.warn("Database fallback to memory dataset:", err);
        return Response.json({
          workspace: DEFAULT_WORKSPACE,
          users: INITIAL_USERS,
          projects: INITIAL_PROJECTS,
          tasks: INITIAL_TASKS,
          activityLogs: INITIAL_ACTIVITY_LOGS,
          notifications: INITIAL_NOTIFICATIONS,
        });
      }
    }

    // 4. Tasks endpoints
    if (pathname.startsWith("/tasks")) {
      if (pathname === "/tasks" && method === "POST") {
        const body = await req.json();
        const newTask = {
          ...body,
          id: body.id || `tsk-${Date.now()}`,
          workspaceId: body.workspaceId || "ws-default",
          logs: JSON.stringify(body.logs || []),
        };
        try {
          await db.insert(tasks).values(newTask);
        } catch (e) {
          console.warn("DB task insert error:", e);
        }
        return Response.json(body, { status: 201 });
      }

      if (pathname === "/tasks/bulk" && method === "POST") {
        const body = await req.json();
        const taskItems = Array.isArray(body) ? body : body.tasks || [];
        const formatted = taskItems.map((t: any) => ({
          ...t,
          id: t.id || `tsk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          workspaceId: t.workspaceId || "ws-default",
          logs: JSON.stringify(t.logs || []),
        }));
        try {
          for (let i = 0; i < formatted.length; i += 25) {
            await db.insert(tasks).values(formatted.slice(i, i + 25));
          }
        } catch (e) {
          console.warn("DB bulk tasks insert error:", e);
        }
        return Response.json({ success: true, count: formatted.length });
      }

      const taskIdMatch = pathname.match(/^\/tasks\/([^/]+)$/);
      if (taskIdMatch && method === "PUT") {
        const taskId = taskIdMatch[1];
        const body = await req.json();
        const updateData: any = { ...body };
        if (body.logs) updateData.logs = JSON.stringify(body.logs);
        try {
          await db.update(tasks).set(updateData).where(eq(tasks.id, taskId));
        } catch (e) {
          console.warn("DB task update error:", e);
        }
        return Response.json({ success: true, task: body });
      }

      if (taskIdMatch && method === "DELETE") {
        const taskId = taskIdMatch[1];
        try {
          await db.delete(tasks).where(eq(tasks.id, taskId));
        } catch (e) {
          console.warn("DB task delete error:", e);
        }
        return Response.json({ success: true });
      }
    }

    // 5. Projects endpoints
    if (pathname.startsWith("/projects")) {
      if (pathname === "/projects" && method === "POST") {
        const body = await req.json();
        const newProj = {
          ...body,
          id: body.id || `prj-${Date.now()}`,
          workspaceId: body.workspaceId || "ws-default",
          assignedMembers: JSON.stringify(body.assignedMembers || []),
          milestones: JSON.stringify(body.milestones || []),
          tags: JSON.stringify(body.tags || []),
        };
        try {
          await db.insert(projects).values(newProj);
        } catch (e) {
          console.warn("DB project insert error:", e);
        }
        return Response.json(body, { status: 201 });
      }

      const projIdMatch = pathname.match(/^\/projects\/([^/]+)$/);
      if (projIdMatch && method === "PUT") {
        const projId = projIdMatch[1];
        const body = await req.json();
        const updateData: any = { ...body };
        if (body.assignedMembers) updateData.assignedMembers = JSON.stringify(body.assignedMembers);
        if (body.milestones) updateData.milestones = JSON.stringify(body.milestones);
        if (body.tags) updateData.tags = JSON.stringify(body.tags);
        try {
          await db.update(projects).set(updateData).where(eq(projects.id, projId));
        } catch (e) {
          console.warn("DB project update error:", e);
        }
        return Response.json({ success: true, project: body });
      }

      if (projIdMatch && method === "DELETE") {
        const projId = projIdMatch[1];
        try {
          await db.delete(projects).where(eq(projects.id, projId));
          await db.delete(tasks).where(eq(tasks.projectId, projId));
        } catch (e) {
          console.warn("DB project delete error:", e);
        }
        return Response.json({ success: true });
      }
    }

    // 6. Users & Access Management endpoints
    if (pathname.startsWith("/users")) {
      if (pathname === "/users/register" && method === "POST") {
        const body = await req.json();
        const newUser = {
          id: body.id || `usr-${Date.now()}`,
          workspaceId: body.workspaceId || "ws-default",
          name: body.name,
          email: body.email.toLowerCase().trim(),
          role: body.role || "anggota",
          status: "pending",
          avatar: body.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          department: body.department || "",
          phone: body.phone || "",
          reason: body.reason || "",
        };
        try {
          await db.insert(users).values(newUser);
        } catch (e) {
          console.warn("DB user register error:", e);
        }
        return Response.json({ success: true, user: newUser }, { status: 201 });
      }

      if (pathname === "/users/whitelist" && method === "POST") {
        const body = await req.json();
        const newUser = {
          id: body.id || `usr-${Date.now()}`,
          workspaceId: body.workspaceId || "ws-default",
          name: body.name,
          email: body.email.toLowerCase().trim(),
          role: body.role || "anggota",
          status: "approved",
          avatar: body.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          department: body.department || "",
          invitedBy: body.invitedBy || "Administrator",
        };
        try {
          await db.insert(users).values(newUser);
        } catch (e) {
          console.warn("DB whitelist user error:", e);
        }
        return Response.json({ success: true, user: newUser }, { status: 201 });
      }

      const userUpdateMatch = pathname.match(/^\/users\/([^/]+)$/);
      if (userUpdateMatch && method === "PUT") {
        const userId = userUpdateMatch[1];
        const body = await req.json();
        try {
          await db.update(users).set(body).where(eq(users.id, userId));
        } catch (e) {
          console.warn("DB user update error:", e);
        }
        return Response.json({ success: true });
      }

      if (userUpdateMatch && method === "DELETE") {
        const userId = userUpdateMatch[1];
        try {
          await db.delete(users).where(eq(users.id, userId));
        } catch (e) {
          console.warn("DB user delete error:", e);
        }
        return Response.json({ success: true });
      }
    }

    return new Response("Not found", { status: 404 });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/*",
};
