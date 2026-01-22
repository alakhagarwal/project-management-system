import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.js";
import { LoadingScreen } from "./LoadingScreen.jsx";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
