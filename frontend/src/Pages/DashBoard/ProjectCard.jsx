import { IconUsers, IconCalendar } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statusColors = {
  ACTIVE: "bg-status-green text-white",
  COMPLETED: "bg-muted text-muted-foreground",
  ON_HOLD: "bg-status-orange text-white",
};

export function ProjectCard({ project }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {project.description}
          </p>
        </div>
        <Badge className={statusColors[project.status]}>{project.status}</Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <IconUsers className="h-4 w-4" />
          <span>{project.members} members</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconCalendar className="h-4 w-4" />
          <span>{project.dueDate}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>
    </div>
  );
}
