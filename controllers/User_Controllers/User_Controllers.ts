import catchAsync from "../../utils/CatchAsync/CatchAsync";
import { Response, Request, NextFunction } from "express";
import usersModel from "../../models/Users_Model/Users_Model";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await usersModel.find();

    res.status(201).json({
      status: "success",
      data: {
        users,
      },
    });
  },
);
