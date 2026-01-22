// API service for backend communication
const BASE_URL = "http://localhost:8080";

// Helper function to handle API errors
const handleApiError = async (response) => {
  let errorMessage = "Something went wrong";
  
  try {
    const errorData = await response.json();
    // Handle different error response formats from backend
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    // If response is not JSON, use status text
    errorMessage = response.statusText || errorMessage;
  }
  
  return {
    status: response.status,
    message: errorMessage,
  };
};

export const api = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      });

      // 201 Created is success for registration
      if (response.status === 201 || response.ok) {
        return await response.json();
      }

      const error = await handleApiError(response);
      
      // Handle specific status codes
      if (response.status === 409) {
        throw new Error("Email already exists. Please use a different email.");
      }
      if (response.status === 400) {
        throw new Error(error.message || "Invalid registration data. Please check your inputs.");
      }
      
      throw new Error(error.message);
    } catch (err) {
      // Handle network/fetch errors
      if (err.name === "TypeError" || err.message === "Failed to fetch") {
        throw new Error("Failed to fetch");
      }
      throw err;
    }
  },

  // Login user and get JWT token
  login: async (email, password) => {
    try {
      console.log("Attempting login with:", { email, password: "***" });
      
      const response = await fetch(`${BASE_URL}/generate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);
      console.log("Login response ok:", response.ok);
      console.log("Login response headers:", Object.fromEntries(response.headers.entries()));

      // Clone response to read it twice (once for logging, once for actual use)
      const clonedResponse = response.clone();
      const responseText = await clonedResponse.text();
      console.log("Login response body:", responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log("Login successful! Token received:", data.token ? "Yes" : "No");
        return { token: data.token };
      }

      // Handle error responses
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: "Could not parse error response" };
      }
      
      console.error("Login failed with error:", errorData);
      
      // Handle specific status codes
      if (response.status === 401) {
        throw new Error("Invalid email or password");
      }
      if (response.status === 400) {
        throw new Error(errorData.error || errorData.message || "Please provide valid email and password");
      }
      
      throw new Error(errorData.error || errorData.message || "Login failed");
    } catch (err) {
      console.error("Login catch error:", err);
      // Handle network/fetch errors
      if (err.name === "TypeError" || err.message === "Failed to fetch") {
        throw new Error("Failed to fetch");
      }
      throw err;
    }
  },

  // Validate JWT token
  validateToken: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/validate-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }

      // Handle specific status codes
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      if (response.status === 403) {
        throw new Error("Access denied.");
      }
      
      throw new Error("Token validation failed");
    } catch (err) {
      // Handle network/fetch errors
      if (err.name === "TypeError" || err.message === "Failed to fetch") {
        throw new Error("Failed to fetch");
      }
      throw err;
    }
  },
};