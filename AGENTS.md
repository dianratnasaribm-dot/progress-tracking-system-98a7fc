# AGENTS.md

This document serves as the guide for AI agents interacting with, maintaining, or extending this codebase in future sessions.

## Project Architecture & Core Structure

Progress Palace is a full-stack project tracking, work distribution, and email access management platform built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, and **Netlify Database (Postgres)** with **Drizzle ORM**.

### Key Directories

- `src/routes/`: Route definitions for TanStack Start.
  - `__root.tsx`: Defines document shell, HTML meta tags (`siteName`, `siteDescription`), and global stylesheet imports.
  - `index.tsx`: Main application entry point providing the `AppProvider`, tab view rendering, desktop and mobile responsive layout, and modal dialogs.
- `src/components/`: Modular React components.
  - `Navbar.tsx`: Top header with brand logo, workspace switcher, global search, notifications dropdown, demo persona quick switcher, and profile/logout controls.
  - `Sidebar.tsx`: Desktop navigation with pending approval badge, active team preview, and action shortcuts.
  - `views/`: View pages:
    - `OverviewView.tsx`: KPI cards, filter bar, quick task slider update table, project snapshot, and activity audit log stream.
    - `ProjectsView.tsx`: Portfolio grid with progress bars, milestone checklists, lead PICs, and category filters.
    - `TasksView.tsx`: Table and Kanban task boards with search, multi-facet filtering, quick progress updating, and CSV export.
    - `AccessView.tsx`: Email whitelist and user management (Admin only) with approve/reject queue and role assignment.
    - `ReportsView.tsx`: Team workload distribution, completion ratios, priority breakdowns, and full report download.
    - `LandingView.tsx`: Unauthenticated welcome screen with 1-click persona demo logins and feature overview.
  - `modals/`:
    - `LoginModal.tsx`, `RegisterModal.tsx`, `InviteModal.tsx`, `ProjectModal.tsx`, `TaskModal.tsx`, `TaskProgressModal.tsx`, `BulkUploadModal.tsx`, `WorkspaceModal.tsx`.
- `src/context/AppContext.tsx`: Central state management with optimistic state, localStorage persistence, and background Netlify Functions sync.
- `src/data/initialData.ts`: 103 initial task items, 6 project initiatives, 9 default users, activity logs, and notifications.
- `src/types/index.ts`: TypeScript interfaces for `User`, `Project`, `Task`, `ActivityLog`, `Notification`, `Workspace`, `Milestone`, and `Role`.
- `db/`: Database configuration and schema.
  - `schema.ts`: Drizzle Postgres table definitions for `workspaces`, `users`, `projects`, `tasks`, `activityLogs`, and `notifications`.
  - `index.ts`: Drizzle client initialized with `drizzle-orm/netlify-db`.
- `drizzle.config.ts`: Drizzle Kit configuration pointing migrations to `netlify/database/migrations`.
- `netlify/functions/api.mts`: Serverless API endpoint handling bootstrap data seeding, workspace switching, user access requests, and task/project CRUD.
- `netlify/database/migrations/`: SQL migration files automatically applied by Netlify at deploy time.

## Coding Conventions & Decisions

1. **State Hydration Strategy**:
   The app uses an offline-first approach: state is immediately hydrated from localStorage or `src/data/initialData.ts`, and then background synced with `/api/bootstrap`. Any update (such as sliding a task's progress or approving a user) updates the state optimistically and fires an asynchronous call to the backend Netlify Function.
2. **Multi-Workspace ("Can be used for other")**:
   Each workspace has an isolated identifier (`ws-default` or `ws-<timestamp>`). Any user can create a workspace for their own organization or squad without altering existing datasets.
3. **Role-Based Access Control**:
   Two roles are supported: `admin` and `anggota`.
   - `admin` has full access to add/edit/delete projects, manage the access approval queue, invite/whitelist emails, and bulk upload tasks.
   - `anggota` can view projects, update task progress, add progress notes, view reports, and edit their assigned tasks.
4. **Database Migrations**:
   Never run `drizzle-kit migrate` manually in this environment; Netlify runs migrations automatically. Generate new migrations when modifying `db/schema.ts` using `npx drizzle-kit generate --name <descriptive_name>`.
