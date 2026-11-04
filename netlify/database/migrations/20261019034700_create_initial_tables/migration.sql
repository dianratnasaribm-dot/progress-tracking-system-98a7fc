CREATE TABLE "activity_logs" (
	"id" text PRIMARY KEY,
	"workspace_id" text DEFAULT 'ws-default' NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"actor_name" text,
	"actor_email" text,
	"actor_role" text,
	"action" text NOT NULL,
	"target" text,
	"type" text DEFAULT 'task'
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY,
	"workspace_id" text DEFAULT 'ws-default' NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"timestamp" text,
	"read" boolean DEFAULT false,
	"type" text DEFAULT 'system',
	"target_role" text,
	"link_tab" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY,
	"workspace_id" text DEFAULT 'ws-default' NOT NULL,
	"title" text NOT NULL,
	"code" text,
	"description" text,
	"category" text,
	"priority" text DEFAULT 'Sedang',
	"status" text DEFAULT 'Aktif',
	"progress" integer DEFAULT 0,
	"start_date" text,
	"due_date" text,
	"budget" integer DEFAULT 0,
	"spent" integer DEFAULT 0,
	"lead_name" text,
	"lead_email" text,
	"assigned_members" text DEFAULT '[]',
	"milestones" text DEFAULT '[]',
	"tags" text DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY,
	"workspace_id" text DEFAULT 'ws-default' NOT NULL,
	"no" integer,
	"project_id" text,
	"project_title" text,
	"job_distribution" text,
	"sub_job_distribution" text,
	"area" text,
	"frequency" text DEFAULT 'Project',
	"team_member" text,
	"title" text NOT NULL,
	"description" text,
	"assigned_to_email" text,
	"assigned_to_name" text,
	"assigned_to_avatar" text,
	"priority" text DEFAULT 'Sedang',
	"status" text DEFAULT 'todo',
	"progress" integer DEFAULT 0,
	"start_date" text,
	"due_date" text,
	"eta" text,
	"keterangan" text,
	"estimated_hours" integer DEFAULT 8,
	"spent_hours" integer DEFAULT 0,
	"logs" text DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"workspace_id" text DEFAULT 'ws-default' NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'anggota' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"avatar" text,
	"department" text,
	"phone" text,
	"reason" text,
	"registered_at" timestamp DEFAULT now(),
	"last_login" timestamp,
	"invited_by" text
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
