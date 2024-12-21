import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  product: [],
  topProducts: [],
  totalProducts: 10000,
};
export const getAllProduct = createAsyncThunk(
  "/product",
  async ({ page = 1, limit = 50 }) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.get(
        `/api/v3/Product?page=${page}&limit=${limit}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.promise(res, {
        loading: "Loading products...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message || "Failed to load products.");
      throw e; // Re-throw the error to handle it in components if needed
    }
  }
);

export const getSearchProduct = createAsyncThunk(
  "/product/get",
  async (data) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.get(
        `/api/v3/Product/Search?query=${encodeURIComponent(data)}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
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
    const token = localStorage.getItem("Authenticator");

    const res = axiosInstance.get(
      `/api/v3/Product/${id}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
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
export const updateProduct = createAsyncThunk(
  "/product/update",
  async (data) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.put(
        `/api/v3/Admin/Product/${data.id}`,
        {
          data,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );
      toast.promise(res, {
        loading: "please wait! update product..",
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

export const AddProductCard = createAsyncThunk(
  "/product/AddProduct",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.put(
        "/api/v3/Card/AddProduct",
        { productId: id },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

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
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.put(
        "/api/v3/Card/v2/RemoveProduct",
        {
          productId: id,
        },
        {
          headers: {
            Authorization: ` ${token}`,
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
  }
);
export const AllRemoveCardProduct = createAsyncThunk(
  "/product/AllRemoveCardProduct",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.put(
        `/api/v3/Card/${id}/AllRemoveCardProduct`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

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
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.post(
        "/api/v3/Admin/Product",
        {
          data,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );
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
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.put(
        `/api/v3/Product/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
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
export const DeleteProduct = createAsyncThunk("Product/Delete", async (id) => {
  dispatch({ type: "DELETE_PRODUCT_OPTIMISTIC", payload: id });
  try {
    const token = localStorage.getItem("Authenticator");

    const res = axiosInstance.delete(
      `/api/v3/Admin/Product/${id}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    toast.promise(res, {
      loading: "please wait! Delete product..",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });
    dispatch({ type: "DELETE_PRODUCT_SUCCESS" });
    return (await res).data;
  } catch (error) {
    dispatch({ type: "DELETE_PRODUCT_FAIL", payload: error.message });
    toast.error(error?.response?.message);
  }
});
const productReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case "DELETE_PRODUCT_OPTIMISTIC":
      return {
        ...state,
        products: state.products.filter((p) => p._id !== action.payload),
      };
    case "DELETE_PRODUCT_FAIL":
      return { ...state, error: action.payload }; // Optionally handle error
    default:
      return state;
  }
};

const productRedux = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProduct.fulfilled, (state, action) => {
      if (action?.payload?.success) {
        state.product = action?.payload?.data;
        state.topProducts = action?.payload?.popularProducts;
        state.totalProducts = action?.payload?.totalProducts;
      }
    });
  },
});
export const {} = productRedux.actions;
export default productRedux.reducer;
