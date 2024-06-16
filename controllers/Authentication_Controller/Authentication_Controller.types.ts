import { Request } from "express";

interface protectedRouteRequest extends Request {
  user: {
    _id: unknown;
    role: "admin" | "user";
    name: string;
    email?: string | undefined;
    profileImg?: string | undefined;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
    forms: Object;
  };
}

export { protectedRouteRequest };
