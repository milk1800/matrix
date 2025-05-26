
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
  AppWindow,
  Workflow,
  KanbanSquare,
  FileText,
  BarChart2, // Added for Reports
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
      { name: 'Reports', icon: BarChart2, href: '/client-portal/reports' }, // New Reports tab
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
      { name: 'Portfolio Matrix', icon: PieChart, href: '/portfolio-matrix' },
      { name: 'Model Matrix', icon: Shapes, href: '/model-matrix' },
      { name: 'Contribution Matrix', icon: TrendingUp, href: '/contribution-matrix' },
      { name: 'Project X', icon: FlaskConical, href: '/project-x' },
    ],
  },
   {
    id: 'tools',
    title: 'MATRIX TOOLS',
    icon: LayoutGrid, // Using LayoutGrid as a general "tools" icon
    items: [
      { name: 'Resource Matrix', icon: LayoutGrid, href: '/resource-matrix' },
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
  const [isClient, setIsClient] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
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
    } else if (typeof window !== 'undefined') { 
        navSectionsData.forEach(section => {
             initialOpenState[section.id] = !collapsed; 
        });
    }
    setOpenSections(initialOpenState);

  }, [currentPathname, collapsed]); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("matrix-sidebar-collapsed", String(collapsed));
      if (collapsed) {
        const allOpenState: Record<string, boolean> = {};
        navSectionsData.forEach(section => {
          allOpenState[section.id] = true;
        });
        localStorage.setItem("matrix-sidebar-sections-open", JSON.stringify(allOpenState));
      } else {
        localStorage.setItem("matrix-sidebar-sections-open", JSON.stringify(openSections));
      }
    }
  }, [collapsed, openSections]);


  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newOpenState = { ...prev, [sectionId]: !prev[sectionId] };
      if (typeof window !== 'undefined') {
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
          : "text-sidebar-foreground/70 group-hover/navitem:text-sidebar-foreground"
    );

    const linkClasses = cn(
      "flex items-center gap-4 px-4 py-2 text-base font-medium rounded-[8px] transition-all duration-200 ease-out group/navitem",
      "bg-white/[.02] text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-white/[.05] hover:-translate-y-px",
      collapsed && isIconOnlyContext && "justify-center p-2.5"
    );

    const linkContent = (
      <>
        <item.icon className={iconClasses} />
        {(!collapsed || !isIconOnlyContext) && <span className="truncate">{item.name}</span>}
      </>
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
  
  if (!isClient && typeof window === 'undefined') { 
      return (
         <aside className={cn("h-full bg-black/90 border-r border-gray-800/50 text-white transition-all duration-300 flex flex-col", "w-64")}>
            {/* Basic structure for SSR to avoid layout shifts or empty sidebar */}
            <div className="flex items-center justify-center p-4 px-5">
                <div className="w-10 h-10 bg-purple-500/30 rounded-full animate-pulse"></div>
            </div>
            <nav className="flex-1 p-2 space-y-1">
                {/* Could render skeleton loaders here if desired */}
            </nav>
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
        <div className={cn("flex items-center justify-center space-x-3", collapsed && "w-full")}>
          <Brain className={cn("text-purple-500 animate-pulse-neon", collapsed ? "w-8 h-8" : "w-10 h-10")} />
          {!collapsed && (
            <span className="text-4xl font-bold text-metallic-gradient leading-tight">
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
                aria-label="Collapse sidebar"
            >
            <ChevronLeft className="w-5 h-5" />
            </Button>
         )}
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
                    "flex items-center w-full text-left px-4 py-3 rounded-md hover:bg-black/30 transition-colors duration-150 ease-out group/section",
                    "border-b border-sidebar-border/20" 
                  )}
                  aria-expanded={openSections[section.id]}
                >
                  <section.icon className="w-5 h-5 shrink-0 text-gray-400 group-hover/section:text-gray-200" />
                  {!collapsed && (
                    <>
                    <span className="ml-3 text-lg font-bold text-gray-300 uppercase tracking-wider truncate flex-1 group-hover/section:text-gray-100">
                        {section.title}
                    </span>
                    <ChevronDown
                        className={cn(
                        "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 group-hover/section:text-gray-200",
                        openSections[section.id] && "rotate-180"
                        )}
                    />
                    </>
                  )}
                </button>
                {(!collapsed && openSections[section.id]) && (
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
