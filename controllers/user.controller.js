import { ErrorResponse, Responce } from "../utils/apiResponce.js";
import { prisma } from "../db/db.config.js";
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      ErrorResponse({ res, message: "all fields are required" });
    }

    const existUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existUser) {
      return ErrorResponse({ res, message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    if (!newUser) {
      return ErrorResponse({ res, message: "error while creating user" });
    }

    Responce({ res, message: "user created successfully", data: newUser });
  } catch (error) {
    ErrorResponse({ res, message: "error while creating user", error });
  }
};
