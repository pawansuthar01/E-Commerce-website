import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
import { getAllDate } from "../Controllers/Auth.Controller.js";
import { getAllPost, getReelGet } from "../Controllers/Content.Controller.js";
const ADMINRouter = Router();
ADMINRouter.get(
  "/User",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  getAllDate
);
ADMINRouter.get(
  "/Post",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  getAllPost
);
ADMINRouter.get(
  "/Reel",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  getReelGet
);
export default ADMINRouter;
