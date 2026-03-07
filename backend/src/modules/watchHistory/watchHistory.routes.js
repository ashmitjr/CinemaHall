import express from "express";
import { getWatchHistory, addWatchHistory, clearWatchHistory } from "./watchHistory.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getWatchHistory);
router.post("/", addWatchHistory);
router.delete("/", clearWatchHistory);

export { router as watchHistoryRoutes };
