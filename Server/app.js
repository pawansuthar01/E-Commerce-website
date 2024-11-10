import express from "express";
import cookieParser from "cookie-parser";
import dataBaseConnection from "./config/dbconncetion.js";
import UserRouter from "./routers/userRouter.js";
import morgan from "morgan";
import cors from "cors";
import ErrorMiddleware from "./Middleware/Error.Middleware.js";
import { getAllDate } from "./Controllers/Auth.Controller.js";
import { authorizeRoles, isLoggedIn } from "./Middleware/authMiddleware.js";

const app = express();

dataBaseConnection();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use("/ping", (req, res, next) => {
  res.status(200).send("server is updated");
});

//
app.use("/api/v3/user", UserRouter);
app.use("/api/v3/Admin", isLoggedIn, getAllDate);

app.use("*", (req, res, next) => {
  res.status(404).send("Oops ! page not found..");
});
app.use(ErrorMiddleware);
export default app;
