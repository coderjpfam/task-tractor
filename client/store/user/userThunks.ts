/**
 * User management thunks (async actions)
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import type {
  GetUsersResponse,
  GetUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from './userTypes';

/**
 * Get all users thunk
 */
export const getUsersThunk = createAsyncThunk<
  GetUsersResponse,
  void,
  { rejectValue: string }
>('user/getUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetUsersResponse>('/users');
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch users'
    );
  }
});

/**
 * Get single user thunk
 */
export const getUserThunk = createAsyncThunk<
  GetUserResponse,
  string,
  { rejectValue: string }
>('user/getUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetUserResponse>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch user'
    );
  }
});

/**
 * Create user thunk
 */
export const createUserThunk = createAsyncThunk<
  CreateUserResponse,
  CreateUserRequest,
  { rejectValue: string }
>('user/createUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<CreateUserResponse>('/users', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to create user'
    );
  }
});

/**
 * Update user thunk
 */
export const updateUserThunk = createAsyncThunk<
  UpdateUserResponse,
  UpdateUserRequest,
  { rejectValue: string }
>('user/updateUser', async (payload, { rejectWithValue }) => {
  try {
    const { userId, profilePic, ...updateData } = payload;

    // Create FormData for multipart/form-data request if profilePic is provided
    let requestData: FormData | Record<string, unknown>;
    let headers: Record<string, string> | undefined;

    if (profilePic) {
      const formData = new FormData();
      formData.append('profilePic', profilePic);
      
      // Append other fields to FormData
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      requestData = formData;
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    } else {
      requestData = updateData;
    }

    const response = await axiosInstance.put<UpdateUserResponse>(
      `/users/${userId}`,
      requestData,
      headers ? { headers } : undefined
    );

    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to update user'
    );
  }
});

/**
 * Delete user thunk
 */
export const deleteUserThunk = createAsyncThunk<
  DeleteUserResponse,
  string,
  { rejectValue: string }
>('user/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<DeleteUserResponse>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to delete user'
    );
  }
});
