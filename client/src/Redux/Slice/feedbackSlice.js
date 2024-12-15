import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
  Feedback: [],
};
export const SubmitFeedback = createAsyncThunk(
  "feedback/Submit",
  async (data) => {
    console.log(data);
    try {
      const res = axiosInstance.post("/api/v3/user/SubmitFeedback", {
        data,
      });
      toast.promise(res, {
        loading: "please wait! submit feedback..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.message);
    }
  }
);
export const getFeedback = createAsyncThunk("feedback/get", async () => {
  try {
    const res = axiosInstance.get("/api/v3/user/getFeedback");
    toast.promise(res, {
      loading: "please wait! get feedback..",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.message);
  }
});
const FeedbackRedux = createSlice({
  name: "feedback",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getFeedback.fulfilled, (state, action) => {
      state.Feedback = action?.payload?.data;
    });
  },
});
export const {} = FeedbackRedux.actions;
export default FeedbackRedux.reducer;
