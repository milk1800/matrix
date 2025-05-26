
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
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
  BellRing,
  Brain,
  ChevronLeft,
  ChevronRight,
  AppWindow,
  Home as HomeIcon,
  Mail,
  Contact as ContactIcon,
  ListChecks,
  CalendarDays,
  Briefcase,
  ChevronDown,
  Workflow,
  KanbanSquare,
  FileText, // Added FileText for Files tab
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Added for toggle button

interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
  hasNewAlerts?: boolean;
}

interface NavSection {
  id: string;
  title: string;
  icon: LucideIcon;
  items: NavItem[];
}

const navSectionsData: NavSection[] = [
  {
    id: 'clientPortal',
    title: 'CLIENT PORTAL',
    icon: AppWindow,
    items: [
      { name: 'Home', icon: HomeIcon, href: '/client-portal/home' },
      { name: 'Email', icon: Mail, href: '/client-portal/email' },
      { name: 'Contacts', icon: ContactIcon, href: '/client-portal/contacts' },
      { name: 'Tasks', icon: ListChecks, href: '/client-portal/tasks' },
      { name: 'Workflows', icon: Workflow, href: '/client-portal/workflows' },
      { name: 'Calendar', icon: CalendarDays, href: '/client-portal/calendar' },
      { name: 'Opportunities', icon: Briefcase, href: '/client-portal/opportunities' },
      { name: 'Projects', icon: KanbanSquare, href: '/client-portal/projects' },
      { name: 'Files', icon: FileText, href: '/client-portal/files' }, // New Files tab
    ],
  },
  {
    id: 'analytics',
    title: 'ANALYTICS CENTER',
    icon: BarChart3,
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Asset Analytics', icon: BarChart3, href: '/asset-analytics' },
      { name: 'Client Analytics', icon: Users, href: '/client-analytics' },
      { name: 'Financial Analytics', icon: TrendingUp, href: '/financial-analytics' },
      { name: 'Conversion Analytics', icon: Repeat, href: '/conversion-analytics' },
      { name: 'Compliance Matrix', icon: ShieldAlert, href: '/compliance-matrix' },
      { name: 'Resource Matrix', icon: LayoutGrid, href: '/resource-matrix' },
      { name: 'Portfolio Matrix', icon: PieChart, href: '/portfolio-matrix' },
      { name: 'Model Matrix', icon: Shapes, href: '/model-matrix' },
      { name: 'Contribution Matrix', icon: TrendingUp, href: '/contribution-matrix' },
      { name: 'Project X', icon: FlaskConical, href: '/project-x' },
    ],
  },
];

