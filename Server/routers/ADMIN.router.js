import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
import { getAllDate } from "../Controllers/Auth.Controller.js";
import {
  deletePostById,
  deleteReelById,
  getAllPost,
  getAllReel,
  getReel,
  postUpdate,
  reelUpdate,
} from "../Controllers/Content.Controller.js";
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
  getAllReel
);
ADMINRouter.route("/Post/:id")

  .delete(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), deletePostById)

  .put(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), postUpdate);
ADMINRouter.route("/Reel/:id")
  .get(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), getReel)
  .delete(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), deleteReelById)

  .put(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), reelUpdate);
export default ADMINRouter;
