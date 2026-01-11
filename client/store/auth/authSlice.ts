/**
 * Authentication slice
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './authTypes';
import {
  loginThunk,
  logoutThunk,
  refreshTokenThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  changePasswordThunk,
} from './authThunks';

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  
  // Individual loading and error states for each thunk
  login: {
    loading: false,
    error: null,
  },
  logout: {
    loading: false,
    error: null,
  },
  refresh: {
    loading: false,
    error: null,
  },
  forgotPassword: {
    loading: false,
    error: null,
  },
  resetPassword: {
    loading: false,
    error: null,
  },
  changePassword: {
    loading: false,
    error: null,
  },
  
  isAuthenticated: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clear auth state (for logout or token expiration)
     */
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      // Clear all errors
      state.login.error = null;
      state.logout.error = null;
      state.refresh.error = null;
      state.forgotPassword.error = null;
      state.resetPassword.error = null;
      state.changePassword.error = null;
    },
    
    /**
     * Set user data
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    
    /**
     * Set tokens
     */
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    
    /**
     * Clear specific error
     */
    clearError: (state, action: PayloadAction<keyof AuthState>) => {
      const key = action.payload;
      if (key === 'login' || key === 'logout' || key === 'refresh' || 
          key === 'forgotPassword' || key === 'resetPassword' || key === 'changePassword') {
        state[key].error = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.login.loading = true;
        state.login.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.error = null;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.payload || 'Login failed';
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.logout.loading = true;
        state.logout.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.logout.loading = false;
        state.logout.error = null;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.logout.loading = false;
        state.logout.error = action.payload || 'Logout failed';
        // Clear state even if API call fails
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Refresh token
    builder
      .addCase(refreshTokenThunk.pending, (state) => {
        state.refresh.loading = true;
        state.refresh.error = null;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.refresh.loading = false;
        state.refresh.error = null;
        state.accessToken = action.payload.access_token;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.refresh.loading = false;
        state.refresh.error = action.payload || 'Token refresh failed';
        // Clear auth state on refresh failure
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Forgot password
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = action.payload || 'Failed to send reset email';
      });

    // Reset password
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload || 'Password reset failed';
      });

    // Change password
    builder
      .addCase(changePasswordThunk.pending, (state) => {
        state.changePassword.loading = true;
        state.changePassword.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.changePassword.loading = false;
        state.changePassword.error = null;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.changePassword.loading = false;
        state.changePassword.error = action.payload || 'Password change failed';
      });
  },
});

export const { clearAuth, setUser, setTokens, clearError } = authSlice.actions;
export default authSlice.reducer;
