export const errorMiddleware = (err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
