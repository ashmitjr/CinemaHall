import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, accessToken, isAuth } = useSelector((s) => s.auth);

  if (!isAuth && !user) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};
