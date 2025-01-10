import Router from "express";
import { isLoggedIn } from "../Middleware/authMiddleware.js";
import {
  checkInStock,
  getAllProduct,
  getProduct,
  getSearchProduct,
  LikeAndDisLikeProduct,
  OrderCount,
  productUpdate,
} from "../Controllers/Product.Controller.js";
const ProductRouter = Router();
ProductRouter.get("/", getAllProduct);
ProductRouter.get("/Search", getSearchProduct);
ProductRouter.route("/:id").put(isLoggedIn, OrderCount).get(getProduct);
ProductRouter.route("/CheckStock").post(checkInStock);
ProductRouter.route("/:id/like")
  .get(isLoggedIn, getProduct)
  .put(isLoggedIn, LikeAndDisLikeProduct);
export default ProductRouter;
