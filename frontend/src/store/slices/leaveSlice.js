import { createSlice } from "@reduxjs/toolkit";
import { leaveRequestSeedData } from "../../data";


const initialState = {
  name: "leave",
  data: leaveRequestSeedData,
  status: "idle",
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    setLeave(state, action) {
      state.data = action.payload;
    },
    addLeave(state, action) {
      state.data.unshift(action.payload);
    },
    updateLeave(state, action) {
      // We expect action.payload to be an object: { id: "123", status: "Approved" }
      const { id, status } = action.payload;

      const index = state.data.findIndex((leave) => leave.id === id);

      if (index !== -1) {
        state.data[index].status = status;
      }
    },
    resetLeave(state) {
      state.data = leaveRequestSeedData;
      state.status = "idle";
    },
  },
});

export const selectLeaveData = (state) => state.leave.data;

export const { setLeave, addLeave, updateLeave, resetLeave } = leaveSlice.actions;
export default leaveSlice.reducer;