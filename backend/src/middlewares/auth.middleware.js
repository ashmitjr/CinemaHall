import { verifyAccessToken } from "../utils/jwt.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  const accessToken = header?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json(ApiResponse.error("No token provided"));
  }

  try {
    req.user = verifyAccessToken(accessToken);
    return next();
  } catch {
    return res.status(401).json(ApiResponse.error("Invalid or expired token"));
  }
};
