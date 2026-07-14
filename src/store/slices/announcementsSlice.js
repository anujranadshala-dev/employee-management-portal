import { createSlice } from "@reduxjs/toolkit";
import { announcementSeedData } from "../../data";

const initialState = {
  status: "idle",
  data: announcementSeedData,
};

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    setAnnouncements(state, action) {
      state.data = action.payload;
    },
    addAnnouncement(state, action) {
      state.data.unshift(action.payload);
    },
    resetAnnouncements(state) {
      state.data = announcementSeedData;
      state.status = "idle";
    },
  },
});

export const selectAnnouncements = (state) => state.announcements.data;

export const { setAnnouncements, addAnnouncement, resetAnnouncements } = announcementsSlice.actions;
export default announcementsSlice.reducer;