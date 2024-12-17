import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  Carousel: [],
};
export const getAllCarousel = createAsyncThunk(
  "/carousel/getallCarousel",
  async () => {
    try {
      const res = axiosInstance.get(`/api/v3/user/getAllCarousel`);
      toast.promise(res, {
        loading: "Loading carousel...",
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

export const getCarousel = createAsyncThunk("/Carousel/get", async (id) => {
  try {
    const res = axiosInstance.get(`/api/v3/Carousel/${id}`);
    toast.promise(res, {
      loading: "please wait! loading Carousel..",
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
export const updateCarousel = createAsyncThunk(
  "/Carousel/update",
  async (data) => {
    try {
      console.log(data);
      const res = axiosInstance.put(`/api/v3/Admin/Carousel/${data.id}`, data);
      toast.promise(res, {
        loading: "please wait! update Carousel..",
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

export const AddNewCarousel = createAsyncThunk(
  "/product/AddNewProduct",
  async (data) => {
    console.log(data);
    try {
      const res = axiosInstance.post("/api/v3/Admin/Carousel", data);
      toast.promise(res, {
        loading: "please wait! Add Carousel ...",
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

const CarouselRedux = createSlice({
  name: "carousel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCarousel.fulfilled, (state, action) => {
      state.Carousel = action?.payload?.data;
    });
  },
});
export const {} = CarouselRedux.actions;
export default CarouselRedux.reducer;
