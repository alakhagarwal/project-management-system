import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.js";
import {
  Group,
  Button,
  Text,
  TextInput,
  Menu,
  Avatar,
  Divider,
} from "@mantine/core";
import {
  IconLogout,
  IconSearch,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.email?.split("@")[0] || "User";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e9ecef",
      }}
    >
      <div>
        <h2 style={{ margin: 0, color: "#228be6", fontSize: "1.5rem" }}>
          Project Management
        </h2>
      </div>

      {isAuthenticated && (
        <Group gap="lg">
          <TextInput
            placeholder="Search projects, tasks..."
            leftSection={<IconSearch size={14} />}
            style={{ width: 250 }}
            radius="md"
          />
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Group gap="xs" style={{ cursor: "pointer" }}>
                <Avatar name={userName} color="blue" />
                <Text size="sm">{user?.email}</Text>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconUser size={14} />}>
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={14} />}>
                Settings
              </Menu.Item>
              <Divider />
              <Menu.Item
                onClick={handleLogout}
                leftSection={<IconLogout size={14} />}
                color="red"
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
    </nav>
  );
};
