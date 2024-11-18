import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  Orders: [],
};
export const PlaceOrder = createAsyncThunk("Order/Place", async (data) => {
  try {
    const res = axiosInstance.post("/api/v3/Order/PlaceOrder", data);
    toast.promise(res, {
      loading: "please wait ! Order is Place...",
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
});

const OrderRedux = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(PlaceOrder.fulfilled, (state, action) => {
      console.log(action);
      state.Orders = action?.payload?.data;
    });
  },
});
export const {} = OrderRedux.actions;
export default OrderRedux.reducer;
