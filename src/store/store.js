import { configureStore } from "@reduxjs/toolkit";
import announcementsSlice from "./slices/announcementsSlice";
import employeeSlice from "./slices/employeeSlice";
import leaveSlice from "./slices/leaveSlice";
import uiSlice from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    announcements: announcementsSlice,
    employees: employeeSlice,
    leave: leaveSlice,
    ui: uiSlice,
  },
});

export default store;