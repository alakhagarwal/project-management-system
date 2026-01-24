import {
  IconFolder,
  IconCheck,
  IconClipboardList,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const iconMap = {
  blue: IconFolder,
  green: IconCheck,
  violet: IconClipboardList,
  orange: IconAlertTriangle,
};

const colorClasses = {
  blue: {
    bg: "bg-status-blue-bg",
    icon: "text-status-blue",
  },
  green: {
    bg: "bg-status-green-bg",
    icon: "text-status-green",
  },
  violet: {
    bg: "bg-status-violet-bg",
    icon: "text-status-violet",
  },
  orange: {
    bg: "bg-status-orange-bg",
    icon: "text-status-orange",
  },
};

export function StatusCard({ title, count, subtitle, color }) {
  const Icon = iconMap[color];
  const classes = colorClasses[color];

  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold text-foreground">{count}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={cn("rounded-lg p-2.5", classes.bg)}>
          <Icon className={cn("h-5 w-5", classes.icon)} />
        </div>
      </div>
    </div>
  );
}
