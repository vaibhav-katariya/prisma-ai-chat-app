import { Router } from "express";
import { genAiContent } from "../controllers/ai.controller.js";

const router = Router();

router.post("/gen-content", genAiContent);

export default router;
