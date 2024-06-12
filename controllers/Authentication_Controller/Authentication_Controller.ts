import usersModel from "../../models/Users_Model/Users_Model";
import { Response, Request, NextFunction } from "express";
import catchAsync from "../../utils/CatchAsync/CatchAsync";
import AppError from "../../utils/AppError/AppError";
import jwt from "jsonwebtoken";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    }: {
      name: string;
      email: string;
      phone: string;
      password: string;
      confirmPassword: string;
    } = req.body;
    const profileImg = req.file?.path;

    if (!name || !phone || !password || !confirmPassword) {
      return next(
        new AppError(`لطفا اطلاعات خود را به درستی وارد نمایید!`, 401),
      );
    }

    const userExist = await usersModel.findOne({ phone });

    if (userExist)
      return next(new AppError(`کاربری با این شماره تلفن یافت شد!`, 401));

    const newUser = await usersModel.create({
      name: name.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim().toLowerCase(),
      password: password.trim().toLowerCase(),
      confirmPassword: confirmPassword.trim().toLowerCase(),
      profileImg: profileImg,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
      },
    );

    res.status(201).json({
      status: "success",
      message: "خوش اومدی :)",
      data: newUser,
      token,
    });
  },
);
