/**
 * User management related types for Redux store
 */

import type { User } from '../auth/authTypes';

/**
 * Get all users response
 */
export interface GetUsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

/**
 * Get single user response
 */
export interface GetUserResponse {
  success: boolean;
  data: User;
}

/**
 * Create user request payload
 */
export interface CreateUserRequest {
  email: string;
  fullName: string;
  departmentId: string;
}

/**
 * Create user response
 */
export interface CreateUserResponse {
  success: boolean;
  data: User;
  message: string;
}

/**
 * Update user request payload
 */
export interface UpdateUserRequest {
  userId: string;
  fullName?: string;
  email?: string;
  departmentId?: string;
  role?: 'admin' | 'manager' | 'team_lead' | 'employee';
  password?: string;
  profilePic?: File;
}

/**
 * Update user response
 */
export interface UpdateUserResponse {
  success: boolean;
  data: User;
}

/**
 * Delete user response
 */
export interface DeleteUserResponse {
  success: boolean;
  data: Record<string, never>;
}

/**
 * Async operation state
 */
export interface AsyncState {
  loading: boolean;
  error: string | null;
}

/**
 * User state structure
 */
export interface UserState {
  // List of users
  users: User[];
  usersCount: number;
  
  // Current selected user
  currentUser: User | null;
  
  // Individual loading and error states for each thunk
  getUsers: AsyncState;
  getUser: AsyncState;
  createUser: AsyncState;
  updateUser: AsyncState;
  deleteUser: AsyncState;
}
