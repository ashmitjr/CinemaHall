import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "../utils/jwt.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { db } from "../config/db.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  const accessToken = header?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json(ApiResponse.error("No token provided"));
  }

  try {
    req.user = verifyAccessToken(accessToken);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" && refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await db.query.users.findFirst({
          where: eq(users.id, decoded.id),
        });

        if (user && !user.isBanned) {
          const newAccessToken = signAccessToken({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
          });
          
          res.setHeader("X-New-Access-Token", newAccessToken);
          req.user = { id: user.id, email: user.email, role: user.role };
          return next();
        }
      } catch (refreshError) {
        // Fall through to error response
      }
    }
    return res.status(401).json(ApiResponse.error("Invalid or expired token"));
  }
};
