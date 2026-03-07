import express from "express";
import { getFavorites, addFavorite, removeFavorite } from "./favorites.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:movieId", removeFavorite);

export { router as favoritesRoutes };
