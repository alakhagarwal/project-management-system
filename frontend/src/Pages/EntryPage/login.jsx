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
import { useAuth } from "../../Hooks/useAuth.js";
import { authService } from "../../services/authService.js";
import { validators } from "../../utils/validators.js";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

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
    // Validate form
    const { isValid, errors: validationErrors } = validators.validateLoginForm(
      formData.email,
      formData.password,
    );

    if (!isValid) {
      setError(Object.values(validationErrors)[0] || "Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );

      // Use auth context to login
      login(response.token, { email: formData.email });

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
      let errorMessage = err.message || "Login failed. Please try again.";

      console.error("Login error details:", err);

      // Check if it's a network/fetch error
      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError")
      ) {
        errorMessage =
          "Cannot connect to server. Please make sure the backend is running on http://localhost:8080";
      } else if (errorMessage.includes("Invalid email or password")) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      }

      setError(errorMessage);
      notifications.show({
        title: "Login failed",
        message: errorMessage,
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
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
            // height: "450px",
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
              variant="light"
              color="red"
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
