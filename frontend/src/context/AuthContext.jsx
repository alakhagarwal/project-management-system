import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService.js";
import { tokenManager } from "../utils/tokenManager.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenManager.getToken();

      if (!token || tokenManager.isTokenExpired()) {
        tokenManager.clearToken();
        setAuth({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
        return;
      }

      // Validate token with backend
      const result = await authService.validateToken(token);

      if (result.valid) {
        const user = tokenManager.getUser();
        setAuth({
          isAuthenticated: true,
          user: user || { email: result.email },
          loading: false,
          error: null,
        });
      } else {
        tokenManager.clearToken();
        setAuth({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: result.message,
        });
      }
    };

    checkAuth();
  }, []);

  const login = (token, user) => {
    tokenManager.setToken(token);
    tokenManager.setUser(user);
    setAuth({
      isAuthenticated: true,
      user: user,
      loading: false,
      error: null,
    });
  };

  const register = (token, user) => {
    tokenManager.setToken(token);
    tokenManager.setUser(user);
    setAuth({
      isAuthenticated: true,
      user: user,
      loading: false,
      error: null,
    });
  };

  const logout = () => {
    tokenManager.clearToken();
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  const value = {
    ...auth,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
