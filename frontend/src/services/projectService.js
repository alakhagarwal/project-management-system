/**
 * Project Service - API calls for project endpoints
 * Replace mock data with real API calls when backend is ready
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const projectService = {
  /**
   * Get all projects for authenticated user
   * @returns {Promise<Array>} - Array of project objects
   */
  getProjects: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return await response.json();
    } catch (error) {
      console.error("Projects fetch error:", error);
      throw error;
    }
  },

  /**
   * Get a single project by ID
   * @param {number} projectId - Project ID
   * @param {string} token - JWT token
   * @returns {Promise<Object>} - Project object
   */
  getProjectById: async (projectId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      return await response.json();
    } catch (error) {
      console.error("Project fetch error:", error);
      throw error;
    }
  },

  /**
   * Create a new project
   * @param {Object} projectData - { name, description, ... }
   * @param {string} token - JWT token
   * @returns {Promise<Object>} - Created project
   */
  createProject: async (projectData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return await response.json();
    } catch (error) {
      console.error("Project creation error:", error);
      throw error;
    }
  },
};

// MOCK DATA - Replace with real API calls when backend is ready
export const mockProjects = [
  {
    id: 1,
    name: "Delivery Partner App",
    description: "Building Delivery Partner App for iOS and Android",
    status: "ACTIVE",
    members: 1,
    dueDate: "Oct 31, 2025",
    progress: 0,
  },
  {
    id: 2,
    name: "Customer App Development",
    description: "Building Customer Order App for iOS and Android",
    status: "ACTIVE",
    members: 1,
    dueDate: "Oct 31, 2025",
    progress: 0,
  },
  {
    id: 3,
    name: "Admin Dashboard",
    description: "Building Admin Dashboard for project management",
    status: "ACTIVE",
    members: 2,
    dueDate: "Nov 15, 2025",
    progress: 25,
  },
];
