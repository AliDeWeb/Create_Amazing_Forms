import {
  protectedRoute,
  restrictTo,
} from "../../controllers/Authentication_Controller/Authentication_Controller";
import express from "express";

const router = express.Router();

router.route("/protectedRoute").post(protectedRoute);
router.route("/restrict").post(protectedRoute, restrictTo(`admin`));

export default router;
