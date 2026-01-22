import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.js";
import { LoadingScreen } from "./LoadingScreen.jsx";

/**
 * PublicRoute - Wrapper for public routes (login, register)
 * Redirects authenticated users to dashboard
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
