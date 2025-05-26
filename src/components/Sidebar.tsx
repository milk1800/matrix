
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
  AppWindow, // Added AppWindow import
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image"; // Keep Image for brain logo if it's a PNG
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
    icon: AppWindow, // Use the imported AppWindow icon
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
  hasNewAlerts: true, // Mock new alerts
};

export default function Sidebar() {
  const [isClient, setIsClient] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const currentPathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const storedCollapsed = localStorage.getItem("matrix-sidebar-collapsed");
    if (storedCollapsed) {
      setCollapsed(storedCollapsed === "true");
    }

    const initialOpenState: Record<string, boolean> = {};
    navSectionsData.forEach(section => {
      const isActiveSection = section.items.some(item => currentPathname.startsWith(item.href));
      initialOpenState[section.id] = isActiveSection || !collapsed; 
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
    } else if (isClient) { // Only set default if nothing in localStorage AND we are on client
        navSectionsData.forEach(section => {
             initialOpenState[section.id] = !collapsed; // Default open when expanded
        });
    }
    setOpenSections(initialOpenState);

  }, [currentPathname, isClient]); // Add isClient to dependencies

  useEffect(() => {
    if (isClient) { //Only update localStorage if we are on the client
      localStorage.setItem("matrix-sidebar-collapsed", String(collapsed));
       // When collapsing, ensure all sections are marked as 'open' in localStorage for consistent icon display
      if (collapsed) {
        const allOpenState: Record<string, boolean> = {};
        navSectionsData.forEach(section => {
          allOpenState[section.id] = true;
        });
        localStorage.setItem("matrix-sidebar-sections-open", JSON.stringify(allOpenState));
      } else {
        // When expanding, restore their actual individual state
        localStorage.setItem("matrix-sidebar-sections-open", JSON.stringify(openSections));
      }
    }
  }, [collapsed, isClient, openSections]);


  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
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
          : "text-sidebar-foreground/70 group-hover/navitem:text-sidebar-foreground" // Updated for better hover
    );

    const linkContent = (
      <>
        <item.icon className={iconClasses} />
        {(!collapsed || !isIconOnlyContext) && <span className="truncate">{item.name}</span>}
      </>
    );

    const linkClasses = cn(
      "flex items-center gap-4 px-4 py-2 text-base font-medium rounded-[8px] transition-all duration-200 ease-out group/navitem",
      "text-sidebar-foreground/80 hover:text-sidebar-foreground", 
      isActive ? "bg-primary/10 text-primary" : "hover:bg-white/[.05] hover:-translate-y-px",
      collapsed && isIconOnlyContext && "justify-center p-2.5"
    );

    if (collapsed && isIconOnlyContext) {
      return (
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <Link 
              href={item.href} 
              className={linkClasses} 
              aria-label={item.name}
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
        >
          {linkContent}
        </Link>
      );
    }
  };
  
  if (!isClient) { 
      return (
         <aside className={cn("h-full bg-black/90 border-r border-gray-800 text-white transition-all duration-300 flex flex-col", "w-64")}>
         </aside>
      );
  }

  return (
    <aside
      className={cn(
        "h-full bg-black/90 border-r border-gray-800/50 text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64" 
      )}
    >
      <div className={cn("flex items-center p-4 px-5 justify-between", collapsed && "justify-center")}>
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "space-x-3")}>
          <div className={cn("animate-pulse-neon relative", collapsed ? "w-8 h-8" : "w-10 h-10")}>
            <Image src="/icons/brain-logo.png" alt="Matrix Logo" fill objectFit="contain" />
          </div>
          {!collapsed && (
            <span className="text-4xl font-bold text-metallic-gradient leading-tight">
              Matrix
            </span>
          )}
        </div>
        <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className={cn("p-1 text-gray-400 hover:text-white hover:bg-white/10", collapsed && "absolute top-4 right-1/2 translate-x-1/2 hidden")} // Initially hidden when collapsed, logic in nav section will show expand
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>
      {collapsed && (
        <div className="flex justify-center items-center py-2 border-t border-b border-sidebar-border/30">
           <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
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
                    "flex items-center w-full text-left px-4 py-3 rounded-md hover:bg-black/30 transition-colors duration-150 ease-out",
                    "border-b border-sidebar-border/20" 
                  )}
                  aria-expanded={openSections[section.id]}
                >
                  <section.icon className="w-5 h-5 shrink-0 text-gray-400 group-hover/section:text-gray-200" />
                  <span className="ml-3 text-lg font-bold text-gray-300 uppercase tracking-wider truncate flex-1 group-hover/section:text-gray-100">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 group-hover/section:text-gray-200",
                      openSections[section.id] && "rotate-180"
                    )}
                  />
                </button>
                {openSections[section.id] && (
                  <div className="mt-1 space-y-1 py-2 pl-4 border-l border-sidebar-border/20">
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
