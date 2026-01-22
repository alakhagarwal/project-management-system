import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconLogin } from "@tabler/icons-react";
import { mockApi } from "../../components/testApi";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await mockApi.login(formData.email, formData.password);

      localStorage.setItem("authToken", response.token);
      const expiry = new Date().getTime() + response.expiresIn;
      localStorage.setItem("tokenExpiry", expiry.toString());
      localStorage.setItem("user", JSON.stringify(response.user));

      notifications.show({
        title: "Login successful!",
        message: "Welcome back! Redirecting to dashboard...",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      notifications.show({
        title: "Login failed",
        message: err.message || "Please check your credentials",
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const fillTestData = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('./assets/bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container size="xs" className="w-full">
        <Paper
          shadow="xl"
          p="xl"
          radius="lg"
          className="w-full border-0 backdrop-blur-md bg-white/90"
          style={{
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            width: "400px",
            height: "450px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="text-center mb-6 pt-4">
            <Title
              order={2}
              className="font-bold"
              style={{
                color: "#1a1b1e",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              Welcome Back
            </Title>
          </div>

          {error && (
            <Alert
              variant="filled"
              color="red"
              title="Error"
              icon={<IconAlertCircle size="1rem" />}
              mb="md"
              radius="md"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex-grow">
            <Stack>
              <TextInput
                label="Email Address"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                size="md"
                radius="md"
                disabled={loading}
                styles={{
                  label: {
                    color: "#1a1b1e",
                    fontWeight: 500,
                    marginBottom: 4,
                  },
                  required: {
                    color: "#1a1b1e",
                  },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                size="md"
                radius="md"
                disabled={loading}
                styles={{
                  label: {
                    color: "#1a1b1e",
                    fontWeight: 500,
                    marginBottom: 4,
                  },
                  required: {
                    color: "#1a1b1e",
                  },
                }}
              />

              <Group justify="flex-end" mt="xs">
                <Link
                  to="/forgot-password"
                  className="no-underline text-sm"
                  style={{
                    color: "#228be6",
                    fontWeight: 500,
                    "&:hover": {
                      color: "#1c7ed6",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Group>

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                loading={loading}
                leftSection={!loading && <IconLogin size="1rem" />}
                className="mt-2 transition-colors"
                style={{
                  backgroundColor: "#228be6",
                  "&:hover": {
                    backgroundColor: "#1c7ed6",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>
          </form>

          <Group justify="center" mt="auto" py="md">
            <Text size="sm" style={{ color: "#868e96" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="no-underline hover:underline"
                style={{
                  color: "#228be6",
                  fontWeight: 500,
                }}
              >
                Register here
              </Link>
            </Text>
          </Group>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
