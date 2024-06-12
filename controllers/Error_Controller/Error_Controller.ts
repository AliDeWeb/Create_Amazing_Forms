import { NextFunction, Request, Response } from "express";
import errorControllerTypes from "./Error_Controller.types";

const errorController = (
  err: errorControllerTypes,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorMessage = err.message;
  const errorStatusCode = err.statusCode || 500;
  const errorStatus = err.status || `server error`;

  if (process.env.NODE_ENV === `development`) {
    res.status(errorStatusCode).json({
      error: err,
      stack: err.stack,
      message: errorMessage,
      status: errorStatus,
    });
  } else if (process.env.NODE_ENV === `production`) {
    if (err.isOperational) {
      res.status(errorStatusCode).json({
        message: errorMessage,
        status: errorStatus,
      });
    } else {
      res.status(500).json({
        message: "something went wrong",
        status: errorStatus,
      });
    }
  }

  next();
};

export default errorController;
