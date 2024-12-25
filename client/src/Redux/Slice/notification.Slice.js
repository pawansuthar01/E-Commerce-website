import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
  Notification: [],
};

export const NotificationGet = createAsyncThunk(
  "/Notification/get",
  async () => {
    try {
      const token = localStorage.getItem("Authenticator");
      const res = await axiosInstance.get(`/api/v3/User/Notification`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);
export const NotificationRead = createAsyncThunk(
  "/Notification/read",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");
      const res = await axiosInstance.put(
        `/api/v3/User/Notification/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);

const NotificationSliceRedux = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(NotificationGet.fulfilled, (state, action) => {
      if (action.payload?.success) {
        state.Notification = action.payload.data;
      }
    });
  },
});
export const {} = NotificationSliceRedux.actions;
export default NotificationSliceRedux.reducer;
