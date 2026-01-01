// ======================================================
// 🔹 GENERIC API RESPONSE
// ======================================================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ======================================================
// 🔹 DASHBOARD – BACKEND TYPES (DO NOT CHANGE)
// These EXACTLY match FastAPI responses
// ======================================================

export interface DashboardCards {
  my_projects: number;
  active_issues: number;
  team_members: number;
  active_sprints: number;
}

export interface BackendRecentProject {
  project_id: number;
  project_name: string;
  total_task: number;
  task_completed: number;
  project_completion_percentage: number;
  team_members?: ReadonlyArray<{
    id: number;
    name: string;
  }>;
}

export interface BackendRecentIssue {
  task_id: number;
  task_name: string;
  project_name: string;
  status: string;
  priority: string;
  assigned_to: string;
  hours_ago: number;
}

export interface BackendDashboardData {
  cards: DashboardCards;
  recent_projects: BackendRecentProject[];
  recent_issues: BackendRecentIssue[];
}

// ======================================================
// 🔹 DASHBOARD – FRONTEND (NORMALIZED) TYPES
// Used directly by UI components
// ======================================================

export interface DashboardStats {
  total_projects: number;
  active_issues: number;
  active_sprints: number;
  team_members: number;

  // optional trends (future backend support)
  projects_trend?: number;
  issues_trend?: number;
  sprints_trend?: number;
  members_trend?: number;
}

export interface RecentProject {
  id: number | string;                 // frontend-generated
  name: string;
  status: string;                      // derived (active / completed)
  progress: number;                    // %
  team_members: number;
  team_members_details?: ReadonlyArray<{
    id: number;
    name: string;
  }>;
  total_task: number;
  task_completed: number;
  last_updated: string;                // UI-friendly text
}

export interface RecentIssue {
  id: number | string;                 // task_id
  title: string;                       // task_name
  priority: string;
  status: string;
  assignee: string;
  created: string;                     // derived from hours_ago
  project: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_projects: RecentProject[];
  recent_issues: RecentIssue[];
}

// ======================================================
// 🔹 PROJECT API TYPES
// ======================================================

export interface Project {
  id: number | string;
  name: string;
  status: string;
  description: string;
  created_by: string;

  start_date: string;
  end_date: string;

  created_at: string;
  updated_at: string;

  // optional / computed (UI-friendly)
  teamMembers?: number;
  progress?: number;
  lastUpdated?: string;
}

// Project request types
export interface CreateProjectRequest {
  name: string;
  status: string;
  description: string;
  start_date: string;
  end_date: string;
  organization_id: number;
}

export interface UpdateProjectRequest {
  name?: string;
  status?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

// ======================================================
// 🔹 ISSUE API TYPES
// ======================================================

export type IssueType =
  | "story"
  | "task"
  | "bug"
  | "epic"
  | "subtask"
  | "feature"
  | "release"
  | "documentation"
  | "other";

export type IssueStatus =
  | "todo"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "hold"
  | "qa"
  | "blocked";

export type IssuePriority = "low" | "moderate" | "high" | "critical";

export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Issue {
  id: number;
  name: string;
  description?: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  story_point?: number;
  project_id: number;
  project?: Project;
  sprint_id?: number;
  assigned_to?: number;
  assigned_by?: number;
  assignee?: User;
  reporter?: User;
  created_at: string;
  updated_at: string;
  labels?: string[];
}

export interface CreateIssueRequest {
  name: string;
  description?: string;
  type: IssueType;
  status?: IssueStatus;
  priority: IssuePriority;
  story_point?: number;
  project_id: number;
  sprint_id?: number | null;
  assigned_to?: number | null;
}

export interface UpdateIssueRequest {
  name?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
  priority?: IssuePriority;
  story_point?: number;
  assigned_to?: number | null;
}
