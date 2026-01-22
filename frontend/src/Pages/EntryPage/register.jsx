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
import { useAuth } from "../../Hooks/useAuth.js";
import { authService } from "../../services/authService.js";
import { validators } from "../../utils/validators.js";

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
  const { register } = useAuth();

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

  const va{ isValid, errors: validationErrors } = validators.validateRegisterForm(formData);
    setErrors(validation
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
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Use auth context to register/login
      register(response.token || `mock-token-${response.id}`, {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      });

      notifications.show({
        title: "Registration successful!",
        message: "Please login with your credentials",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } const hasFieldErrors = Object.keys(errors).some(
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
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Use auth context to register/login
      register(response.token || `mock-token-${response.id}`, {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      }

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
