import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAnnouncements } from './announcementsSlice';
import { fetchEmployees } from './employeeSlice';
import { fetchDashboardStats } from './dashboardSlice';
import { fetchLeaveRequests } from './leaveSlice';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed.');
      }

      const { token, user } = await response.json();
      
      // Store token and user for session persistence
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // --- Dispatch data-fetching actions upon successful login ---
      dispatch(fetchEmployees());
      dispatch(fetchAnnouncements());
      dispatch(fetchDashboardStats());
      dispatch(fetchLeaveRequests());

      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;