import { NextFunction, Response, Request } from "express";
import AppError from "../AppError/AppError";

const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => {
      next(new AppError(err.message as string, 500));
    });
  };
};

export default catchAsync;
