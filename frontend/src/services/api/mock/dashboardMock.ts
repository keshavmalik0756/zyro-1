import { BackendDashboardData } from "../types";

export const dashboardMockData: BackendDashboardData = {
  cards: {
    my_projects: 5,
    active_issues: 17,
    team_members: 1,
    active_sprints: 3,
  },

  recent_projects: [
    {
      project_name: "E-Commerce Platform",
      total_task: 12,
      task_completed: 12,
      project_completion_percentage: 99,
      team_members: [
        { id: 1, name: "Keshav malik" },
        { id: 2, name: "Kanhaiya gupta" },
      ],
    },
    {
      project_name: "Analytics Dashboard",
      total_task: 12,
      task_completed: 5,
      project_completion_percentage: 44,
      team_members: [
        { id: 3, name: "Rohit Sharma" },
        { id: 4, name: "Neha Singh" },
      ],
    },
    {
      project_name: "Customer Portal",
      total_task: 12,
      task_completed: 12,
      project_completion_percentage: 100,
      team_members: [
        { id: 5, name: "Aman Kumar" },
        { id: 6, name: "Priya Patel" },
      ],
    },
    {
      project_name: "Mobile Banking App",
      total_task: 12,
      task_completed: 10,
      project_completion_percentage: 84,
      team_members: [
        { id: 7, name: "Sandeep Joshi" },
        { id: 8, name: "Anjali Nair" },
      ],
    },
    {
      project_name: "API Gateway Service",
      total_task: 8,
      task_completed: 0,
      project_completion_percentage: 0,
      team_members: [
        { id: 9, name: "Vikram Singh" },
      ],
    },
  ],

  recent_issues: [
    {
      task_id: 2,
      task_name: "Fix payment gateway integration - Sprint 1 - E-Commerce Platform",
      project_name: "E-Commerce Platform",
      status: "completed",
      priority: "high",
      assigned_to: "Keshav malik",
      hours_ago: 11,
    },
    {
      task_id: 3,
      task_name: "Design database schema - Sprint 1 - E-Commerce Platform",
      project_name: "E-Commerce Platform",
      status: "completed",
      priority: "high",
      assigned_to: "Kanhaiya gupta",
      hours_ago: 11,
    },
    {
      task_id: 4,
      task_name: "User registration flow - Sprint 1 - E-Commerce Platform",
      project_name: "E-Commerce Platform",
      status: "completed",
      priority: "high",
      assigned_to: "Keshav malik",
      hours_ago: 11,
    },
    {
      task_id: 5,
      task_name: "Add unit tests - Sprint 2 - E-Commerce Platform",
      project_name: "E-Commerce Platform",
      status: "completed",
      priority: "high",
      assigned_to: "Kanhaiya gupta",
      hours_ago: 11,
    },
    {
      task_id: 1,
      task_name: "Implement user authentication - Sprint 1 - E-Commerce Platform",
      project_name: "E-Commerce Platform",
      status: "completed",
      priority: "high",
      assigned_to: "Kanhaiya gupta",
      hours_ago: 11,
    },
  ],
};