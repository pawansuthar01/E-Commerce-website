import { Router } from "express";
import {
  addCommentPost,
  addCommentReel,
  deleteCommentInPostById,
  deleteCommentInReelById,
  exitCommentInPostById,
  exitCommentInReelById,
  getPost,
  getReel,
  PostUpload,
  ReelUpload,
} from "../Controllers/Content.Controller.js";
import { authorizeRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multerMiddleware.js";
const ContentRouter = Router();
ContentRouter.post(
  "/post",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  upload.single("post"),
  PostUpload
);
ContentRouter.post(
  "/Reel",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  upload.single("reel"),
  ReelUpload
);

ContentRouter.route("/Post/:id")
  .post(isLoggedIn, addCommentPost)
  .get(isLoggedIn, getPost);

ContentRouter.route("/Reel/:id")
  .post(isLoggedIn, addCommentReel)
  .get(isLoggedIn, getReel);

ContentRouter.route("/Post")
  .put(isLoggedIn, exitCommentInPostById)
  .delete(isLoggedIn, deleteCommentInPostById);

ContentRouter.route("/Reel")
  .put(isLoggedIn, exitCommentInReelById)
  .delete(isLoggedIn, deleteCommentInReelById);

export default ContentRouter;
