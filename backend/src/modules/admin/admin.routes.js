import express from "express";
import {
  getAllUsers, toggleBanUser, deleteUser,
  getFavoritesCount, getHistoryCount,
  getAdminMovies, addAdminMovie, updateAdminMovie, deleteAdminMovie,
} from "./admin.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/admin.middleware.js";

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get("/users", getAllUsers);
router.patch("/users/:id/ban", toggleBanUser);
router.delete("/users/:id", deleteUser);

router.get("/favorites-count", getFavoritesCount);
router.get("/history-count", getHistoryCount);

router.get("/movies", getAdminMovies);
router.post("/movies", addAdminMovie);
router.patch("/movies/:id", updateAdminMovie);
router.delete("/movies/:id", deleteAdminMovie);

export { router as adminRoutes };
