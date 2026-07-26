import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import announcementsReducer from './slices/announcementsSlice';
import uiReducer from './slices/uiSlice';
import dashboardReducer from './slices/dashboardSlice';
import leaveReducer from './slices/leaveSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    announcements: announcementsReducer,
    leave: leaveReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
});