import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";
import { Calendar, FolderKanban, Home, Inbox, Layers, MessageSquare, Settings, Users } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/quotes", label: "Quotes & Invoices", icon: MessageSquare },
  { to: "/campaigns", label: "Campaigns", icon: Layers },
  { to: "/review", label: "Review Queue", icon: FolderKanban },
  { to: "/settings", label: "Settings", icon: Settings }
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  return (
    <aside className={cn("flex h-full w-64 flex-col border-r bg-card p-4", className)}>
      <div className="flex h-12 items-center text-lg font-semibold">CRM Admin</div>
      <nav className="mt-6 flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary/10 text-primary"
              )
            }
            onClick={onNavigate}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} CRM Platform</div>
    </aside>
  );
};
