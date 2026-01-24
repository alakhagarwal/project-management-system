export const mockProjects = [
  {
    id: "1",
    name: "Delivery Partner App",
    description: "Building Delivery Partner App for iOS and Android",
    status: "ACTIVE",
    progress: 0,
    members: 1,
    dueDate: "Oct 31, 2025",
  },
  {
    id: "2",
    name: "Customer App Development",
    description: "Building Customer Order App for iOS and Android",
    status: "ACTIVE",
    progress: 0,
    members: 1,
    dueDate: "Oct 31, 2025",
  },
];

export const mockTasks = [
  {
    id: "1",
    title: "UI / UX Design",
    type: "TASK",
    priority: "MEDIUM",
    projectId: "1",
  },
  {
    id: "2",
    title: "Android App Development",
    type: "FEATURE",
    priority: "HIGH",
    projectId: "1",
  },
  {
    id: "3",
    title: "iOS App Development",
    type: "IMPROVEMENT",
    priority: "MEDIUM",
    projectId: "1",
  },
];

export const statusMetrics = [
  {
    title: "Total Projects",
    count: 2,
    subtitle: "projects in Workspace",
    color: "blue",
  },
  {
    title: "Completed Projects",
    count: 0,
    subtitle: "of 2 total",
    color: "green",
  },
  {
    title: "My Tasks",
    count: 3,
    subtitle: "assigned to me",
    color: "violet",
  },
  {
    title: "Overdue",
    count: 0,
    subtitle: "need attention",
    color: "orange",
  },
];
