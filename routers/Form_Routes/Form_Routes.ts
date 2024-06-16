import express from "express";
import {
  addNewForm,
  getAllForms,
} from "../../controllers/Forms_Controller/Forms_Controller";
import {
  protectedRoute,
  restrictTo,
} from "../../controllers/Authentication_Controller/Authentication_Controller";
import { addNewResponse } from "../../controllers/Responses_Controller/Responses_Controller";

const router = express.Router();

// <-- Form APIs -->
router.route("/").post(protectedRoute, addNewForm);
router.route("/").get(protectedRoute, restrictTo(`admin`), getAllForms);

// <-- Responses APIs -->
router.route("/response").post(protectedRoute, addNewResponse);

export default router;
