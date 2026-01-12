/**
 * User management slice
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../auth/authTypes';
import type { UserState } from './userTypes';
import {
  getUsersThunk,
  getUserThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from './userThunks';

// Initial state
const initialState: UserState = {
  users: [],
  usersCount: 0,
  currentUser: null,
  
  // Individual loading and error states for each thunk
  getUsers: {
    loading: false,
    error: null,
  },
  getUser: {
    loading: false,
    error: null,
  },
  createUser: {
    loading: false,
    error: null,
  },
  updateUser: {
    loading: false,
    error: null,
  },
  deleteUser: {
    loading: false,
    error: null,
  },
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Clear current user
     */
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    
    /**
     * Set current user
     */
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    
    /**
     * Clear users list
     */
    clearUsers: (state) => {
      state.users = [];
      state.usersCount = 0;
    },
    
    /**
     * Clear specific error
     */
    clearError: (state, action: PayloadAction<keyof UserState>) => {
      const key = action.payload;
      if (key === 'getUsers' || key === 'getUser' || key === 'createUser' || 
          key === 'updateUser' || key === 'deleteUser') {
        state[key].error = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Get all users
    builder
      .addCase(getUsersThunk.pending, (state) => {
        state.getUsers.loading = true;
        state.getUsers.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.getUsers.loading = false;
        state.getUsers.error = null;
        state.users = action.payload.data;
        state.usersCount = action.payload.count;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.getUsers.loading = false;
        state.getUsers.error = action.payload || 'Failed to fetch users';
      });

    // Get single user
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.getUser.loading = true;
        state.getUser.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.getUser.loading = false;
        state.getUser.error = null;
        state.currentUser = action.payload.data;
        
        // Also update the user in the users list if it exists
        const userIndex = state.users.findIndex(
          (u) => u.userId === action.payload.data.userId
        );
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload.data;
        }
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.getUser.loading = false;
        state.getUser.error = action.payload || 'Failed to fetch user';
      });

    // Create user
    builder
      .addCase(createUserThunk.pending, (state) => {
        state.createUser.loading = true;
        state.createUser.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.createUser.loading = false;
        state.createUser.error = null;
        // Add new user to the beginning of the list
        state.users.unshift(action.payload.data);
        state.usersCount += 1;
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.createUser.loading = false;
        state.createUser.error = action.payload || 'Failed to create user';
      });

    // Update user
    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.updateUser.loading = true;
        state.updateUser.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.updateUser.loading = false;
        state.updateUser.error = null;
        const updatedUser = action.payload.data;
        
        // Update in users list
        const userIndex = state.users.findIndex(
          (u) => u.userId === updatedUser.userId
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        
        // Update current user if it's the same user
        if (state.currentUser?.userId === updatedUser.userId) {
          state.currentUser = updatedUser;
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.updateUser.loading = false;
        state.updateUser.error = action.payload || 'Failed to update user';
      });

    // Delete user
    builder
      .addCase(deleteUserThunk.pending, (state) => {
        state.deleteUser.loading = true;
        state.deleteUser.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.deleteUser.loading = false;
        state.deleteUser.error = null;
        // Remove user from list (the userId is in the action meta)
        const userId = action.meta.arg;
        state.users = state.users.filter((u) => u.userId !== userId);
        state.usersCount -= 1;
        
        // Clear current user if it's the deleted user
        if (state.currentUser?.userId === userId) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.deleteUser.loading = false;
        state.deleteUser.error = action.payload || 'Failed to delete user';
      });
  },
});

export const { clearCurrentUser, setCurrentUser, clearUsers, clearError } = userSlice.actions;
export default userSlice.reducer;
