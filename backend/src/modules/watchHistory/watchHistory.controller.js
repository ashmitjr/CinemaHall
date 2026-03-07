import { db } from "../../config/db.js";
import { watchHistory } from "../../db/schema.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { eq, desc } from "drizzle-orm";

export const getWatchHistory = async (req, res, next) => {
  try {
    const history = await db.query.watchHistory.findMany({
      where: eq(watchHistory.userId, req.user.id),
      orderBy: [desc(watchHistory.watchedAt)],
    });
    return res.json(ApiResponse.success("Watch history fetched", history));
  } catch (error) {
    next(error);
  }
};

export const addWatchHistory = async (req, res, next) => {
  try {
    const { movieId, movieType, title, poster } = req.body;
    await db.insert(watchHistory).values({
      userId: req.user.id,
      movieId,
      movieType,
      title,
      poster,
    });
    return res.status(201).json(ApiResponse.success("Watch history added"));
  } catch (error) {
    next(error);
  }
};

export const clearWatchHistory = async (req, res, next) => {
  try {
    await db.delete(watchHistory).where(eq(watchHistory.userId, req.user.id));
    return res.json(ApiResponse.success("Watch history cleared"));
  } catch (error) {
    next(error);
  }
};
