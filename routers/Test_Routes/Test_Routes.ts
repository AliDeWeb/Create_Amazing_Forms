import { protectedRoute } from "../../controllers/Authentication_Controller/Authentication_Controller";
import express from "express";

const router = express.Router();

router.route("/protectedRoute").post(protectedRoute);

export default router;
