import axios from 'axios';
import { ApiResponse, Project, CreateProjectRequest, UpdateProjectRequest } from './types';

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

// Project API functions
export const projectApi = {
  // GET all projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>('/project');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // GET project by ID
  getProjectById: async (id: number): Promise<Project> => {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(`/project/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }
  },

  // POST create project
  createProject: async (projectData: CreateProjectRequest): Promise<Project> => {
    try {
      console.log("Creating project with data:", projectData);
      const response = await apiClient.post<ApiResponse<Project>>('/project', projectData);
      console.log("Project creation response:", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create project");
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      // Extract meaningful error message
      let errorMessage = "Failed to create project";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // PUT update project
  updateProject: async (id: number, projectData: UpdateProjectRequest): Promise<Project> => {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(`/project/${id}`, projectData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating project with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE project
  deleteProject: async (id: number): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<null>>(`/project/${id}`);
      // Backend returns success: true, message: "Project deleted successfully", data: null
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },

  // GET projects by status - This function is not supported by backend, so removing it
  // getProjectsByStatus: async (status: string): Promise<ApiProject[]> => {
  //   try {
  //     const response = await apiClient.get<ApiResponse<ApiProject[]>>(`/projects?status=${status}`);
  //     return response.data.data;
  //   } catch (error) {
  //     console.error(`Error fetching projects with status ${status}:`, error);
  //     throw error;
  //   }
  // },

};

// Export as projectService for consistency
export const projectService = projectApi;

// Export getAll method for compatibility
export const getAll = projectApi.getProjects;

// Re-export Project type
export type { Project };