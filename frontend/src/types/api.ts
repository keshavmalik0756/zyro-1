// ======================================================
// 🔹 API ERROR TYPES
// ======================================================

export interface ApiError extends Error {
  message: string;
  status?: number;
  response?: any;
}

export class ApiErrorImpl extends Error implements ApiError {
  status?: number;
  response?: any;

  constructor(message: string, status?: number, response?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

// ======================================================
// 🔹 API RESPONSE TYPES
// ======================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ======================================================
// 🔹 PAGINATION TYPES
// ======================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
