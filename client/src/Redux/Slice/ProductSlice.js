import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  product: [],
};
export const getAllProduct = createAsyncThunk("/product", async () => {
  try {
    console.log("joo");

    const res = axiosInstance.get("/api/v3/Product/");
    toast.promise(res, {
      loading: "please wait! loading product..",
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
export const getSearchProduct = createAsyncThunk(
  "/product/get",
  async (data) => {
    console.log(data);
    try {
      const res = axiosInstance.get(`/api/v3/Product/Search/${data}`, data);
      toast.promise(res, {
        loading: "please wait! Search product..",
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
export const getProduct = createAsyncThunk("/product/get", async (id) => {
  try {
    const res = axiosInstance.get(`/api/v3/Product/${id}`);
    toast.promise(res, {
      loading: "please wait! loading product..",
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

export const AddProductCard = createAsyncThunk(
  "/product/AddProduct",
  async (id) => {
    try {
      const res = axiosInstance.put("/api/v3/Card/AddProduct", {
        productId: id,
      });
      toast.promise(res, {
        loading: "please wait! Add product..",
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
export const RemoveProductCard = createAsyncThunk(
  "/product/RemoveProduct",
  async (id) => {
    try {
      const res = axiosInstance.put("/api/v3/Card/v2/RemoveProduct", {
        productId: id,
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
export const AllRemoveCardProduct = createAsyncThunk(
  "/product/AllRemoveCardProduct",
  async (id) => {
    try {
      const res = axiosInstance.put(`/api/v3/Card/${id}/AllRemoveCardProduct`);

      toast.promise(res, {
        loading: "please wait!  product..",
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

export const AddNewProduct = createAsyncThunk(
  "/product/AddNewProduct",
  async (data) => {
    try {
      const res = axiosInstance.post("/api/v3/Admin/Product", data);
      toast.promise(res, {
        loading: "please wait! Add product ...",
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
export const LikeAndDisLike = createAsyncThunk(
  "/product/likeDisLike",
  async (id) => {
    try {
      const res = axiosInstance.put(`/api/v3/Product/${id}`);
      toast.promise(res, {
        loading: "please wait! like product..",
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

const productRedux = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProduct.fulfilled, (state, action) => {
      console.log(action);
      state.product = action?.payload?.data;
    });
  },
});
export const {} = productRedux.actions;
export default productRedux.reducer;
