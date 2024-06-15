import express from "express";
import { getAllUsers } from "../../controllers/User_Controllers/User_Controllers";
import {
  protectedRoute,
  restrictTo,
} from "../../controllers/Authentication_Controller/Authentication_Controller";

const router = express.Router();

router.route("/").get(protectedRoute, restrictTo("admin"), getAllUsers);

export default router;
