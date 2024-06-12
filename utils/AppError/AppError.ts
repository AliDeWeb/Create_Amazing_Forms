import AppErrorTypes from "./AppError.types";

class AppError extends Error implements AppErrorTypes {
  message: string;
  statusCode: number;
  status: "fail" | "server error" | "unknown";
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = true;

    if (`${statusCode}`.startsWith(`4`)) {
      this.status = `fail`;
    } else if (`${statusCode}`.startsWith(`5`)) {
      this.status = `server error`;
    } else {
      this.status = `unknown`;
    }
  }
}

export default AppError;
