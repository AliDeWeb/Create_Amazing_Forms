import express, { NextFunction } from "express";
import errorController from "./controllers/Error_Controller/Error_Controller";
import AppError from "./utils/AppError/AppError";
import cors from "cors";
const app = express();

// Routes
import authenticationRoutes from "./routers/Authentication_Routes/Authentication_Routes";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1/auth", authenticationRoutes);
app.use("*", (req, res, next: NextFunction) => {
  next(new AppError(`Route is not found`, 404));
});
app.use(errorController);

export default app;
