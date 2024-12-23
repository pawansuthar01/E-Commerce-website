import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
import { getAllDate } from "../Controllers/Auth.Controller.js";
import upload from "../Middleware/multerMiddleware.js";

import {
  deletePostById,
  getAllPost,
  postUpdate,
  PostUpload,
} from "../Controllers/Content.Controller.js";
import {
  productDelete,
  productUpdate,
  ProductUpload,
} from "../Controllers/Product.Controller.js";
import { AllOrder, allOrderPayments } from "../Controllers/Order.Controller.js";
import {
  CarouselDelete,
  CarouselUpdate,
  CarouselUpload,
  getCarousel,
} from "../Controllers/CarouselController.js";
const ADMINRouter = Router();
ADMINRouter.get(
  "/User",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  getAllDate
);
ADMINRouter.get(
  "/Order",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  AllOrder
);

ADMINRouter.get(
  "/Payment",
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),
  allOrderPayments
);

ADMINRouter.route("/Post")
  .get(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), getAllPost)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN", "AUTHOR"),
    upload.single("post"),
    PostUpload
  );

ADMINRouter.route("/Post/:id")
  .delete(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), deletePostById)

  .put(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), postUpdate);

////product api///
ADMINRouter.route("/Product").post(
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),

  upload.array("images", 10),
  ProductUpload
);
ADMINRouter.route("/Carousel").post(
  isLoggedIn,
  authorizeRoles("ADMIN", "AUTHOR"),

  upload.array("images", 2),
  CarouselUpload
);
ADMINRouter.route("/Carousel/:id")
  .put(
    isLoggedIn,
    authorizeRoles("ADMIN", "AUTHOR"),

    upload.array("images", 2),
    CarouselUpdate
  )
  .get(isLoggedIn, getCarousel)
  .delete(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), CarouselDelete);

ADMINRouter.route("/Product/:id")
  .put(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), productUpdate)
  .delete(isLoggedIn, authorizeRoles("ADMIN", "AUTHOR"), productDelete);
export default ADMINRouter;
