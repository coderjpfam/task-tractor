/**
 * Authentication related types for Redux store
 */

/**
 * User data structure
 */
export interface User {
  userId: string;
  fullName: string;
  email: string;
  profilePath?: string;
  departmentId?: string;
  role: 'admin' | 'manager' | 'team_lead' | 'employee';
  createdAt?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

/**
 * Login response
 */
export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

/**
 * Forgot password request payload
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request payload
 */
export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Change password request payload
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

/**
 * Logout request payload
 */
export interface LogoutRequest {
  refresh_token?: string;
  all_devices?: boolean;
}

/**
 * Async operation state
 */
export interface AsyncState {
  loading: boolean;
  error: string | null;
}

/**
 * Auth state structure
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Individual loading and error states for each thunk
  login: AsyncState;
  logout: AsyncState;
  refresh: AsyncState;
  forgotPassword: AsyncState;
  resetPassword: AsyncState;
  changePassword: AsyncState;
  
  // General auth state
  isAuthenticated: boolean;
}
