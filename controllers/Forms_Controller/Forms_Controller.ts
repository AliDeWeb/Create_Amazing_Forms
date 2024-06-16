import { NextFunction, Response } from "express";
import formsModel from "../../models/Forms_Model/Forms_Model";
import catchAsync from "../../utils/CatchAsync/CatchAsync";
import AppError from "../../utils/AppError/AppError";
import { protectedRouteRequest } from "../Authentication_Controller/Authentication_Controller.types";

export const addNewForm = catchAsync(
  async (req: protectedRouteRequest, res: Response, next: NextFunction) => {
    const { data } = req.body;

    if (!data || !data.length)
      return next(new AppError(`موارد لازم را به درستی تکمیل کنید.`, 401));

    const user = req.user._id;

    await formsModel.create({ data, user });

    res.status(201).json({
      status: "success",
      message: "با موفقیت انجام شد.",
    });
  },
);
