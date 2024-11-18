import { Router } from "express";
import { isLoggedIn } from "../Middleware/authMiddleware.js";
import { CreateOrder } from "../Controllers/Order.Controller.js";
const OrderRouter = Router();
OrderRouter.route("/PlaceOrder").post(isLoggedIn, CreateOrder);
export default OrderRouter;
