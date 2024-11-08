import { configureStore } from "@reduxjs/toolkit";
import authSliceRedux from "./Slice/authSlice";
const Store = configureStore({
  reducer: {
    auth: authSliceRedux,
  },
  devTools: true,
});
export default Store;
