import usersModel from "../../models/Users_Model/Users_Model";
import { Response, Request, NextFunction } from "express";
import { promisify } from "util";
import catchAsync from "../../utils/CatchAsync/CatchAsync";
import AppError from "../../utils/AppError/AppError";
import jwt from "jsonwebtoken";
import { protectedRouteRequest } from "./Authentication_Controller.types";

const tokenGenerator = (userId: string) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });

  return token;
};

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

    const token = tokenGenerator(newUser._id as string);

    res.status(201).json({
      status: "success",
      message: "خوش اومدی :)",
      data: newUser,
      token,
    });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, password }: { phone: string; password: string } = req.body;

    if (!phone || !password) {
      return next(
        new AppError(`شماره تلفن و رمز عبور خود را وارد نمایید!`, 401),
      );
    }

    const user = await usersModel.findOne({ phone }).select(`+password`);

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError(`شماره تلفن یا رمز عبور نادرست است!`, 401));

    const token = tokenGenerator(user._id as string);

    res.status(201).json({
      status: "success",
      message: "خوش اومدی :)",
      token,
    });
  },
);

export const protectedRoute = catchAsync(
  async (req: protectedRouteRequest, res: Response, next: NextFunction) => {
    if (
      !req.headers.authorization?.startsWith("Bearer") ||
      !req.headers.authorization?.split(" ")[1]
    )
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    const token = req.headers.authorization?.split(" ")[1];

    const verifyAsync = promisify<string, string>(jwt.verify);
    const decoded: unknown = await verifyAsync(
      token,
      process.env.JWT_SECRET as string,
    );

    if (!(decoded as boolean))
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    const user = await usersModel.findById((decoded as { id: string }).id);

    if (!user)
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    const isTokenInvalid = user.isTokenInvalid(
      (decoded as { iat: number }).iat,
    );

    if (isTokenInvalid)
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    req.user = user;
    next();
  },
);

export const restrictTo = (...args: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!args.includes(req.user.role))
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    next();
  };
};
