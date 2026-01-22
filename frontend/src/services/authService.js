/**
 * Authentication Service - API calls for auth endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { email, password, firstName, lastName }
   * @returns {Promise<Object>} - { id, email, firstName, lastName }
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  /**
   * Login user and get JWT token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - { token }
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Validate JWT token
   * @param {string} token - JWT token to validate
   * @returns {Promise<Object>} - { valid, email, message }
   */
  validateToken: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { valid: false, message: "Token invalid or expired" };
      }

      return await response.json();
    } catch (error) {
      console.error("Token validation error:", error);
      return { valid: false, message: "Validation failed" };
    }
  },

  /**
   * Logout user (clears local storage)
   */
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
  },
};
