import { Router } from "express";
import {
  changePassword,
  getProfile,
  login,
  logout,
  RegisterUser,
  resetPassword,
  updatePassword,
  UpdateUserProfile,
} from "../Controllers/Auth.Controller.js";
import upload from "../Middleware/multerMiddleware.js";
import { isLoggedIn } from "../Middleware/authMiddleware.js";
import {
  getFeedback,
  SubmitFeedback,
} from "../Controllers/feedback.Controller.js";
import {
  getAllCarousel,
  getCarousel,
} from "../Controllers/CarouselController.js";
const UserRouter = Router();
UserRouter.post("/register", upload.single("avatar"), RegisterUser);
UserRouter.post("/login", login);
UserRouter.post("/SubmitFeedback", SubmitFeedback);
UserRouter.get("/getFeedback", getFeedback);
UserRouter.get("/logout", logout);
UserRouter.get("/Carousel", getAllCarousel);
UserRouter.get("/getProfile", isLoggedIn, getProfile);
UserRouter.post("/resetPassword", resetPassword);
UserRouter.post("/changePassword:resetToken", changePassword);
UserRouter.post("/updatePassword", isLoggedIn, updatePassword);
UserRouter.put(
  "/UpdateProfile",
  isLoggedIn,
  upload.single("avatar"),
  UpdateUserProfile
);

export default UserRouter;
