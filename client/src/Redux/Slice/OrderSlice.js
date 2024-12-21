import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
  Orders: [],
};
export const PlaceOrder = createAsyncThunk("Order/Place", async (data) => {
  try {
    const token = localStorage.getItem("Authenticator");
    const res = axiosInstance.post("/api/v3/Order/PlaceOrder", data, {
      headers: {
        Authorization: `${token}`,
      },
    });
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
    const token = localStorage.getItem("Authenticator");
    const res = axiosInstance.get(
      `/api/v3/Order/${id}`,

      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
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
      const token = localStorage.getItem("Authenticator");
      const res = axiosInstance.put(
        `/api/v3/Order/${data.id}`,

        data,

        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
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
    const token = localStorage.getItem("Authenticator");
    const res = axiosInstance.put(
      `/api/v3/Order/${id}/CancelOrder`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
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
    const token = localStorage.getItem("Authenticator");
    const res = axiosInstance.get(`/api/v3/Admin/Order`, {
      headers: {
        Authorization: `${token}`,
      },
    });
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
    builder.addCase(getOrder.fulfilled, (state, action) => {
      if (action?.payload?.success) {
        state.Orders = action?.payload?.data;
      }
    });
  },
});
export const {} = OrderRedux.actions;
export default OrderRedux.reducer;
