import { createSlice, createSelector } from '@reduxjs/toolkit';
import { companySeedData } from '../../data';
import { buildDashboardStats } from '../../data/stats';
import { selectAllEmployees } from './employeeSlice';
import { selectLeaveData } from './leaveSlice';
import { selectAnnouncements } from './announcementsSlice';

const initialState = {
  company: companySeedData[0],
  isEmployeeFormOpen: false,
  editingEmployeeId: null, // Store only the ID
  isSubmittingAnnouncement: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openEmployeeForm: (state, action) => {
      state.isEmployeeFormOpen = true;
      state.editingEmployeeId = action.payload?.employeeId || null; // Expects an object { employeeId } or nothing
    },
    closeEmployeeForm: (state) => {
      state.isEmployeeFormOpen = false;
      state.editingEmployeeId = null;
    },
    setUi: (state, action) => {
      state.company = action.payload;
    },
    setSubmittingAnnouncement: (state, action) => {
      state.isSubmittingAnnouncement = action.payload;
    },
    resetUi: () => initialState,
  },
});
export const {
  openEmployeeForm, closeEmployeeForm, setUi, resetUi, setSubmittingAnnouncement
} = uiSlice.actions;

export default uiSlice.reducer;

export const selectCompanyData = (state) => state.ui.company;
export const selectIsEmployeeFormOpen = (state) => state.ui.isEmployeeFormOpen;
export const selectEditingEmployeeId = (state) => state.ui.editingEmployeeId;

export const selectIsSubmittingAnnouncement = (state) => state.ui.isSubmittingAnnouncement;
/**
 * Memoized selector for dashboard statistics.
 * This selector takes the employees, leave requests, and announcements from the state
 * and uses the buildDashboardStats function to compute derived statistics.
 * The result is memoized, so the stats are only recalculated when the underlying data changes.
 */
export const selectDashboardStats = createSelector(
  [selectAllEmployees, selectLeaveData, selectAnnouncements],
  (employees, leaveRequests, announcements) => buildDashboardStats(employees, leaveRequests, announcements)
);