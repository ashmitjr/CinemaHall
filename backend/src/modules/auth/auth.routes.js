import express from "express";
import { register, login, refresh, logout } from "./auth.controller.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export { router as authRoutes };
