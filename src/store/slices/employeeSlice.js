import { createSlice } from "@reduxjs/toolkit";
import { employeeSeedData } from "../../data";

const initialState = {
  status: "idle",
  data: employeeSeedData,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees(state, action) {
      state.data = action.payload;
    },
    addEmployee(state, action) {
      state.data.unshift(action.payload);
    },
    updateEmployee(state, action) {
      const index = state.data.findIndex((employee) => employee.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    resetEmployees(state) {
      state.data = employeeSeedData;
      state.status = "idle";
    },
    deleteEmployee(state, action) {
      state.data = state.data.filter((employee) => employee.id !== action.payload);
    },
  },
});

export const selectEmployees = (state) => state.employees.data;

export const { setEmployees, addEmployee, updateEmployee, resetEmployees, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;