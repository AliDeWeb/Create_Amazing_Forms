import usersModel from "../../models/Users_Model/Users_Model";
import { Response, Request, NextFunction } from "express";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    email,
    phone,
    password,
    confirmPassword,
  }: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  } = req.body;
  const profileImg = req.file?.path;

  const newUser = await usersModel.create({
    name,
    email,
    phone,
    password,
    confirmPassword,
    profileImg,
  });

  res.status(201).json({
    status: "success",
    message: "خوش اومدی :)",
    data: newUser,
  });
};
