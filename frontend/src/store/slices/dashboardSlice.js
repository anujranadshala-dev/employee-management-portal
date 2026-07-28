import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api(`${API_BASE_URL}/dashboard/stats`);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  stats: {
    totalEmployees: 0,
    onLeave: 0,
    averageTenure: 0,
  },
  status: 'idle',
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Future reducers can go here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectDashboardStatus = (state) => state.dashboard.status;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;