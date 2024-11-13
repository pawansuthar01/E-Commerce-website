import { Router } from "express";
import {
  addCommentPost,
  addCommentReel,
  deleteCommentInPostById,
  deleteCommentInReelById,
  LikeAndDisLikePost,
  exitCommentInPostById,
  exitCommentInReelById,
  getPost,
  getReel,
  LikeAndDisLikeReel,
} from "../Controllers/Content.Controller.js";

import { isLoggedIn } from "../Middleware/authMiddleware.js";

const ContentRouter = Router();

ContentRouter.route("/Post/:id")
  .post(isLoggedIn, addCommentPost)
  .get(isLoggedIn, getPost)
  .put(isLoggedIn, LikeAndDisLikePost);

ContentRouter.route("/Reel/:id")
  .post(isLoggedIn, addCommentReel)
  .get(isLoggedIn, getReel)
  .put(isLoggedIn, LikeAndDisLikeReel);

ContentRouter.route("/Post")
  .put(isLoggedIn, exitCommentInPostById)
  .delete(isLoggedIn, deleteCommentInPostById);

ContentRouter.route("/Reel")
  .put(isLoggedIn, exitCommentInReelById)
  .delete(isLoggedIn, deleteCommentInReelById);

export default ContentRouter;
