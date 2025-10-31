import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { cn } from "../lib/utils";

const overlayBase = "fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden";

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col">
        <Topbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <main className={cn("flex-1 bg-background p-4")}> 
          <Outlet />
        </main>
      </div>
      <div className={cn(overlayBase, isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => setIsSidebarOpen(false)} />
      <Sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 -translate-x-full rounded-r-xl border bg-card shadow-lg transition-transform md:hidden",
          isSidebarOpen && "translate-x-0"
        )}
        onNavigate={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};
