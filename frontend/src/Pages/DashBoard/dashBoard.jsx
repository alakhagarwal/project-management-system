import { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Button,
  Badge,
  Group,
  ThemeIcon,
  Stack,
  Card,
  Progress,
  Box,
} from "@mantine/core";
import {
  IconPlus,
  IconArrowRight,
  IconClipboardList,
  IconAlertTriangle,
  IconFolderOpen,
  IconCheck,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react";
import { Sidebar } from "./SideBar";
import { mockProjects, mockTasks, statusMetrics } from "./mockData";
import { useAuth } from "../../Hooks/useAuth";

export default function DashBoard() {
  const [projects] = useState(mockProjects);
  const [tasks] = useState(mockTasks);
  const { user } = useAuth();
  const userName = user?.email?.split("@")[0] || "User";

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "COMPLETED":
        return "gray";
      case "ON_HOLD":
        return "orange";
      default:
        return "blue";
    }
  };

  const getMetricIcon = (color) => {
    const iconMap = {
      blue: IconFolderOpen,
      green: IconCheck,
      violet: IconClipboardList,
      orange: IconAlertTriangle,
    };
    return iconMap[color] || IconFolderOpen;
  };

  return (
    <Box style={{ display: "flex" }}>
      <Sidebar projects={projects} taskCount={tasks.length} />
      <Box style={{ flex: 1, overflowY: "auto" }}>
        <Container size="xl" py="xl">
          {/* Welcome Section */}
          <Flex justify="space-between" align="center" mb="xl">
            <div>
              <Title order={1}>Welcome back, {userName}!</Title>
              <Text c="dimmed" mt="xs">
                Here's what's happening with your projects today
              </Text>
            </div>
            <Button leftSection={<IconPlus size={14} />}>New Project</Button>
          </Flex>

          {/* Status Cards */}
          <Grid mb="xl" gutter="md">
            {statusMetrics.map((metric) => {
              const Icon = getMetricIcon(metric.color);
              const colorMap = {
                blue: "#217DFF",
                green: "#51CF66",
                violet: "#7C3AED",
                orange: "#FF8C42",
              };
              return (
                <Grid.Col key={metric.title} span={{ base: 12, sm: 6, md: 3 }}>
                  <Paper p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text c="dimmed" size="sm">
                          {metric.title}
                        </Text>
                        <Title order={3}>{metric.count}</Title>
                        <Text size="xs" c="dimmed" mt="xs">
                          {metric.subtitle}
                        </Text>
                      </div>
                      <ThemeIcon
                        variant="light"
                        size="lg"
                        radius="md"
                        style={{
                          backgroundColor: `${colorMap[metric.color]}20`,
                        }}
                      >
                        <Icon
                          size={20}
                          style={{ color: colorMap[metric.color] }}
                        />
                      </ThemeIcon>
                    </Group>
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>

          {/* Main Content Grid */}
          <Grid gutter="md">
            {/* Project Overview */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Title order={2}>Project Overview</Title>
                  </div>
                  <Button
                    variant="subtle"
                    rightSection={<IconArrowRight size={14} />}
                  >
                    View all
                  </Button>
                </Group>
                {projects.map((project) => (
                  <Card key={project.id} p="md" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                      <div>
                        <Title order={4}>{project.name}</Title>
                        <Text size="sm" c="dimmed">
                          {project.description}
                        </Text>
                      </div>
                      <Badge color={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </Group>
                    <Progress value={project.progress} mb="md" />
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconUsers size={14} />
                        <Text size="sm">{project.members} members</Text>
                      </Group>
                      <Group gap="xs">
                        <IconCalendar size={14} />
                        <Text size="sm">{project.dueDate}</Text>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Grid.Col>

            {/* Right Sidebar */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="md">
                {/* My Tasks */}
                <Paper p="md" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Group gap="xs">
                      <IconClipboardList size={18} />
                      <Title order={4}>My Tasks</Title>
                    </Group>
                    <Badge>{tasks.length}</Badge>
                  </Group>
                  <Stack gap="xs">
                    {tasks.map((task) => (
                      <div key={task.id}>
                        <Title order={6}>{task.title}</Title>
                        <Text size="xs" c="dimmed">
                          {task.type} • {task.priority}
                        </Text>
                      </div>
                    ))}
                  </Stack>
                </Paper>

                {/* Overdue */}
                <Paper p="md" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Group gap="xs">
                      <IconAlertTriangle size={18} />
                      <Title order={4}>Overdue</Title>
                    </Group>
                    <Badge color="orange">0</Badge>
                  </Group>
                  <Text size="sm" c="dimmed" ta="center" py="md">
                    No overdue tasks. Great work!
                  </Text>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
