import axios from "axios";
import { ApiResponse } from "./types";

/* ======================================================
   🔹 AXIOS INSTANCE
====================================================== */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

/* ======================================================
   🔹 REQUEST INTERCEPTOR (AUTH)
====================================================== */

apiClient.interceptors.request.use((config) => {
  let token: string | null = null;

  try {
    const authState = localStorage.getItem("authState");
    if (authState) {
      token = JSON.parse(authState)?.token;
    }
  } catch {
    token = null;
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

  return config;
});

/* ======================================================
   🔹 RESPONSE INTERCEPTOR (TOKEN EXPIRY)
====================================================== */

apiClient.interceptors.response.use(
  (res) => res,
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
   🔹 TYPES
====================================================== */

export interface Log {
  id: number;
  issue_id: number;
  user_id?: number; // Optional since backend model doesn't have this field
  description: string | null;
  date: string;
  hour_worked: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLogRequest {
  issue_id: number;
  description?: string | null;
  date: string; // Format: YYYY-MM-DD
  hour_worked?: number;
}

export interface UpdateLogRequest {
  description?: string | null;
  date?: string; // Format: YYYY-MM-DD
  hour_worked?: number;
}

/* ======================================================
   🔹 LOGS API
====================================================== */

export const logsApi = {
  /* ===============================
     🔹 GET LOGS
  =============================== */

  getUserLogs: async (userId: number): Promise<Log[]> => {
    const res = await apiClient.get<ApiResponse<Log[]>>(`/logs?user_id=${userId}`);
    return res.data.data ?? [];
  },

  getLogById: async (logId: number): Promise<Log> => {
    const res = await apiClient.get<ApiResponse<Log>>(`/logs/${logId}`);
    return res.data.data;
  },

  /* ===============================
     🔹 CREATE LOG
  =============================== */

  create: async (payload: CreateLogRequest): Promise<Log> => {
    const res = await apiClient.post<ApiResponse<Log>>("/logs", payload);
    return res.data.data;
  },

  /* ===============================
     🔹 UPDATE LOG
  =============================== */

  update: async (logId: number, payload: UpdateLogRequest): Promise<Log> => {
    const res = await apiClient.patch<ApiResponse<Log>>(`/logs/${logId}`, payload);
    return res.data.data;
  },

  /* ===============================
     🔹 DELETE LOG
  =============================== */

  delete: async (logId: number): Promise<void> => {
    await apiClient.delete(`/logs/${logId}`);
  },
};

