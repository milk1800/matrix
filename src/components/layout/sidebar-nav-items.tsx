
"use client";

import * as React from 'react'; // Added this line
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  TrendingUp,
  Repeat,
  LayoutGrid,
  PieChart,
  Shapes,
  CalendarClock,
  FileText,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  section?: string; // Optional: to help group or identify sections if needed later
}

const navItems: NavItem[] = [
  { href: '/asset-analytics', label: 'Asset Analytics', icon: BarChart3, section: "Analytics Center" },
  { href: '/client-analytics', label: 'Client Analytics', icon: Users, section: "Analytics Center" },
  { href: '/financial-analytics', label: 'Financial Analytics', icon: TrendingUp, section: "Analytics Center" },
  { href: '/conversion-analytics', label: 'Conversion Analytics', icon: Repeat, section: "Analytics Center" },
  { href: '/resource-matrix', label: 'Resource Matrix', icon: LayoutGrid, section: "Analytics Center" },
  { href: '/portfolio-matrix', label: 'Portfolio Matrix', icon: PieChart, section: "Matrix Tools" },
  { href: '/model-matrix', label: 'Model Matrix', icon: Shapes, section: "Matrix Tools" },
  { href: '/rmd-matrix', label: 'RMD Matrix', icon: CalendarClock, section: "Matrix Tools" },
  { href: '/reports', label: 'Reports', icon: FileText, section: "Matrix Tools" },
  { href: '/winger-matrix', label: 'Winger Matrix', icon: Layers, section: "Matrix Tools" },
];

const sections = {
  "Analytics Center": [
    '/asset-analytics',
    '/client-analytics',
    '/financial-analytics',
    '/conversion-analytics',
    '/resource-matrix',
  ],
  "Matrix Tools": [
    '/portfolio-matrix',
    '/model-matrix',
    '/rmd-matrix',
    '/reports',
    '/winger-matrix',
  ],
};

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-4 space-y-1">
      {Object.entries(sections).map(([sectionTitle, sectionItems]) => (
        <React.Fragment key={sectionTitle}>
          <div className="px-4 pt-3 pb-1.5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-sidebar-border/30 pb-1">
              {sectionTitle}
            </h2>
          </div>
          {navItems
            .filter(item => sectionItems.includes(item.href))
            .map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
              return (
                <SidebarMenuItem key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "w-full justify-start transform-gpu",
                            "py-[10px] px-4 rounded-[8px] text-sidebar-foreground transition-all duration-300 ease-out",
                            "bg-black/40", // Base style for floating card
                            isActive
                              ? "bg-primary/30 shadow-[0_0_12px_rgba(124,58,237,0.25)] -translate-y-px text-sidebar-primary-foreground" // Active item style
                              : "hover:bg-black/50 hover:shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:-translate-y-px" // Hover style for non-active items
                          )}
                        >
                          <a>
                            <item.icon className="h-5 w-5 mr-3 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              );
            })}
        </React.Fragment>
      ))}
    </SidebarMenu>
  );
}
