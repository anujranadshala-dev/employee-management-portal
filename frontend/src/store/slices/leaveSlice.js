import { createSlice, createEntityAdapter, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';
import { selectEmployeeEntities } from './employeeSlice';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk for fetching leave requests
export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api(`${API_BASE_URL}/leave`);
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
      const response = await api(`${API_BASE_URL}/leave/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
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
      const response = await api(`${API_BASE_URL}/leave`, {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
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

    const myRequests = requests.filter(r => r.employeeId === session.id);

    return { myRequests };
  }
);

// It's good practice to create separate, more specific selectors for components to use.
export const selectMyLeaveRequests = createSelector(
  [selectAllLeaveRequests, (state) => state.auth.user],
  (requests, session) => {
    if (!session) return [];
    return requests.filter(r => r.employeeId === session.id);
  }
);

// Selects pending requests that the current user needs to action.
export const selectPendingTeamRequests = createSelector(
  [selectAllLeaveRequests, selectEmployeeEntities, (state) => state.auth.user],
  (allRequests, employeeEntities, session) => {
    if (!session || (!session.isAdmin && !session.isDepartmentManager)) {
      return [];
    }

    return allRequests.filter(req => {
      if (req.status !== 'Pending') return false;
      const employee = employeeEntities[req.employeeId];
      if (!employee) return false;

      // Admins can see ALL pending requests.
      if (session.isAdmin) {
        return true;
      }

      // Department Managers see pending requests from their own department (excluding other managers).
      if (session.isDepartmentManager && employee.department === session.department && !employee.isDepartmentManager && req.employeeId !== session.id) {
        return true;
      }

      return false;
    });
  }
);

// Selector to get approved and upcoming leave for the user's department colleagues
export const selectTeammatesOnLeave = createSelector(
  [selectAllLeaveRequests, selectEmployeeEntities, (state) => state.auth.user],
  (allRequests, employeeEntities, session) => {
    if (!session || !allRequests.length) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Consider leave from the start of today

    return allRequests.filter(req => {
      const employee = employeeEntities[req.employeeId];
      return (
        employee &&
        employee.department === session.department && // Teammate is in the same department
        req.employeeId !== session.id && // Not the user's own leave
        req.status === 'Approved' && // Only show approved leave
        new Date(req.endDate) >= today // The leave period is current or in the future
      );
    });
  }
);