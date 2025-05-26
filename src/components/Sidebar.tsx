
"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  AppWindow,
  Home as HomeIcon,
  Mail,
  Contact as ContactIcon,
  ListChecks,
  CalendarDays,
  Briefcase,
  Workflow,
  KanbanSquare,
  FileText,
  BarChart2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Brain,
  // PiggyBank // Was potentially used for Contribution Matrix, but TrendingUp is used now
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
      { name: 'Workflows', icon: Workflow, href: '/client-portal/workflows'},
      { name: 'Calendar', icon: CalendarDays, href: '/client-portal/calendar' },
      { name: 'Opportunities', icon: Briefcase, href: '/client-portal/opportunities' },
      { name: 'Projects', icon: KanbanSquare, href: '/client-portal/projects'},
      { name: 'Files', icon: FileText, href: '/client-portal/files'},
      { name: 'Reports', icon: BarChart2, href: '/client-portal/reports' },
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
      { name: 'Compliance Matrix', icon: ShieldAlert, href: '/compliance-matrix'},
      { name: 'Portfolio Matrix', icon: PieChart, href: '/portfolio-matrix' },
      { name: 'Model Matrix', icon: Shapes, href: '/model-matrix' },
      { name: 'Contribution Matrix', icon: TrendingUp, href: '/contribution-matrix' },
      { name: 'Project X', icon: FlaskConical, href: '/project-x' },
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
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isClient, setIsClient] = useState(false);
  const currentPathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedCollapsed = localStorage.getItem("matrix-sidebar-collapsed");
      const initialCollapsedValue = storedCollapsed === "true";
      setCollapsed(initialCollapsedValue);

      const initialOpenState: Record<string, boolean> = {};
      const storedSectionsState = localStorage.getItem("matrix-sidebar-sections-open");
      
      if (storedSectionsState && !initialCollapsedValue) {
          try {
              const parsedStored = JSON.parse(storedSectionsState);
              navSectionsData.forEach(section => {
                  initialOpenState[section.id] = parsedStored.hasOwnProperty(section.id) ? parsedStored[section.id] : true;
              });
          } catch (e) {
              console.error("Failed to parse sidebar sections state from localStorage", e);
              navSectionsData.forEach(section => {
                initialOpenState[section.id] = true;
              });
          }
      } else {
          navSectionsData.forEach(section => {
             initialOpenState[section.id] = !initialCollapsedValue;
          });
      }
      setOpenSections(initialOpenState);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("matrix-sidebar-collapsed", String(collapsed));
      if (!collapsed) {
        localStorage.setItem("matrix-sidebar-sections-open", JSON.stringify(openSections));
      }
    }
  }, [collapsed, openSections, isClient]);
  
  const currentDisplayCollapsed = isClient ? collapsed : false;

  const toggleSidebar = useCallback(() => {
    const newCollapsedState = !currentDisplayCollapsed;
    setCollapsed(newCollapsedState);
    if (newCollapsedState) {
        // If collapsing, save current openSections before potentially hiding them
        localStorage.setItem("matrix-sidebar-sections-open", JSON.stringify(openSections));
    } else {
        // If expanding, try to restore or default to all open
        const storedSectionsState = localStorage.getItem("matrix-sidebar-sections-open");
        const initialOpenState: Record<string, boolean> = {};
        if (storedSectionsState) {
            try {
                const parsedStored = JSON.parse(storedSectionsState);
                navSectionsData.forEach(section => {
                    initialOpenState[section.id] = parsedStored.hasOwnProperty(section.id) ? parsedStored[section.id] : true;
                });
            } catch (e) {
                navSectionsData.forEach(section => { initialOpenState[section.id] = true; });
            }
        } else {
            navSectionsData.forEach(section => { initialOpenState[section.id] = true; });
        }
        setOpenSections(initialOpenState);
    }
  }, [currentDisplayCollapsed, openSections, isClient]);

  const toggleSection = useCallback((sectionId: string) => {
    if (!currentDisplayCollapsed && isClient) {
      setOpenSections(prev => {
        const newState = { ...prev, [sectionId]: !prev[sectionId] };
        return newState;
      });
    }
  }, [currentDisplayCollapsed, isClient]);

  const renderNavItem = (item: NavItem, isIconOnlyView: boolean) => {
    const isActive = currentPathname === item.href || (currentPathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '/');
    
    const iconClasses = cn(
      "w-5 h-5 shrink-0 transition-colors duration-200",
      isActive 
        ? "text-primary" 
        : item.hasNewAlerts && isClient // Only flash if client-side rendering and new alerts
          ? "animate-red-pulse text-red-500" 
          : "text-sidebar-foreground/70 group-hover/navitem:text-sidebar-foreground"
    );

    const linkClasses = cn(
      "flex items-center gap-4 px-4 py-2 text-base font-medium rounded-[8px] transition-all duration-200 ease-out group/navitem",
      "bg-white/[.02] text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-white/[.05] hover:-translate-y-px",
      isIconOnlyView && "justify-center p-2.5"
    );

    const linkContent = (
      <>
        <item.icon className={iconClasses} />
        {!isIconOnlyView && <span className="truncate">{item.name}</span>}
      </>
    );

    if (isIconOnlyView) {
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
    // Simplified SSR rendering or placeholder to avoid localStorage issues
    return (
      <aside className="h-full bg-black/90 border-r border-gray-800/50 text-white transition-all duration-300 w-64 flex flex-col">
         <div className="flex items-center p-4 px-5 justify-between">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="text-purple-500 animate-pulse-neon w-10 h-10" />
            <span className="text-4xl font-bold text-metallic-gradient leading-tight">
              Matrix
            </span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {/* Placeholder or minimal nav for SSR */}
        </nav>
      </aside>
    );
  }


  return (
    <aside
      className={cn(
        "h-full bg-black/90 border-r border-gray-800/50 text-white transition-all duration-300 flex flex-col",
        currentDisplayCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("flex items-center p-4 px-5", currentDisplayCollapsed ? "justify-center" : "justify-between")}>
        <div className={cn("flex items-center justify-center space-x-3", currentDisplayCollapsed && "w-full")}>
          <Brain className={cn("text-purple-500 animate-pulse-neon", currentDisplayCollapsed ? "w-8 h-8" : "w-10 h-10")} />
          {!currentDisplayCollapsed && (
            <span className="text-4xl font-bold text-metallic-gradient leading-tight">
              Matrix
            </span>
          )}
        </div>
        {!currentDisplayCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md"
            aria-label={currentDisplayCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      {currentDisplayCollapsed && (
        <div className="flex justify-center items-center py-2 border-t border-b border-sidebar-border/30">
           <button
            onClick={toggleSidebar}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
          {currentDisplayCollapsed ? (
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
                    {section.items.map((item) => renderNavItem(item, false))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>
        <div className="mt-auto p-2 border-t border-sidebar-border/30">
          {renderNavItem(alertsNavItem, currentDisplayCollapsed)} 
        </div>
      </TooltipProvider>
    </aside>
  );
}

