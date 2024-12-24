import { Router } from "express";
import { addUsersToProject, createProject, getProjects } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/create", verifyToken, createProject);
router.post("/add-users", verifyToken, addUsersToProject);
router.get("/get-project", verifyToken, getProjects);

export default router;
