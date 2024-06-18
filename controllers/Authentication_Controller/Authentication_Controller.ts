import usersModel from "../../models/Users_Model/Users_Model";
import { Response, Request, NextFunction } from "express";
import { promisify } from "util";
import catchAsync from "../../utils/CatchAsync/CatchAsync";
import AppError from "../../utils/AppError/AppError";
import jwt from "jsonwebtoken";
import { protectedRouteRequest } from "./Authentication_Controller.types";
import sendEmail from "../../utils/MailTo/MailTo";
import crypto from "crypto";
import { usersRoles } from "../../utils/GeneralAppTypes/GeneralApp.types";

const createAndSendToken = (
  user: any,
  res: Response,
  data: any,
  statusCode: number,
) => {
  const cookiesOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === `production`) cookiesOptions.secure = true;

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });

  user.password = undefined;
  user.passwordUpdateAt = undefined;
  user.active = undefined;

  res.cookie(`jwt`, token, cookiesOptions);
  res.status(statusCode).json({
    status: "success",
    message: "با موفقیت انجام شد.",
    data,
    token,
  });
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

    createAndSendToken(newUser, res, newUser, 201);
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

    createAndSendToken(user, res, user, 201);
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

    const user = await usersModel
      .findById((decoded as { id: string }).id)
      .populate(`forms`);

    if (!user)
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    const isTokenInvalid = user.isTokenInvalid(
      (decoded as { iat: number }).iat,
    );

    if (isTokenInvalid)
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    // @ts-ignore
    req.user = user;

    next();
  },
);

export const restrictTo = (...args: usersRoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!args.includes(req.user.role))
      return next(new AppError("شما مجاز به انجام اینکار نیستید!", 403));

    next();
  };
};

export const getMe = catchAsync(
  async (req: protectedRouteRequest, res: Response, next: NextFunction) => {
    const userInfos = await usersModel.aggregate([
      { $match: { _id: req.user._id } },
      {
        $lookup: {
          from: "forms",
          localField: "_id",
          foreignField: "user",
          as: "forms",
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          email: 1,
          profileImg: 1,
          forms: {
            _id: 1,
            data: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    res.status(201).json({
      status: "success",
      data: userInfos,
    });
  },
);

export const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await usersModel.findOne({ email });

    if (!user) return next(new AppError(`ایمیل را به درستی وارد نمایید!`, 400));

    const token = user.generatePasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(`host`)}/v1/auth/reset-password/${token}`;
    const message = `بر روی لینک کلیک کنید.\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "بازنشانی رمز عبور",
        message,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiresIn = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError(`لطفا دوباره تلاش کنید!`, 400));
    }

    res.status(201).json({
      status: `success`,
      message: "ایمیل خود را چک کنید.",
    });
  },
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const hashedToken = crypto.createHash(`sha256`).update(token).digest("hex");
    const user = await usersModel.findOne({ passwordResetToken: hashedToken });
    if (!user)
      return next(new AppError(`لینک معتبر نمیباشد، دوباره تلاش کنید!`, 403));

    const isTokenValid = user.isResetTokenValid();
    if (!isTokenValid)
      return next(
        new AppError(
          `زمان تغییر رمز عبور به پایان رسیده است، دوباره تلاش کنید!`,
          403,
        ),
      );
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    user.save();

    createAndSendToken(user, res, user, 201);
  },
);

export const updateMe = catchAsync(
  async (req: protectedRouteRequest, res: Response, next: NextFunction) => {
    const { email, phone, name } = req.body;
    const newInfos = await usersModel.findByIdAndUpdate(
      req.user._id,
      { email, phone, name },
      { new: true },
    );

    res.status(201).json({
      status: `success`,
      message: "با موفقیت انجام شد.",
      date: {
        newInfos,
      },
    });
  },
);

export const deactivateMe = catchAsync(
  async (req: protectedRouteRequest, res: Response, next: NextFunction) => {
    await usersModel.findByIdAndUpdate(req.user._id, { active: false });

    res.status(201).json({
      status: "success",
      message: "با موفقیت حذف شدید.",
    });
  },
);
