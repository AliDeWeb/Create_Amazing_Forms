import { Request } from "express";

interface protectedRouteRequest extends Request {
  user: { role: string };
}

export { protectedRouteRequest };
