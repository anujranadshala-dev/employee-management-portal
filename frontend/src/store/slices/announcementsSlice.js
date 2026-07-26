import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk for fetching all announcements
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Server error');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for posting a new announcement
export const postAnnouncement = createAsyncThunk(
  'announcements/postAnnouncement',
  async (announcementData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(announcementData),
      });
      if (!response.ok) throw new Error('Could not post announcement.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const announcementsSlice = createSlice({
  name: "announcements",
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(postAnnouncement.fulfilled, (state, action) => { state.items.unshift(action.payload); });
  },
});

export const selectAnnouncements = (state) => state.announcements.items;
export default announcementsSlice.reducer;