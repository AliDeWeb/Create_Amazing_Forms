import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const { Schema } = mongoose;
import userModelTypes from "./Users_Model.types";

const usersSchema = new Schema<userModelTypes>(
  {
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "phone number is required"],
      validate: {
        validator: function (el: string) {
          const phoneRegex = /^09\d{9}$/;
          return el.match(phoneRegex);
        },
        message: "رمز عبور ها یکسان نیستند!",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password should have 8 char at least"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm Password is required"],
      validate: {
        validator: function (this: userModelTypes, el: string) {
          return el === this.password;
        },
        message: "رمز عبور ها یکسان نیستند!",
      },
    },
    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,
    profileImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

usersSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  if (this.profileImg)
    this.profileImg = this.profileImg.replace(/\buploads\b/g, "");

  next();
});

usersSchema.methods.correctPassword = async function (
  input: string,
  pass: string,
) {
  return await bcrypt.compare(input, pass);
};
usersSchema.methods.isTokenInvalid = function (jwtIAT: number) {
  return parseInt(String(this.updatedAt.getTime() / 1000)) > jwtIAT;
};
usersSchema.methods.generatePasswordResetToken = function () {
  const passwordResetToken = crypto.randomBytes(32).toString(`hex`);

  this.passwordResetToken = crypto
    .createHash(`sha256`)
    .update(passwordResetToken)
    .digest("hex");

  this.passwordResetTokenExpiresIn = Date.now() + 3 * 60 * 1000;

  return passwordResetToken;
};

const usersModel = mongoose.model(`Users`, usersSchema);

export default usersModel;
