import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  Payment: [],
};
export const paymentCreate = createAsyncThunk(
  "/payment/create",
  async (data) => {
    try {
      const res = axiosInstance.post("/api/v3/Order/CreatePayment/new", {
        totalAmount: data,
      });
      toast.promise(res, {
        loading: "please wait! remove  product..",
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
export const checkPayment = createAsyncThunk("payment/check", async (data) => {
  try {
    const res = axiosInstance.post("/api/v3/Order/checkPayment", data);
    toast.promise(res, {
      loading: "please wait! remove  product..",
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

const PaymentRedux = createSlice({
  name: "payment",
  initialState,
  reducers: {},
});
export const {} = PaymentRedux.actions;
export default PaymentRedux.reducer;
