import { Request } from "express";

interface protectedRouteRequest extends Request {
  user: Object;
}

export { protectedRouteRequest };
