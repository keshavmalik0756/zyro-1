// API utilities and helper functions

// Type for API response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Type for paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common error handling
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return data.message || `Error ${status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

// Function to add query parameters to URL
export const buildQueryUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;
  
  const filteredParams = Object.keys(params).reduce((acc, key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  const searchParams = new URLSearchParams(filteredParams);
  return `${baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

// Function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Function to set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

// Function to remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
};