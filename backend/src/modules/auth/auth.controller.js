import { db } from "../../config/db.js";
import { users } from "../../db/schema.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { eq } from "drizzle-orm";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res, next) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(ApiResponse.error("Validation failed", validation.error.errors));
    }
    const { name, email, password } = validation.data;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json(ApiResponse.error("User already exists"));
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.status(201).json(ApiResponse.success("User registered", { accessToken, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } }));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(ApiResponse.error("Validation failed", validation.error.errors));
    }
    const { email, password } = validation.data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"));
    }

    if (user.isBanned) {
      return res.status(403).json(ApiResponse.error("Your account has been banned"));
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.json(ApiResponse.success("Login successful", { accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json(ApiResponse.error("No refresh token"));
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user || user.isBanned) {
      return res.status(403).json(ApiResponse.error("Invalid user or banned"));
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    return res.json(ApiResponse.success("Token refreshed", { accessToken }));
  } catch (error) {
    return res.status(401).json(ApiResponse.error("Invalid refresh token"));
  }
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);
  return res.json(ApiResponse.success("Logged out"));
};
