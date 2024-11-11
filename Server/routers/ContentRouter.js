import { Router } from "express";
import { PostUpload, ReelUpload } from "../Controllers/Content.Controller.js";
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
export default ContentRouter;
