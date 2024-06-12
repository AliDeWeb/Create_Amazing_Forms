import express from "express";
import multer from "multer";
import { celebrate, Joi, Segments, errors } from "celebrate";
import path from "path";
import {
  signUp,
  login,
} from "../../controllers/Authentication_Controller/Authentication_Controller";

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

router.route("/signup").post(
  upload.single(`profileImg`),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().messages({
        "any.required": "نام الزامی است",
      }),
      email: Joi.string().email().messages({
        "string.email": "ایمیل معتبر نیست",
      }),
      password: Joi.string().min(8).required().messages({
        "string.min": "رمز عبور باید حداقل ۸ کاراکتر باشد",
        "any.required": "رمز عبور الزامی است",
      }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "رمز عبور ها باید یکسان باشند",
          "any.required": "تکرار رمز عبور الزامی است",
        }),
      phone: Joi.string()
        .pattern(/^09\d{9}$/)
        .required()
        .messages({
          "string.pattern.base": "شماره تلفن باید معتبر باشد و با 09 شروع شود",
          "any.required": "شماره تلفن الزامی است",
        }),
      profileImg: Joi.string().optional(),
    }),
  }),
  signUp,
);

router.route("/login").post(
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      password: Joi.string().min(8).required().messages({
        "string.min": "رمز عبور باید حداقل ۸ کاراکتر باشد",
        "any.required": "رمز عبور الزامی است",
      }),
      phone: Joi.string()
        .pattern(/^09\d{9}$/)
        .required()
        .messages({
          "string.pattern.base": "شماره تلفن باید معتبر باشد و با 09 شروع شود",
          "any.required": "شماره تلفن الزامی است",
        }),
    }),
  }),
  login,
);

router.use(errors());

export default router;
