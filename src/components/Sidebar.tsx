
"use client";

import * as React from "react";
import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  TrendingUp,
  Repeat,
  ShieldAlert,
  LayoutGrid,
  PieChart,
  Shapes,
  FlaskConical,
  Brain,
  ChevronLeft,
  ChevronRight,
  BellRing, // Added for Alerts
} from "lucide-react";
import { cn } from "@/lib/utils";

// Updated navItems order
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Asset Analytics", icon: BarChart3, href: "/asset-analytics" },
  { name: "Client Analytics", icon: Users, href: "/client-analytics" },
  { name: "Financial Analytics", icon: TrendingUp, href: "/financial-analytics" },
  { name: "Conversion Analytics", icon: Repeat, href: "/conversion-analytics" },
  { name: "Compliance Matrix", icon: ShieldAlert, href: "/compliance-matrix" },
  { name: "Resource Matrix", icon: LayoutGrid, href: "/resource-matrix" },
  { name: "Portfolio Matrix", icon: PieChart, href: "/portfolio-matrix" },
  { name: "Model Matrix", icon: Shapes, href: "/model-matrix" },
  { name: "Contribution Matrix", icon: TrendingUp, href: "/contribution-matrix" }, // Kept TrendingUp, can be PiggyBank
  { name: "Project X", icon: FlaskConical, href: "/project-x" },
  { name: "Alerts", icon: BellRing, href: "/alerts", hasNewAlerts: true }, // Moved to bottom
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  // Pathname state for active link highlighting - this would ideally come from Next.js router if Sidebar can access it
  // For now, we'll manage it internally or assume it's passed as a prop if this component is used in a layout that has access to pathname
  const [pathname, setPathname] = React.useState("/dashboard"); // Default or get from actual router

  React.useEffect(() => {
    const stored = localStorage.getItem("matrix-sidebar-collapsed");
    if (stored) {
      setCollapsed(stored === "true");
    }
    // In a real Next.js app, you'd use `usePathname()` hook here if this was a client component used within app router
    // For this isolated component example, we'll simulate pathname updates or assume it's passed
    if (typeof window !== "undefined") {
        setPathname(window.location.pathname);
    }
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    localStorage.setItem("matrix-sidebar-collapsed", String(newCollapsedState));
    setCollapsed(newCollapsedState);
  };

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-transparent text-white transition-all duration-300 ease-in-out border-r border-sidebar-border/50 shadow-sidebar-glow",
        collapsed ? "w-20" : "w-64" // w-20 for 5rem, w-64 for 16rem
      )}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border/30">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "space-x-3")}>
          <Brain className="w-10 h-10 text-purple-500 animate-pulse-neon shrink-0" />
          {!collapsed && (
            <span className="text-4xl font-bold text-metallic-gradient whitespace-nowrap">
              Matrix
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {collapsed && (
         <div className="flex items-center justify-center px-4 py-4 border-b border-sidebar-border/30">
            <button
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle sidebar"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      )}

      <TooltipProvider delayDuration={0}>
        <nav className="mt-4 flex-1 space-y-1 px-2 overflow-y-auto">
          {navItems.map(({ name, icon: Icon, href, hasNewAlerts }) => {
            const isActive = pathname === href || (pathname.startsWith(href) && href !== '/dashboard');
            return (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md transition-colors duration-150 ease-out transform-gpu",
                      isActive
                        ? "bg-primary/[.15] shadow-[0_2px_10px_hsla(var(--primary),0.5)] -translate-y-0.5 text-sidebar-primary-foreground"
                        : "bg-white/[.02] text-sidebar-foreground hover:bg-white/[.05] hover:shadow-[0_2px_8px_rgba(80,0,160,0.4)] hover:-translate-y-0.5",
                      collapsed && "justify-center"
                    )}
                    onClick={() => setPathname(href)} // Simulate pathname change on click for demo
                  >
                    <Icon className={cn("w-5 h-5 shrink-0", hasNewAlerts && "animate-red-pulse text-red-500")} />
                    {!collapsed && <span className="truncate">{name}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-popover text-popover-foreground text-sm rounded-md px-2 py-1 shadow-lg">
                    {name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
