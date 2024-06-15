import express, { NextFunction } from "express";
import errorController from "./controllers/Error_Controller/Error_Controller";
import AppError from "./utils/AppError/AppError";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";

// <-- Logics -->
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
// <-- Security -->
app.use(helmet());
// <-- Limitation -->
app.use("/api", limiter);
// <-- Body Parsers -->
app.use(express.json({ limit: `10kb` }));
app.use(express.urlencoded({ extended: true }));
// <-- Serving Static Files -->
app.use(express.static("uploads"));
// <-- Data Sanitizing -->
app.use(mongoSanitize());
app.use(xss());
// <-- APIs -->
app.use("/api/v1/auth", authenticationRoutes);
app.use("/api/v1/users", usersRoutes);
// <-- 404 Route -->
app.use("*", (req, res, next: NextFunction) => {
  next(new AppError(`Route is not found!`, 404));
});
// <-- Error Handler -->
app.use(errorController);

export default app;
