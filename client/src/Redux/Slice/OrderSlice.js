import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosInstance";

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

export const getOrder = createAsyncThunk("Order/get", async (id) => {
  try {
    const res = axiosInstance.get(`/api/v3/Order/${id}`);
    toast.promise(res, {
      loading: "please wait ! Order get...",
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
export const UpdateOrder = createAsyncThunk(
  "Order/updateOrder",
  async (data) => {
    try {
      const res = axiosInstance.put(`/api/v3/Order/${data.id}`, data);
      toast.promise(res, {
        loading: "please wait ! Order get...",
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

export const CancelOrder = createAsyncThunk("Order/updateOrder", async (id) => {
  try {
    const res = axiosInstance.put(`/api/v3/Order/${id}/CancelOrder`);
    toast.promise(res, {
      loading: "please wait ! Order get...",
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

export const AllOrder = createAsyncThunk("Order/Orders", async () => {
  try {
    const res = axiosInstance.get(`/api/v3/Admin/Order`);
    toast.promise(res, {
      loading: "please wait ! Orders loading...",
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
