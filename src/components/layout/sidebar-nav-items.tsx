
"use client";

import * as React from 'react';
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
  section?: string;
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
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-lg font-bold text-gray-300 uppercase tracking-wider border-b border-sidebar-border/30 pb-1">
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
                            "w-full justify-start transform-gpu text-base font-medium",
                            "py-[10px] px-4 rounded-[8px] text-sidebar-foreground transition-all duration-300 ease-out",
                            "bg-black/40", // Base background for floating effect
                            isActive
                              ? "bg-primary/30 shadow-[0_2px_10px_hsla(var(--primary),0.5)] -translate-y-0.5 text-sidebar-primary-foreground" // Active: brighter glow, lift
                              : "hover:bg-black/50 hover:shadow-[0_2px_8px_rgba(80,0,160,0.4)] hover:-translate-y-0.5" // Hover: subtle glow and lift
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
