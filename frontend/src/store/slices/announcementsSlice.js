import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk for fetching all announcements
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api(`${API_BASE_URL}/announcements`);
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
      const response = await api(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        body: JSON.stringify(announcementData),
      });
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