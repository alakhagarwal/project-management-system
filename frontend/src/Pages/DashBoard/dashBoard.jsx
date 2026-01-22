import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Title, Text, Button, Container, Loader, Center } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLogout, IconAlertCircle } from "@tabler/icons-react";
import { api } from "../../components/api";

function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await api.validateToken(token);
        if (response.valid) {
          setUserEmail(response.email);
        } else {
          localStorage.clear();
          notifications.show({
            title: "Session expired",
            message: "Please login again",
            color: "yellow",
            icon: <IconAlertCircle size="1rem" />,
          });
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.clear();
        notifications.show({
          title: "Session expired",
          message: error.message || "Please login again",
          color: "red",
          icon: <IconAlertCircle size="1rem" />,
        });
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    notifications.show({
      title: "Logged out",
      message: "You have been successfully logged out",
      color: "blue",
    });
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <Loader size="xl" color="blue" />
          <Text mt="md" size="lg" c="dimmed">
            Verifying your session...
          </Text>
        </div>
      </Center>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
      }}
    >
      <Container size="md">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} mb="md">
            Dashboard
          </Title>
          <Text size="lg" mb="xl">
            Welcome, <strong>{userEmail}</strong>!
          </Text>
          <Text c="dimmed" mb="xl">
            You are successfully logged in. Your session is active.
          </Text>
          <Button
            leftSection={<IconLogout size="1rem" />}
            color="red"
            variant="light"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Paper>
      </Container>
    </div>
  );
}

export default Dashboard;
