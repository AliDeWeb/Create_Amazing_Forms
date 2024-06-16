import catchAsync from "../../utils/CatchAsync/CatchAsync";
import { NextFunction, Response } from "express";
import responsesModel from "../../models/Responses_Model/Responses_Model";
import { protectedRouteRequest } from "../Authentication_Controller/Authentication_Controller.types";

export const addNewResponse = catchAsync(
  async (req: protectedRouteRequest, res: Response, next: NextFunction) => {
    const { value, question, form } = req.body;
    const user = req.user._id;

    await responsesModel.create({
      value,
      question,
      form,
      user,
    });

    res.status(201).json({
      status: "success",
      message: "با موفقیت انجام شد.",
    });
  },
);
