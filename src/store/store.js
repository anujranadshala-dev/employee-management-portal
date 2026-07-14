import { configureStore } from "@reduxjs/toolkit";
import announcementsSlice from "./slices/announcementsSlice";
import employeeSlice from "./slices/employeeSlice";
import leaveSlice from "./slices/leaveSlice";


const store = configureStore({
  reducer: {
    announcements: announcementsSlice,
    employees: employeeSlice,
    leave: leaveSlice,
  },
});

export default store;