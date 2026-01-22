import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.js";
import { Group, Button, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <div>
        <h2 style={{ margin: 0, color: "#228be6" }}>Project Management</h2>
      </div>

      {isAuthenticated && (
        <Group gap="md">
          <Text size="sm" style={{ color: "#495057" }}>
            Welcome, {user?.email || "User"}
          </Text>
          <Button
            onClick={handleLogout}
            variant="subtle"
            size="sm"
            leftSection={<IconLogout size="1rem" />}
            style={{ color: "#dc3545" }}
          >
            Logout
          </Button>
        </Group>
      )}
    </nav>
  );
};
