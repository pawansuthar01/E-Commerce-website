import { model, Schema } from "mongoose";
const OrderSchema = new Schema({
  userId: {
    type: String,
    required: [true, "userId is required..."],
    ref: "User",
  },
  products: [
    {
      productId: { type: String, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  orderStats: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Canceled"],
    default: "Processing",
  },
  createdAt: { type: Date, default: Date.now },
});
const Order = model("Order", OrderSchema);
export default Order;
