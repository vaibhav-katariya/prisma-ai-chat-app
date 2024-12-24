import { ErrorResponse, Responce } from "../utils/apiResponce.js";
import { prisma } from "../db/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!newUser) {
      return ErrorResponse({ res, message: "error while creating user" });
    }

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    Responce({ res, message: "user created successfully", data: newUser });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while creating user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return ErrorResponse({ res, message: "all fields are required" });
    }
    const loggedInUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!loggedInUser) {
      return ErrorResponse({ res, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      loggedInUser.password
    );

    if (!isPasswordMatch) {
      return ErrorResponse({ res, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: loggedInUser.id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    Responce({
      res,
      message: "user logged in successfully",
    });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while login user",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return ErrorResponse({ res, message: "user not logged in" });
    }
    res.clearCookie("token");
    Responce({ res, message: "user logged out successfully" });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while logout user",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        projects: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return ErrorResponse({ res, message: "User not found" });
    }

    Responce({ res, message: "user found", data: user });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while getting user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, name } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        email,
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!updatedUser) {
      return ErrorResponse({ res, message: "User not found" });
    }

    Responce({ res, message: "user updated successfully", data: updatedUser });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while updating user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return ErrorResponse({ res, message: "User not found" });
    }

    Responce({ res, message: "user deleted successfully" });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while deleting user",
      error: error.message,
    });
  }
};
