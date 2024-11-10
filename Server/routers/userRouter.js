import { Router } from "express";
import {
  changePassword,
  getAllDate,
  getProfile,
  login,
  logout,
  RegisterUser,
  resetPassword,
  updatePassword,
  UpdateUserProfile,
} from "../Controllers/Auth.Controller.js";
import upload from "../Middleware/multerMiddleware.js";
import { authorizeRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
const UserRouter = Router();
UserRouter.post("/register", upload.single("avatar"), RegisterUser);
UserRouter.post("/login", login);
UserRouter.get("/logout", isLoggedIn, logout);
UserRouter.get("/getProfile", isLoggedIn, getProfile);
UserRouter.post("/resetPassword", resetPassword);
UserRouter.post("/changePassword:resetToken", changePassword);
UserRouter.post("/updatePassword", isLoggedIn, updatePassword);
UserRouter.post(
  "/UpdateProfile",
  isLoggedIn,
  upload.single("avatar"),
  UpdateUserProfile
);

export default UserRouter;
