import { Router } from "express";
import {
  addUsersToProject,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  removeUserFromProject,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/create", verifyToken, createProject);
router.post("/add-users", verifyToken, addUsersToProject);
router.get("/get-projects", verifyToken, getProjects);
router.get("/get-project/:projectId", verifyToken, getProject);
router.delete("/remove-user", verifyToken, removeUserFromProject);
router.delete("/delete-project", verifyToken, deleteProject);

export default router;
