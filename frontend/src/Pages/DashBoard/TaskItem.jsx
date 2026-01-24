const typeColors = {
  TASK: "text-status-blue",
  FEATURE: "text-status-green",
  IMPROVEMENT: "text-status-violet",
  BUG: "text-status-orange",
};

const priorityColors = {
  HIGH: "text-status-orange",
  MEDIUM: "text-status-violet",
  LOW: "text-muted-foreground",
};

export function TaskItem({ task }) {
  return (
    <div className="py-3 border-b border-border last:border-b-0 hover:bg-muted/50 px-3 -mx-3 transition-colors cursor-pointer">
      <h4 className="font-medium text-sm text-foreground">{task.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">
        <span className={typeColors[task.type]}>{task.type}</span>
        {" • "}
        <span className={priorityColors[task.priority]}>
          {task.priority} Priority
        </span>
      </p>
    </div>
  );
}
