import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data:
    localStorage.getItem("data") == undefined
      ? {}
      : JSON.parse(localStorage.getItem("data")),
};

const authSliceRedux = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  // extraReducers:
});
export const {} = authSliceRedux.actions;
export default authSliceRedux.reducer;
