/**
 * Token Manager - Utility functions for JWT token management
 */

export const tokenManager = {
  // Store token in localStorage
  setToken: (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
      const expiry = new Date().getTime() + (15 * 60 * 1000); // 15 minutes
      localStorage.setItem("tokenExpiry", expiry.toString());
    }
  },

  // Retrieve token from localStorage
  getToken: () => {
    return localStorage.getItem("authToken");
  },

  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem("authToken");
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry);
  },

  // Clear token and user data
  clearToken: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
  },

  // Get stored user data
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Store user data
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
};
