/**
 * Authentication thunks (async actions)
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LogoutRequest,
  RegisterInvitedUserRequest,
  RegisterInvitedUserResponse,
  VerifyRegisterTokenRequest,
  VerifyRegisterTokenResponse,
} from './authTypes';

/**
 * Login thunk
 */
export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean } & LoginResponse>(
      '/auth/login',
      credentials
    );

    const data = response.data;

    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    }

    return {
      user: data.user,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Login failed'
    );
  }
});

/**
 * Logout thunk
 */
export const logoutThunk = createAsyncThunk<
  { success: boolean; message: string },
  LogoutRequest | undefined,
  { rejectValue: string }
>('auth/logout', async (payload, { rejectWithValue }) => {
  try {
    const refreshToken = payload?.refresh_token || 
      (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);

    if (refreshToken) {
      await axiosInstance.post<{ success: boolean; message: string }>('/auth/logout', {
        refresh_token: refreshToken,
        all_devices: payload?.all_devices || false,
      });
    }

    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    // Even if API call fails, clear local tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return rejectWithValue(
      error instanceof Error ? error.message : 'Logout failed'
    );
  }
});

/**
 * Refresh token thunk
 */
export const refreshTokenThunk = createAsyncThunk<
  RefreshTokenResponse,
  RefreshTokenRequest | undefined,
  { rejectValue: string }
>('auth/refresh', async (payload, { rejectWithValue }) => {
  try {
    const refreshToken = payload?.refresh_token ||
      (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);

    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const response = await axiosInstance.post<{ success: boolean } & RefreshTokenResponse>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );

    const data = response.data;

    // Update access token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.access_token);
    }

    return {
      user: data.user,
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    // If refresh fails, clear tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return rejectWithValue(
      error instanceof Error ? error.message : 'Token refresh failed'
    );
  }
});

/**
 * Forgot password thunk
 */
export const forgotPasswordThunk = createAsyncThunk<
  { success: boolean; message: string },
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; message: string }>(
      '/auth/forgot-password',
      payload
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to send reset email'
    );
  }
});

/**
 * Reset password thunk
 */
export const resetPasswordThunk = createAsyncThunk<
  { success: boolean; message: string },
  ResetPasswordRequest,
  { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; message: string }>(
      '/auth/reset-password',
      payload
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Password reset failed'
    );
  }
});

/**
 * Change password thunk
 */
export const changePasswordThunk = createAsyncThunk<
  { success: boolean; message: string },
  ChangePasswordRequest,
  { rejectValue: string }
>('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<{ success: boolean; message: string }>(
      '/auth/change-password',
      payload
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Password change failed'
    );
  }
});

/**
 * Verify register token thunk
 */
export const verifyRegisterTokenThunk = createAsyncThunk<
  VerifyRegisterTokenResponse,
  VerifyRegisterTokenRequest,
  { rejectValue: string }
>('auth/verifyRegisterToken', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<VerifyRegisterTokenResponse>(
      '/auth/verify-register-token',
      {
        params: {
          token: payload.token,
        },
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Token verification failed'
    );
  }
});

/**
 * Register invited user thunk
 */
export const registerInvitedUserThunk = createAsyncThunk<
  RegisterInvitedUserResponse,
  RegisterInvitedUserRequest,
  { rejectValue: string }
>('auth/registerInvitedUser', async (payload, { rejectWithValue }) => {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('token', payload.token);
    formData.append('fullName', payload.fullName);
    formData.append('password', payload.password);
    formData.append('password_confirmation', payload.password_confirmation);
    
    // Append profile picture if provided
    if (payload.profilePic) {
      formData.append('profilePic', payload.profilePic);
    }

    const response = await axiosInstance.post<RegisterInvitedUserResponse>(
      '/auth/register-invited',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Registration failed'
    );
  }
});
