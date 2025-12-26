import axios from 'axios';
import { ApiResponse } from './types';

// Project interface for API
interface ApiProject {
  id: number | string;
  name: string;
  status: string;
  description: string;
  created_by: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

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
  getProjects: async (): Promise<ApiProject[]> => {
    try {
      const response = await apiClient.get<ApiResponse<ApiProject[]>>('/projects');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // GET project by ID
  getProjectById: async (id: number): Promise<ApiProject> => {
    try {
      const response = await apiClient.get<ApiResponse<ApiProject>>(`/projects/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }
  },

  // POST create project
  createProject: async (projectData: any): Promise<ApiProject> => {
    try {
      const response = await apiClient.post<ApiResponse<ApiProject>>('/projects', projectData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // PUT update project
  updateProject: async (id: number, projectData: any): Promise<ApiProject> => {
    try {
      const response = await apiClient.put<ApiResponse<ApiProject>>(`/projects/${id}`, projectData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating project with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE project
  deleteProject: async (id: number): Promise<ApiProject> => {
    try {
      const response = await apiClient.delete<ApiResponse<ApiProject>>(`/projects/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },

  // GET projects by status
  getProjectsByStatus: async (status: string): Promise<ApiProject[]> => {
    try {
      const response = await apiClient.get<ApiResponse<ApiProject[]>>(`/projects?status=${status}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching projects with status ${status}:`, error);
      throw error;
    }
  },
};