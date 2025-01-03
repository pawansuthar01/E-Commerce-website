import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  product:
    localStorage.getItem("product") == undefined
      ? []
      : JSON.parse(localStorage.getItem("product")) || [],
  topProducts:
    localStorage.getItem("topProducts") == undefined
      ? []
      : JSON.parse(localStorage.getItem("topProducts")) || [],
  totalProducts: 10000,
};
export const getAllProduct = createAsyncThunk(
  "/product",
  async ({ page = 1, limit = 50 }) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.get(
        `/api/v3/Product?page=${page}&limit=${limit}`,
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

export const getSearchProduct = createAsyncThunk(
  "/product/get",
  async (data) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.get(
        `/api/v3/Product/Search?query=${encodeURIComponent(data)}`,
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
export const getProduct = createAsyncThunk("/product/get", async (id) => {
  try {
    const token = localStorage.getItem("Authenticator");

    const res = await axiosInstance.get(
      `/api/v3/Product/${id}`,

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
});
export const orderCountUpdate = createAsyncThunk(
  "/product/update",
  async ({ data, id }) => {
    console.log(data);
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.put(
        `/api/v3/Product/${id}`,

        data,

        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);
export const updateProduct = createAsyncThunk(
  "/product/update",
  async ({ data, id }) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.put(
        `/api/v3/Admin/Product/${id}`,

        data,

        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);

export const AddProductCard = createAsyncThunk(
  "/product/AddProduct",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.put(
        "/api/v3/Card/AddProduct",
        { productId: id },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);
export const RemoveProductCard = createAsyncThunk(
  "/product/RemoveProduct",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.put(
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

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);
export const AllRemoveCardProduct = createAsyncThunk(
  "/product/AllRemoveCardProduct",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.put(
        `/api/v3/Card/${id}/AllRemoveCardProduct`,
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

export const AddNewProduct = createAsyncThunk(
  "/product/AddNewProduct",
  async (data) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.post(
        "/api/v3/Admin/Product",

        data,
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);
export const LikeAndDisLike = createAsyncThunk(
  "/product/likeDisLike",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.put(
        `/api/v3/Product/${id}/like`,
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
export const DeleteProduct = createAsyncThunk(
  "Product/Delete",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: "DELETE_PRODUCT_OPTIMISTIC", payload: id });
      const token = localStorage.getItem("Authenticator");

      const res = await axiosInstance.delete(
        `/api/v3/Admin/Product/${id}`,

        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      thunkAPI.dispatch({ type: "DELETE_PRODUCT_SUCCESS" });
      return res.data;
    } catch (error) {
      thunkAPI.dispatch({
        type: "DELETE_PRODUCT_FAIL",
        payload: error.message || "An error occurred",
      });
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);
export const updateProductSuccess = (updatedProduct) => ({
  type: "UPDATE_PRODUCT_SUCCESS",
  payload: updatedProduct,
});
const productReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case "UPDATE_PRODUCT_SUCCESS":
      return {
        ...state,
        product: state.products.map((product) =>
          product._id === action.payload._id
            ? { ...product, ...action.payload } // Update the specific product
            : product
        ),
      };

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
    builder
      .addCase(getAllProduct.fulfilled, (state, action) => {
        if (action?.payload?.success) {
          state.product = action?.payload?.data;

          localStorage.setItem(
            "product",
            JSON.stringify(action?.payload?.data)
          );
          localStorage.setItem(
            "topProducts",
            JSON.stringify(action?.payload?.popularProducts)
          );
          state.topProducts = action?.payload?.popularProducts;
          state.totalProducts = action?.payload?.totalProducts;
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.product = state.product.map((product) =>
            product._id === action.payload.data._id
              ? { ...product, ...action.payload.data }
              : product
          );
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const {} = productRedux.actions;
export default productRedux.reducer;
