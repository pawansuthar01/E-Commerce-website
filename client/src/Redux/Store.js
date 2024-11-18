import { configureStore } from "@reduxjs/toolkit";
import authSliceRedux from "./Slice/authSlice";
import PostSliceRedux from "./Slice/ContenrSlice";
import ProductRedux from "./Slice/ProductSlice";
import OrderRedux from "./Slice/OrderSlice";
const Store = configureStore({
  reducer: {
    auth: authSliceRedux,
    content: PostSliceRedux,
    product: ProductRedux,
    order: OrderRedux,
  },
  devTools: true,
});
export default Store;
