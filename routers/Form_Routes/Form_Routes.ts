import express from "express";
import { addNewForm } from "../../controllers/Forms_Controller/Forms_Controller";
import { protectedRoute } from "../../controllers/Authentication_Controller/Authentication_Controller";

const router = express.Router();

router.route("/").post(protectedRoute, addNewForm);

export default router;
