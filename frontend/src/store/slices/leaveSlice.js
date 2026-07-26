import { createSlice, createEntityAdapter, createSelector, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk for fetching leave requests
export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/leave`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leave requests.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating leave request status
export const updateLeaveStatus = createAsyncThunk(
  'leave/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/leave/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update leave request status.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for submitting a new leave request
export const submitLeaveRequest = createAsyncThunk(
  'leave/submitRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit leave request.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const leaveAdapter = createEntityAdapter({
  selectId: (request) => request.id,
  sortComparer: (a, b) => new Date(b.startDate) - new Date(a.startDate),
});

const initialState = leaveAdapter.getInitialState({
  status: 'idle',
  error: null,
});

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        leaveAdapter.setAll(state, action.payload);
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        leaveAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        leaveAdapter.addOne(state, action.payload);
      })
  },
});

export default leaveSlice.reducer;

export const {
  selectAll: selectAllLeaveRequests,
  selectById: selectLeaveRequestById,
} = leaveAdapter.getSelectors((state) => state.leave);

export const selectLeaveData = createSelector(
  [selectAllLeaveRequests, (state, session) => session],
  (requests, session) => {
    if (!session) return { myRequests: [], teamRequests: [] };

    // Filter requests submitted by the current user
    const myRequests = requests.filter(r => r.employeeId === session.id);

    // For managers and admins, get all requests that are not their own.
    // A future improvement could be to filter by department for managers.
    let teamRequests = [];
    if (session.isDepartmentManager || session.isAdmin) {
      teamRequests = requests; // For now, show all requests to authorized users
    }

    return { myRequests, teamRequests };
  }
);

// It's good practice to create separate, more specific selectors for components to use.
export const selectMyLeaveRequests = (state) => selectLeaveData(state, state.auth.user).myRequests;
export const selectTeamLeaveRequests = (state) => selectLeaveData(state, state.auth.user).teamRequests;