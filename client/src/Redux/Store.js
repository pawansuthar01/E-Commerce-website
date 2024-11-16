import { configureStore } from "@reduxjs/toolkit";
import authSliceRedux from "./Slice/authSlice";
import PostSliceRedux from "./Slice/ContenrSlice";
import ProductRedux from "./Slice/ProductSlice";
const Store = configureStore({
  reducer: {
    auth: authSliceRedux,
    content: PostSliceRedux,
    product: ProductRedux,
  },
  devTools: true,
});
export default Store;
