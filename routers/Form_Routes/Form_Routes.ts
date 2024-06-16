import express from "express";
import {
  addNewForm,
  getAllForms,
} from "../../controllers/Forms_Controller/Forms_Controller";
import {
  protectedRoute,
  restrictTo,
} from "../../controllers/Authentication_Controller/Authentication_Controller";

const router = express.Router();

router.route("/").post(protectedRoute, addNewForm);
router.route("/").get(protectedRoute, restrictTo(`admin`), getAllForms);

export default router;
