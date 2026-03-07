import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuth, user } = useSelector((s) => s.auth);
  if (!isAuth) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};
