import axios from 'axios';
import { ApiResponse } from './types';

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

// User API functions
export const userApi = {
  // GET current user profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/users/me');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // GET all users
  getUsers: async () => {
    try {
      const response = await apiClient.get<{ message: string; users: any[] }>('/user/');
      return response.data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // GET user by ID
  getUserById: async (id: number) => {
    try {
      const response = await apiClient.get<{ message: string; user: any }>(`/user/${id}`);
      return response.data.user;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  // POST create/invite user
  createUser: async (userData: { name: string; email: string; role: string; organization_id: number }) => {
    try {
      const response = await apiClient.post<{ message: string; user_id: number; invite_token?: string }>('/user/create', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // PUT update user
  updateUser: async (id: number, userData: { name?: string; email?: string; role?: string; organization_id?: number; status?: string }) => {
    try {
      const response = await apiClient.put<{ success: boolean; message: string; data: any }>(`/user/${id}`, userData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  },

  // DELETE user
  deleteUser: async (id: number) => {
    try {
      const response = await apiClient.delete<{ message: string }>(`/user/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  },

  // POST login
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post<ApiResponse<any>>(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // POST register
  register: async (userData: { email: string; password: string; name: string; role?: string }) => {
    try {
      const response = await axios.post<ApiResponse<any>>(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"}/auth/signup`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  // POST logout
  logout: async () => {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },

  // POST refresh token
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await axios.post<ApiResponse<any>>(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"}/auth/refresh`,
        { refresh_token: refreshToken }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },
};