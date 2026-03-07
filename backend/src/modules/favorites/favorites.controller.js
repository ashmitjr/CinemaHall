import { db } from "../../config/db.js";
import { favorites } from "../../db/schema.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { eq, and } from "drizzle-orm";

export const getFavorites = async (req, res, next) => {
  try {
    const userFavorites = await db.query.favorites.findMany({
      where: eq(favorites.userId, req.user.id),
    });
    return res.json(ApiResponse.success("Favorites fetched", userFavorites));
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { movieId, movieType, title, poster } = req.body;
    await db.insert(favorites).values({
      userId: req.user.id,
      movieId,
      movieType,
      title,
      poster,
    }).onConflictDoNothing();
    
    return res.status(201).json(ApiResponse.success("Favorite added"));
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    await db.delete(favorites).where(
      and(
        eq(favorites.userId, req.user.id),
        eq(favorites.movieId, parseInt(movieId))
      )
    );
    return res.json(ApiResponse.success("Favorite removed"));
  } catch (error) {
    next(error);
  }
};
