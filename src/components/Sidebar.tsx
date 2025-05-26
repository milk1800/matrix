
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
  LayoutGrid,
  PieChart,
  Shapes,
  FlaskConical,
  ShieldAlert,
  BellRing,
  Brain,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Mail,
  Contact as ContactIcon,
  ListChecks,
  CalendarDays,
  Briefcase,
  ChevronDown,
  Workflow,
  KanbanSquare,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
      { name: 'Files', icon: FileText, href: '/client-portal/files' },
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
  hasNewAlerts: true,
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const currentPathname = usePathname();

  useEffect(() => {
    setIsClient(true); // Ensures localStorage is only accessed on the client
    const storedCollapsed = localStorage.getItem("matrix-sidebar-collapsed");
    if (storedCollapsed) {
      setCollapsed(storedCollapsed === "true");
    }

    const initialOpenState: Record<string, boolean> = {};
    navSectionsData.forEach(section => {
      const isActiveSection = section.items.some(item => currentPathname.startsWith(item.href));
      initialOpenState[section.id] = isActiveSection || !collapsed; // Default to open if not collapsed or active
    });
    
    const storedSectionsState = localStorage.getItem("matrix-sidebar-sections-open");
    if (storedSectionsState) {
        try {
            const parsedStored = JSON.parse(storedSectionsState);
            Object.keys(initialOpenState).forEach(key => {
                if (parsedStored.hasOwnProperty(key)){
                    initialOpenState[key] = parsedStored[key];
                }
            });
        } catch (e) {
            console.error("Failed to parse sidebar sections state from localStorage", e);
        }
    }
    setOpenSections(initialOpenState);

  }, [currentPathname]); // Re-evaluate on route change, but not on collapsed state change

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    if (isClient) {
      localStorage.setItem("matrix-sidebar-collapsed", String(newCollapsedState));
    }
    setCollapsed(newCollapsedState);
    // When collapsing, ensure all sections are marked as 'open' for icon-only view logic
    // When expanding, restore their previous state or default to open.
    if (newCollapsedState) {
        // No change to openSections needed for icon-only view
    } else {
        const currentOpenSections = {...openSections};
        navSectionsData.forEach(section => {
            if (currentOpenSections[section.id] === undefined) { // If a section was never interacted with, default to open
                currentOpenSections[section.id] = true;
            }
        });
        setOpenSections(currentOpenSections);
    }
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
    
    const iconClasses = cn(
      "w-5 h-5 shrink-0 transition-colors duration-200",
      isActive 
        ? "text-primary" 
        : item.hasNewAlerts 
          ? "animate-red-pulse text-red-500" 
          : "text-sidebar-foreground"
    );

    const linkContent = (
      <>
        <item.icon className={iconClasses} />
        {(!collapsed || !isIconOnlyContext) && <span className="truncate">{item.name}</span>}
      </>
    );

    const linkClasses = cn(
      "flex items-center gap-4 px-4 py-2 text-base font-medium rounded-[8px] transition-all duration-200 ease-out",
      "bg-white/[.02] text-sidebar-foreground", // Consistent background and text for all states
      "hover:bg-white/[.05] hover:-translate-y-px", // Subtle hover for all items
      collapsed && isIconOnlyContext && "justify-center p-2.5"
    );

    if (collapsed && isIconOnlyContext) {
      return (
        <Tooltip key={item.name} open={isClient && hoveredItem === item.name ? true : undefined}>
          <TooltipTrigger asChild>
            <Link 
              href={item.href} 
              className={linkClasses} 
              aria-label={item.name}
              onMouseEnter={() => isClient && setHoveredItem(item.name)}
              onMouseLeave={() => isClient && setHoveredItem(null)}
            >
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
        <Link 
          key={item.name} 
          href={item.href} 
          className={linkClasses}
          onMouseEnter={() => isClient && setHoveredItem(item.name)}
          onMouseLeave={() => isClient && setHoveredItem(null)}
        >
          {linkContent}
        </Link>
      );
    }
  };
  
  if (!isClient && typeof window === 'undefined') { // Prevents trying to access localStorage on server
      return (
         <aside className={cn("h-full bg-black/90 border-r border-gray-800 text-white transition-all duration-300", "w-64")}>
            {/* Basic skeleton or placeholder for SSR to avoid layout shifts / errors */}
         </aside>
      );
  }


  return (
    <aside
      className={cn(
        "h-full bg-black/90 border-r border-gray-800 text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64" 
      )}
    >
      <div className={cn("flex items-center p-4 px-5", collapsed ? "justify-center" : "justify-between")}>
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
              renderNavItem(item, true)
            )
          ) : (
            navSectionsData.map((section) => (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "flex items-center w-full text-left px-4 py-3 rounded-md hover:bg-black/50 transition-colors duration-150 ease-out",
                    "border-b border-sidebar-border/30" 
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
