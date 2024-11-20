import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
import {
  AllOrder,
  CreateOrder,
  createOrderPayment,
  getOrder,
  UpdateOrder,
} from "../Controllers/Order.Controller.js";
const OrderRouter = Router();
OrderRouter.route("/PlaceOrder").post(isLoggedIn, CreateOrder);

OrderRouter.route("/CreatePayment/new").post(isLoggedIn, createOrderPayment);
OrderRouter.route("/").get(
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  AllOrder
);
OrderRouter.route("/:id")
  .get(isLoggedIn, getOrder)
  .put(isLoggedIn, UpdateOrder);
export default OrderRouter;
