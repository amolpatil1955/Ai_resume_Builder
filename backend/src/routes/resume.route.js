import express from "express";
import { Register, Login, GetMe } from "../controller/auth.controller.js";
import { isAuthenticated , upload } from "../middleware/auth.middleware.js";
import { analyzeResume, buildResume, uploadAndAnalyze } from "../controller/resume.controller.js";

const router = express.Router();




router.post("/register", Register);
router.post("/login", Login);
router.get("/get-me", isAuthenticated, GetMe);

router.post("/analyze", analyzeResume);
router.post("/build", buildResume);
router.post("/upload-analyze", upload.single("resume"), uploadAndAnalyze);

export default router;
