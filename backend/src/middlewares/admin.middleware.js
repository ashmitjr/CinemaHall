import { ApiResponse } from "../utils/apiResponse.js";

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json(ApiResponse.error("Admin access required"));
  next();
};
