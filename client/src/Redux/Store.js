import { configureStore } from "@reduxjs/toolkit";
import authSliceRedux from "./Slice/authSlice";
import PostSliceRedux from "./Slice/ContenrSlice";
import ProductRedux from "./Slice/ProductSlice";
import OrderRedux from "./Slice/OrderSlice";
import NotificationSliceRedux from "./Slice/notification.Slice";
const Store = configureStore({
  reducer: {
    auth: authSliceRedux,
    content: PostSliceRedux,
    product: ProductRedux,
    order: OrderRedux,
    notification: NotificationSliceRedux,
  },
  devTools: true,
});
export default Store;
