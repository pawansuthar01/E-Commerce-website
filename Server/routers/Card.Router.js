import { Router } from "express";
import { isLoggedIn } from "../Middleware/authMiddleware.js";
import {
  AddCardProduct,
  removeCardProduct,
} from "../Controllers/Card.Controller.js";
const CardRouter = Router();
CardRouter.route("/AddProduct").put(isLoggedIn, AddCardProduct);

CardRouter.route("/RemoveProduct").put(isLoggedIn, removeCardProduct);
export default CardRouter;
