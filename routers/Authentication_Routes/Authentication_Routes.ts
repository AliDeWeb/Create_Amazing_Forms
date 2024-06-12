import express from "express";
import multer from "multer";
import path from "path";
import { signUp } from "../../controllers/Authentication_Controller/Authentication_Controller";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/images/profiles");
  },
  filename(
    req,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) {
    const ext = path.extname(file.originalname);
    callback(
      null,
      `${Date.now()}_${(Math.random() * Math.pow(10, 5)).toFixed(0)}${ext}`,
    );
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/signup").post(upload.single(`profileImg`), signUp);

export default router;
