import { useState } from "react";
import {
  Paper,
  NavLink,
  Group,
  Badge,
  ThemeIcon,
  Stack,
  Collapse,
  Text,
  Box,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconFolder,
  IconUsers,
  IconSettings,
  IconChevronDown,
  IconClipboardList,
  IconChartBar,
  IconCalendar,
} from "@tabler/icons-react";

const projectSubItems = [
  { icon: IconClipboardList, label: "Tasks" },
  { icon: IconChartBar, label: "Analytics" },
  { icon: IconCalendar, label: "Calendar" },
  { icon: IconSettings, label: "Settings" },
];

export const Sidebar = ({ projects, taskCount }) => {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState(
    new Set([projects[0]?.id]),
  );

  const toggleProject = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  return (
    <Paper
      p="md"
      withBorder
      style={{
        width: 280,
        height: "100vh",
        borderRight: "1px solid var(--mantine-color-gray-2)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Workspace Header */}
      <Group justify="space-between" mb="lg" px="sm">
        <ThemeIcon variant="light" size="lg" radius="md" color="blue">
          <IconLayoutDashboard size={18} />
        </ThemeIcon>
        <div>
          <Text fw={600} size="sm">
            Workspace
          </Text>
          <Text size="xs" c="dimmed">
            1 workspace
          </Text>
        </div>
      </Group>

      {/* Navigation Items */}
      <Stack gap={0} mb="lg">
        <NavLink
          label="Dashboard"
          icon={<IconLayoutDashboard size={16} />}
          active
        />
        <NavLink label="Projects" icon={<IconFolder size={16} />} />
        <NavLink label="Team" icon={<IconUsers size={16} />} />
        <NavLink label="Settings" icon={<IconSettings size={16} />} />

        {/* My Tasks */}
        <NavLink
          label="My Tasks"
          icon={<IconClipboardList size={16} />}
          rightSection={<Badge size="xs">{taskCount}</Badge>}
        />
      </Stack>

      {/* Projects Section */}
      <Box style={{ flex: 1 }}>
        <NavLink
          label="Projects"
          onClick={() => setProjectsOpen(!projectsOpen)}
          rightSection={
            <IconChevronDown
              size={16}
              style={{
                transform: projectsOpen ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 200ms ease",
              }}
            />
          }
        />
        <Collapse in={projectsOpen}>
          <Stack gap={0} pl="sm" py="xs">
            {projects.map((project) => (
              <Box key={project.id}>
                <NavLink
                  label={project.name}
                  icon={<IconFolder size={14} />}
                  onClick={() => toggleProject(project.id)}
                  rightSection={
                    <IconChevronDown
                      size={14}
                      style={{
                        transform: expandedProjects.has(project.id)
                          ? "rotate(0deg)"
                          : "rotate(-90deg)",
                        transition: "transform 200ms ease",
                      }}
                    />
                  }
                />
                <Collapse in={expandedProjects.has(project.id)}>
                  <Stack gap={0} pl="sm" py="xs">
                    {projectSubItems.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        label={subItem.label}
                        icon={<subItem.icon size={14} />}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Box>
            ))}
          </Stack>
        </Collapse>
      </Box>
    </Paper>
  );
};
