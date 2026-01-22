// components/testApi.js
let mockUsers = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123",
  },
];

export const mockApi = {
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        if (mockUsers.find((u) => u.email === userData.email)) {
          reject({ message: "User already exists with this email" });
          return;
        }

        // Create new user without name
        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          password: userData.password, // Note: Plain text - just for mock!
        };

        mockUsers.push(newUser);
        console.log("Mock users after registration:", mockUsers);

        const token = `mock-token-${newUser.id}-${Date.now()}`;

        resolve({
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            // No name field here either
          },
          token: token,
          expiresIn: 24 * 60 * 60 * 1000,
        });
      }, 800);
    });
  },

  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password,
        );

        if (!user) {
          reject({ message: "Invalid credentials" });
          return;
        }

        resolve({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            // No name field
          },
          token: `mock-token-${user.id}-${Date.now()}`,
          expiresIn: 24 * 60 * 60 * 1000,
        });
      }, 500);
    });
  },
};
