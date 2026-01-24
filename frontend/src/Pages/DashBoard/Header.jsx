import { IconSearch, IconLogout } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header({ userEmail = "user@example.com", onLogout }) {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="relative w-96">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects, tasks..."
          className="pl-10 bg-muted border-0"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{userEmail}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <IconLogout className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
