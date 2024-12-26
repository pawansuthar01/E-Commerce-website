import toast from "react-hot-toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";

const initialState = {
  Module: [],
};
export const ModuleUpload = createAsyncThunk("/Module/create", async (data) => {
  console.log("data=>", data);
  const res = axiosInstance.post("/api/v3/Admin/pdf", data);
  toast.promise(res, {
    loading: "please wait! upload pdf ..",
    success: (data) => {
      return data?.data?.message;
    },

    error: (data) => {
      return data?.response?.data?.message;
    },
  });
  return (await res).data;
  //   } catch (e) {
  //     toast.error(e?.response?.message);
  //   }
});
const ModuleRedux = createSlice({
  name: "Module",
  initialState,
  reducers: {},
});
export const {} = ModuleRedux.actions;
export default ModuleRedux.reducer;
