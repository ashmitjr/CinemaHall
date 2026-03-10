import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, accessToken } = useSelector((s) => s.auth);
  const isRehydrated = useSelector((s) => s._persist?.rehydrated);
  const isAuth = !!user && !!accessToken;

  // Wait for persist to rehydrate before making auth decisions
  if (!isRehydrated) return null;
  if (!isAuth) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};
