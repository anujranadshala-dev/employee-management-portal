/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const API_BASE_URL = 'http://localhost:5000/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for user login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // The backend now sets a cookie and returns the user data in the response body.
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to check auth status from localStorage on app load
// This now hits a backend endpoint to verify the cookie
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api(`${API_BASE_URL}/auth/me`);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Handle logout thunk lifecycle
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;