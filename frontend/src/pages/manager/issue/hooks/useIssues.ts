import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { issueApi } from "@/services/api/issueApi";
import { projectService } from "@/services/api/projectApi";
import {
  Issue as ApiIssue,
  IssueStatus,
  Project,
} from "@/services/api/types";
import { ApiError } from "@/types/api";

export interface UIIssue {
  id: string;
  title: string;
  type: any;
  priority: "low" | "medium" | "high" | "critical";
  status: IssueStatus;
  assignee: { name: string; avatar: string; id?: number };
  reporter: { name: string; avatar: string; id?: number };
  project: { key: string; name: string; id?: number };
  created: string;
  updated: string;
  labels: string[];
  storyPoints?: number;
  apiId?: number;
}

const getProjectKey = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
};

const getUserInitials = (name: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

const transformIssueToUI = (apiIssue: ApiIssue, project?: any): UIIssue => {
  const issueProject = apiIssue.project || project;
  const projectName = issueProject?.name || "Unknown Project";
  const projectKey = getProjectKey(projectName);
  const issueId = `${projectKey}-${apiIssue.id}`;

  const priorityMap: Record<string, "low" | "medium" | "high" | "critical"> = {
    low: "low",
    moderate: "medium",
    high: "high",
    critical: "critical",
  };

  return {
    id: issueId,
    title: apiIssue.name,
    type: apiIssue.type,
    priority: priorityMap[apiIssue.priority || "moderate"] || "medium",
    status: apiIssue.status,
    assignee: {
      name: apiIssue.assignee?.name || "Unassigned",
      avatar: getUserInitials(apiIssue.assignee?.name || "Unassigned"),
      id: apiIssue.assignee?.id || apiIssue.assigned_to || undefined,
    },
    reporter: {
      name: apiIssue.reporter?.name || "Unknown",
      avatar: getUserInitials(apiIssue.reporter?.name || "Unknown"),
      id: apiIssue.reporter?.id || apiIssue.assigned_by || undefined,
    },
    project: {
      key: projectKey,
      name: projectName,
      id: (issueProject?.id as number) || (apiIssue.project_id as number) || undefined,
    },
    created: formatTimeAgo(apiIssue.created_at),
    updated: formatTimeAgo(apiIssue.updated_at),
    labels: [],
    storyPoints: apiIssue.story_point || 0,
    apiId: apiIssue.id,
  };
};

export const useIssues = () => {
  const [issues, setIssues] = useState<UIIssue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load issues and projects in parallel
      const [issuesResponse, projectsResponse] = await Promise.allSettled([
        issueApi.getIssues(),
        projectService.getProjects()
      ]);

      let issuesData: ApiIssue[] = [];
      let projectsData: Project[] = [];

      // Handle issues response
      if (issuesResponse.status === 'fulfilled') {
        // The API returns the array directly, not wrapped in an ApiResponse
        issuesData = Array.isArray(issuesResponse.value) ? issuesResponse.value : [];
      } else {
        console.error("Error loading issues:", issuesResponse.reason);
        toast.error("Failed to load issues");
      }

      // Handle projects response
      if (projectsResponse.status === 'fulfilled') {
        // The API returns the array directly, not wrapped in an ApiResponse
        projectsData = Array.isArray(projectsResponse.value) ? projectsResponse.value : [];
      } else {
        console.error("Error loading projects:", projectsResponse.reason);
        toast.error("Failed to load projects");
      }

      // Create projects map for quick lookup
      const projectsMap = new Map(projectsData.map((p: Project) => [p.id as number, p]));
      setProjects(projectsData);

      // Transform issues to UI format
      const uiIssues = issuesData
        .map((apiIssue: ApiIssue) => {
          try {
            const project = apiIssue.project || (apiIssue.project_id ? projectsMap.get(apiIssue.project_id as number) : undefined);
            return transformIssueToUI(apiIssue, project);
          } catch (error) {
            console.error("Error transforming issue:", apiIssue, error);
            return null;
          }
        })
        .filter((issue: UIIssue | null): issue is UIIssue => issue !== null);

      setIssues(uiIssues);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load issues");
      setIssues([]);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateIssueStatus = useCallback(
    async (issueId: string, newStatus: IssueStatus) => {
      const issue = issues.find((i) => i.id === issueId);
      if (!issue || !issue.apiId) return false;

      // Optimistically update the UI
      const updatedIssues = issues.map((i) =>
        i.id === issueId ? { ...i, status: newStatus } : i
      );
      setIssues(updatedIssues);

      try {
        await issueApi.updateIssue(issue.apiId, { status: newStatus });
        toast.success("Issue status updated successfully");
        return true;
      } catch (error) {
        // Revert the optimistic update on failure
        setIssues(issues);
        toast.error("Failed to update issue status");
        return false;
      }
    },
    [issues]
  );

  const deleteIssue = useCallback(
    async (apiId: number) => {
      try {
        await issueApi.deleteIssue(apiId);
        toast.success("Issue deleted successfully");
        // Refresh data to get the latest state from the backend
        await loadData();
        return true;
      } catch (error) {
        const apiError = error as ApiError;
        toast.error(apiError.message || "Failed to delete issue");
        return false;
      }
    },
    [loadData]
  );

  return {
    issues,
    projects,
    isLoading,
    loadData,
    updateIssueStatus,
    deleteIssue,
  };
};
