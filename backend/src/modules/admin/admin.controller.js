import { db } from "../../config/db.js";
import { users, adminMovies } from "../../db/schema.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { eq, not } from "drizzle-orm";

// User Management
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await db.query.users.findMany({
      columns: { password: false },
    });
    return res.json(ApiResponse.success("Users fetched", allUsers));
  } catch (error) {
    next(error);
  }
};

export const toggleBanUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.query.users.findFirst({ where: eq(users.id, parseInt(id)) });
    if (!user) return res.status(404).json(ApiResponse.error("User not found"));

    const [updatedUser] = await db.update(users)
      .set({ isBanned: !user.isBanned })
      .where(eq(users.id, parseInt(id)))
      .returning();

    return res.json(ApiResponse.success(`User ${updatedUser.isBanned ? 'banned' : 'unbanned'}`, updatedUser));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.delete(users).where(eq(users.id, parseInt(id)));
    return res.json(ApiResponse.success("User deleted permanently"));
  } catch (error) {
    next(error);
  }
};

// Movie Management
export const getAdminMovies = async (req, res, next) => {
  try {
    const movies = await db.query.adminMovies.findMany();
    return res.json(ApiResponse.success("Admin movies fetched", movies));
  } catch (error) {
    next(error);
  }
};

export const addAdminMovie = async (req, res, next) => {
  try {
    const { title, overview, poster, genre, releaseDate, trailerUrl, category, tmdbId } = req.body;
    const [newMovie] = await db.insert(adminMovies).values({
      title,
      overview,
      poster,
      genre,
      releaseDate,
      trailerUrl,
      category,
      tmdbId,
      createdBy: req.user.id,
    }).returning();
    return res.status(201).json(ApiResponse.success("Movie added", newMovie));
  } catch (error) {
    next(error);
  }
};

export const updateAdminMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [updatedMovie] = await db.update(adminMovies)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(adminMovies.id, parseInt(id)))
      .returning();
    return res.json(ApiResponse.success("Movie updated", updatedMovie));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.delete(adminMovies).where(eq(adminMovies.id, parseInt(id)));
    return res.json(ApiResponse.success("Movie deleted"));
  } catch (error) {
    next(error);
  }
};
