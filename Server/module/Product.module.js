import { model, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: true,
      index: true,
    },
    gst: {
      type: Number,
      default: 18,
    },
    description: {
      type: String,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    ProductLikes: [
      {
        ProductLike: {
          type: Boolean,
          default: false,
        },
        userName: {
          type: String,
          required: [true, "A like must include a userName."],
        },
      },
    ],
    stock: {
      type: String,
      enum: ["In stock", "Out stock"],
      default: "In stock",
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", ProductSchema);
export default Product;
