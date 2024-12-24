import { ErrorResponse } from "../utils/apiResponce.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return ErrorResponse({ res, message: "token not found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return ErrorResponse({ res, message: "invalid token" });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while verifying token",
      error: error.message,
    });
  }
};
