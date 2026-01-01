import axios from 'axios';
import { ApiResponse, Issue, CreateIssueRequest, UpdateIssueRequest, IssueStatus, IssuePriority, IssueType } from './types';

// Export types for convenience
export type { Issue, CreateIssueRequest, UpdateIssueRequest, IssueStatus, IssuePriority, IssueType };

// Create axios instance
const apiClient = axios.create({
  withCredentials: true,
});

/* ======================================================
   🔹 Request Interceptor (Auth)
====================================================== */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from the auth state stored in localStorage
    const authStateStr = localStorage.getItem('authState');
    let token = null;
    
    if (authStateStr) {
      try {
        const authState = JSON.parse(authStateStr);
        token = authState.token;
      } catch (e) {
        console.error('Error parsing auth state:', e);
      }
    }
    
    // Fallback to direct access_token if authState doesn't contain token
    if (!token) {
      token = localStorage.getItem('access_token');
    }
    
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set the base API URL dynamically
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
    config.baseURL = API_BASE_URL;
    
    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================================
   🔹 Response Interceptor (Auth Expiry)
====================================================== */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear auth state
      localStorage.removeItem('authState');
      localStorage.removeItem('access_token');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Issue API functions
export const issueApi = {
  // GET all issues
  getIssues: async (): Promise<Issue[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Issue[]>>('/issue');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  },

  // GET issue by ID
  getIssueById: async (id: number): Promise<Issue> => {
    try {
      const response = await apiClient.get<ApiResponse<Issue>>(`/issue/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching issue with id ${id}:`, error);
      throw error;
    }
  },

  // POST create issue
  createIssue: async (issueData: CreateIssueRequest): Promise<Issue> => {
    try {
      const response = await apiClient.post<ApiResponse<Issue>>('/issue', issueData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  },

  // PUT update issue
  updateIssue: async (id: number, issueData: UpdateIssueRequest): Promise<Issue> => {
    try {
      const response = await apiClient.put<ApiResponse<Issue>>(`/issue/${id}`, issueData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating issue with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE issue
  deleteIssue: async (id: number): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<null>>(`/issue/${id}`);
    } catch (error) {
      console.error(`Error deleting issue with id ${id}:`, error);
      throw error;
    }
  },

  // GET issues by status
  getIssuesByStatus: async (status: IssueStatus): Promise<Issue[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Issue[]>>(`/issue?status=${status}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching issues with status ${status}:`, error);
      throw error;
    }
  },

  // GET issues by priority
  getIssuesByPriority: async (priority: IssuePriority): Promise<Issue[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Issue[]>>(`/issue?priority=${priority}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching issues with priority ${priority}:`, error);
      throw error;
    }
  },

  // GET issues by project
  getIssuesByProject: async (projectId: number): Promise<Issue[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Issue[]>>(`/issue?project_id=${projectId}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching issues for project ${projectId}:`, error);
      throw error;
    }
  },
};