import catchAsync from "../../utils/CatchAsync/CatchAsync";
import { Response, Request, NextFunction } from "express";
import usersModel from "../../models/Users_Model/Users_Model";
import ApiFeatures from "../../utils/ApiFeatures/ApiFeatures";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(usersModel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const users = await features.query;

    res.status(201).json({
      status: "success",
      data: {
        users,
      },
    });
  },
);
