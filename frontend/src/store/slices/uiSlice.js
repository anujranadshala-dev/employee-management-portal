import { createSlice, createSelector } from '@reduxjs/toolkit';

// Initial state for the UI slice
const initialState = {
  company: {
    // This will be populated on login
    user: null,
  },
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
    setSessionUser: (state, action) => {
      state.company.user = action.payload;
    },
    setSubmittingAnnouncement: (state, action) => {
      state.isSubmittingAnnouncement = action.payload;
    },
    resetUi: () => initialState,
  },
});
export const {
  openEmployeeForm, closeEmployeeForm, setUi, resetUi, setSubmittingAnnouncement, setSessionUser
} = uiSlice.actions;

export default uiSlice.reducer;

export const selectCompanyData = (state) => state.ui.company;
export const selectIsEmployeeFormOpen = (state) => state.ui.isEmployeeFormOpen;
export const selectEditingEmployeeId = (state) => state.ui.editingEmployeeId;
export const selectCurrentUser = (state) => state.ui.company.user;
export const selectIsSubmittingAnnouncement = (state) => state.ui.isSubmittingAnnouncement;