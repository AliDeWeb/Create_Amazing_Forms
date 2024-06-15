import express, { NextFunction } from "express";
import errorController from "./controllers/Error_Controller/Error_Controller";
import AppError from "./utils/AppError/AppError";
import cors from "cors";
import rateLimit from "express-rate-limit";
// Tests
import testRoutes from "./routers/Test_Routes/Test_Routes";

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "در بازه زمانی محدود شما تلاش درخواست دسترسی بیش از حد کرده اید، لطفا بعدا تلاش کنید!",
});

// Routes
import authenticationRoutes from "./routers/Authentication_Routes/Authentication_Routes";
import usersRoutes from "./routers/Users_Routes/Users_Routes";

// Middlewares
app.use(cors());
app.use("/api", limiter);
app.use(express.json());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authenticationRoutes);
app.use("/api/v1/users", usersRoutes);
// <-- Test -->
app.use("/api/v1/test", testRoutes);
app.use("*", (req, res, next: NextFunction) => {
  next(new AppError(`Route is not found!`, 404));
});
app.use(errorController);

export default app;
