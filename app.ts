import express from "express";
import cors from "cors";
const app = express();

// Routes
import authenticationRoutes from "./routers/Authentication_Routes/Authentication_Routes";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1/auth", authenticationRoutes);

export default app;
