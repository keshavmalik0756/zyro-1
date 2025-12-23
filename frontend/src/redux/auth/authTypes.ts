/* ---------------------------------- */
/* User Type */
/* ---------------------------------- */
export interface User {
  id: string;
  name: string;
  email: string;
}

/* ---------------------------------- */
/* Auth State */
/* ---------------------------------- */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/* ---------------------------------- */
/* Payload Types */
/* ---------------------------------- */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}