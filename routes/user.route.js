import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/sign-up", createUser);
router.post("/sign-in", loginUser);
router.post("/sign-out", logoutUser);
router.get("/me", verifyToken, getUser);
router.put("/update-user", verifyToken, updateUser);
router.delete("/delete-user", verifyToken, deleteUser);

export default router;
