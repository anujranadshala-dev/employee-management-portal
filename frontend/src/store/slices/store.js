import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import employeeReducer from './slices/employeeSlice';
import leaveReducer from './slices/leaveSlice';
import announcementsReducer from './slices/announcementsSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    employees: employeeReducer,
    leave: leaveReducer,
    announcements: announcementsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;