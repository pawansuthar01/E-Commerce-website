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
      const res = axiosInstance.get(`/api/v3/User/Notification`);

      toast.promise(res, {
        loading: "please wait! get notification..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);
export const NotificationRead = createAsyncThunk(
  "/Notification/read",
  async (id) => {
    try {
      const res = axiosInstance.put(`/api/v3/User/Notification/${id}`);

      toast.promise(res, {
        loading: "please wait! set to read notification..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);

const NotificationSliceRedux = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(NotificationGet.fulfilled, (state, action) => {
      console.log(action);
      if (action.payload) {
        console.log(action);
        state.Notification = action.payload.data;
      }
    });
  },
});
export const {} = NotificationSliceRedux.actions;
export default NotificationSliceRedux.reducer;
