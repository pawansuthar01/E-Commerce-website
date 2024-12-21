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
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.post(
        "/api/v3/Order/CreatePayment/new",
        {
          totalAmount: data,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.promise(res, {
        loading: "please wait! payment ..",
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
    const token = localStorage.getItem("Authenticator");

    const res = axiosInstance.post(
      "/api/v3/Order/PaymentVerify/verify",

      data,

      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
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
export const getPaymentRecord = createAsyncThunk(
  "/payments/record",
  async () => {
    try {
      const token = localStorage.getItem("Authenticator");

      const response = axiosInstance.get("/api/v3/Admin/Payment?count=100", {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.promise(response, {
        loading: "Getting the payment records",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to get payment records",
      });
      return (await response).data;
    } catch (error) {
      toast.error("Operation failed");
    }
  }
);

const PaymentRedux = createSlice({
  name: "payment",
  initialState,
  reducers: {},
});
export const {} = PaymentRedux.actions;
export default PaymentRedux.reducer;
