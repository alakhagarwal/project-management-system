import { Container, Title, Text, Button, Group, Center } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm" py="xl">
      <Center>
        <div style={{ textAlign: "center" }}>
          <Title order={1} style={{ fontSize: "4rem", fontWeight: 900 }}>
            404
          </Title>
          <Title order={2} style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
            Page Not Found
          </Title>
          <Text size="lg" style={{ color: "#868e96", marginBottom: "2rem" }}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Group justify="center">
            <Button
              onClick={() => navigate("/dashboard")}
              leftSection={<IconArrowLeft size="1rem" />}
              size="md"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="subtle"
              size="md"
            >
              Go Home
            </Button>
          </Group>
        </div>
      </Center>
    </Container>
  );
};

export default NotFound;