const alertsNavItem: NavItem = {
  name: 'Alerts',
  icon: BellRing,
  href: '/alerts',
  hasNewAlerts: true, // Mocked for now
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const currentPathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const storedCollapsed = localStorage.getItem("matrix-sidebar-collapsed");
    if (storedCollapsed) {
      setCollapsed(storedCollapsed === "true");
    }

    const storedSectionsState = localStorage.getItem("matrix-sidebar-sections-open");
    const initialOpenSections: Record<string, boolean> = {};
    navSectionsData.forEach(section => {
      // Default sections to open if not found in localStorage or if sidebar is expanded
      const sectionIsActiveOrParent = section.items.some(item => currentPathname.startsWith(item.href));
      initialOpenSections[section.id] = sectionIsActiveOrParent || true; // Default to open
    });

    if (storedSectionsState) {
      try {
        const parsedStoredSections = JSON.parse(storedSectionsState);
        Object.keys(initialOpenSections).forEach(key => {
          if (parsedStoredSections.hasOwnProperty(key)) {
            initialOpenSections[key] = parsedStoredSections[key];
          }
        });
      } catch (e) {
        console.error("Failed to parse sidebar sections state from localStorage", e);
      }
    }
    setOpenSections(initialOpenSections);
  }, [currentPathname]); // Add currentPathname to re-evaluate active sections on route change

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    if (isClient) {
      localStorage.setItem("matrix-sidebar-collapsed", String(newCollapsedState));
    }
    setCollapsed(newCollapsedState);
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newOpenState = { ...prev, [sectionId]: !prev[sectionId] };
      if (isClient) {
        localStorage.setItem("matrix-sidebar-sections-open", JSON.stringify(newOpenState));
      }
      return newOpenState;
    });
  };

  const renderNavItem = (item: NavItem, isIconOnlyContext: boolean = false) => {
    const isActive = currentPathname === item.href || (currentPathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '/');
    
    const linkContent = (
      <>
        <item.icon className={cn(
          "w-5 h-5 shrink-0",
          item.hasNewAlerts && isActive && "text-sidebar-primary-foreground",
          item.hasNewAlerts && !isActive && "animate-red-pulse text-red-500" // Defined in globals.css
        )} />
        {(!collapsed || !isIconOnlyContext) && <span className="truncate">{item.name}</span>}
      </>
    );

    const linkClasses = cn(
      "flex items-center gap-4 px-4 py-2 text-base font-medium rounded-[8px] transition-all duration-300 ease-out transform-gpu",
      "bg-white/[.02] text-sidebar-foreground",
      isActive
        ? "bg-primary/30 shadow-card-hover-glow -translate-y-0.5 text-sidebar-primary-foreground" // shadow-card-hover-glow from tailwind.config.ts
        : "hover:bg-white/[.05] hover:shadow-[0_2px_8px_rgba(80,0,160,0.4)] hover:-translate-y-0.5",
      collapsed && isIconOnlyContext && "justify-center p-2.5"
    );

    if (collapsed && isIconOnlyContext) {
      return (
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <Link href={item.href} className={linkClasses} aria-label={item.name}>
              {linkContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-popover text-popover-foreground text-sm rounded-md px-2 py-1 shadow-lg">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      );
    } else {
      return (
        <Link key={item.name} href={item.href} className={linkClasses}>
          {linkContent}
        </Link>
      );
    }
  };

  if (!isClient) {
    // Optional: Render a skeleton or null during SSR to avoid hydration mismatch with localStorage
    return (
      <aside className={cn("h-full bg-black/90 border-r border-gray-800 text-white transition-all duration-300", collapsed ? "w-20" : "w-64")}>
        {/* Placeholder for logo and toggle */}
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "h-full bg-black/90 border-r border-gray-800 text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64" // Updated collapsed width
      )}
    >
      <div className={cn("flex items-center justify-between p-4 px-5", collapsed ? "justify-center" : "justify-between")}>
        <div className={cn("flex items-center space-x-3", collapsed ? "justify-center w-full" : "")}>
          <Brain className={cn("text-purple-500 animate-pulse-neon", collapsed ? "w-8 h-8" : "w-10 h-10")} />
          {!collapsed && (
            <span className="text-4xl font-bold text-metallic-gradient">
              Matrix
            </span>
          )}
        </div>
        {!collapsed && (
          <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="p-1 text-gray-400 hover:text-white hover:bg-white/10"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
      </div>
      {collapsed && (
        <div className="flex justify-center items-center py-2 border-t border-sidebar-border/30">
           <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {collapsed ? (
            navSectionsData.flatMap(section => section.items).map((item) =>
              renderNavItem(item, true) // true indicates icon-only context
            )
          ) : (
            navSectionsData.map((section) => (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "flex items-center w-full text-left px-4 py-3 rounded-md hover:bg-black/50 transition-colors duration-150 ease-out",
                    // "border-b border-sidebar-border/30" // Using this for faint underline
                  )}
                  aria-expanded={openSections[section.id]}
                >
                  <section.icon className="w-5 h-5 shrink-0 text-gray-400" />
                  <span className="ml-3 text-lg font-bold text-gray-300 uppercase tracking-wider truncate flex-1">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                      openSections[section.id] && "rotate-180"
                    )}
                  />
                </button>
                {openSections[section.id] && (
                  <div className="mt-1 space-y-1 pl-4">
                    {section.items.map((item) => renderNavItem(item))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>
        <div className="mt-auto p-2 border-t border-sidebar-border/30">
          {renderNavItem(alertsNavItem, collapsed)}
        </div>
      </TooltipProvider>
    </aside>
  );
}

