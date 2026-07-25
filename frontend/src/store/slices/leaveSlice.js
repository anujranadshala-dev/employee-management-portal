import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk for fetching all leave requests
export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchLeaveRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leave`);
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for submitting a new leave request
export const submitLeaveRequest = createAsyncThunk(
  'leave/submitLeaveRequest',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData),
      });
      if (!response.ok) throw new Error('Could not submit leave request.');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating leave status
export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leave/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Could not update leave status.');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    requests: [], // Start with an empty array, data will be fetched from API
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for async thunks here
    // Example for fetchLeaveRequests
    builder
      // Fetching
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Submitting
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload); // Add the new request to the state
      })
      // Updating
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload; // Update the existing request
        }
      });
  },
});

export const selectLeaveData = (state) => state.leave.requests;

export default leaveSlice.reducer;