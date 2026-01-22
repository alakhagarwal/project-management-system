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
  Grid,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconLogin } from "@tabler/icons-react";
import { mockApi } from "../../components/testApi.js";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Only clear field error if user starts typing after failed submission
    if (isSubmitted && errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
        general: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };
    let isValid = true;

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    setIsSubmitted(true);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show general error if there are field errors
      const hasFieldErrors = Object.keys(errors).some(
        (key) => key !== "general" && errors[key],
      );
      if (hasFieldErrors) {
        setErrors((prev) => ({
          ...prev,
          general: "Please fix the errors above before submitting",
        }));
      }
      return;
    }

    setLoading(true);
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    });

    try {
      const response = await mockApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("authToken", response.token);
      const expiry = new Date().getTime() + response.expiresIn;
      localStorage.setItem("tokenExpiry", expiry.toString());
      localStorage.setItem("user", JSON.stringify(response.user));

      notifications.show({
        title: "Registration successful!",
        message: "Welcome to the app! Redirecting to dashboard...",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      setErrors({
        ...errors,
        general: err.message || "Registration failed. Please try again.",
      });
      notifications.show({
        title: "Registration failed",
        message: err.message || "Please try again",
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const fillTestData = () => {
    setFormData({
      firstName: "Test",
      lastName: "User",
      email: `test${Date.now().toString().slice(-4)}@example.com`,
      password: "password123",
      confirmPassword: "password123",
    });
    // Clear any existing errors when filling test data
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    });
    setIsSubmitted(false);
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

            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="text-center mb-6 pt-4">
            {" "}
            {/* Added pt-4 and reduced mb */}
            <Title
              order={2}
              className="font-bold"
              style={{
                color: "#1a1b1e",
                marginBottom: "16px",
                textAlign: "center",
              }} // Added marginBottom
            >
              Create Account
            </Title>
          </div>

          {errors.general && (
            <Alert
              variant="filled"
              color="red"
              title="Error"
              icon={<IconAlertCircle size="1rem" />}
              mb="md"
              radius="md"
            >
              {errors.general}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex-grow">
            <Stack>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="First Name"
                    placeholder="John"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    size="md"
                    radius="md"
                    disabled={loading}
                    error={isSubmitted ? errors.firstName : ""}
                    styles={{
                      label: {
                        color: "#1a1b1e",
                        fontWeight: 500,
                        marginBottom: 4,
                      },
                      required: {
                        color: "#1a1b1e", // Black asterisk
                      },
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    size="md"
                    radius="md"
                    disabled={loading}
                    error={isSubmitted ? errors.lastName : ""}
                    styles={{
                      label: {
                        color: "#1a1b1e",
                        fontWeight: 500,
                        marginBottom: 4,
                      },
                      required: {
                        color: "#1a1b1e", // Black asterisk
                      },
                    }}
                  />
                </Grid.Col>
              </Grid>

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
                error={isSubmitted ? errors.email : ""}
                styles={{
                  label: {
                    color: "#1a1b1e",
                    fontWeight: 500,
                    marginBottom: 4,
                  },
                  required: {
                    color: "#1a1b1e", // Black asterisk
                  },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="At least 8 characters"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                size="md"
                radius="md"
                disabled={loading}
                error={isSubmitted ? errors.password : ""}
                styles={{
                  label: {
                    color: "#1a1b1e",
                    fontWeight: 500,
                    marginBottom: 4,
                  },
                  required: {
                    color: "#1a1b1e", // Black asterisk
                  },
                }}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                size="md"
                radius="md"
                disabled={loading}
                error={isSubmitted ? errors.confirmPassword : ""}
                styles={{
                  label: {
                    color: "#1a1b1e",
                    fontWeight: 500,
                    marginBottom: 4,
                  },
                  required: {
                    color: "#1a1b1e", // Black asterisk
                  },
                }}
              />

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
                {loading ? "Creating account..." : "Register"}
              </Button>
            </Stack>
          </form>

          <Group justify="center" mt="auto" py="md">
            {" "}
            {/* Added mt="auto" and py="md" */}
            <Text size="sm" style={{ color: "#868e96" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="no-underline hover:underline"
                style={{
                  color: "#228be6",
                  fontWeight: 500,
                }}
              >
                Sign in here
              </Link>
            </Text>
          </Group>
        </Paper>
      </Container>
    </div>
  );
}

export default Register;
