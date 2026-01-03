import axios from "axios";
import { ApiResponse } from "./types";

// Create axios instance
const apiClient = axios.create({
  withCredentials: true,
});

/* ======================================================
   🔹 Request Interceptor (Auth)
====================================================== */
apiClient.interceptors.request.use(
  (config) => {
    const authStateStr = localStorage.getItem("authState");
    let token: string | null = null;

    if (authStateStr) {
      try {
        const authState = JSON.parse(authStateStr);
        token = authState?.token;
      } catch {
        token = null;
      }
    }

    if (!token) {
      token = localStorage.getItem("access_token");
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    config.baseURL =
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:8000/api/v1";

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
      localStorage.removeItem("authState");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ======================================================
   🔹 Organization API
====================================================== */
export const organizationApi = {
  // GET all organizations
  getOrganizations: async () => {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>("/organization/");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },

  // POST create organization
  createOrganization: async (organizationData: {
    name: string;
    description?: string;
    data?: any;
  }) => {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        "/organization/",
        organizationData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },
};


