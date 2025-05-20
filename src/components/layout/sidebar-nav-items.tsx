
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
  FileText,
  Layers,
  UserCog,
  LibraryBig
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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
  { href: '/reports', label: 'Reports', icon: FileText, section: "Analytics Center" },
  { href: '/resource-matrix', label: 'Resource Matrix', icon: LayoutGrid, section: "Matrix Tools" },
  { href: '/portfolio-matrix', label: 'Portfolio Matrix', icon: PieChart, section: "Matrix Tools" },
  { href: '/model-matrix', label: 'Model Matrix', icon: Shapes, section: "Matrix Tools" },
  { href: '/contribution-matrix', label: 'Contribution Matrix', icon: TrendingUp, section: "Matrix Tools" },
  // { href: '/winger-matrix', label: 'Winger Matrix', icon: Layers, section: "Matrix Tools" }, // Removed Winger Matrix
];

const sections = {
  "Analytics Center": [
    '/asset-analytics',
    '/client-analytics',
    '/financial-analytics',
    '/conversion-analytics',
    '/reports',
  ],
  "Matrix Tools": [
    '/resource-matrix',
    '/portfolio-matrix',
    '/model-matrix',
    '/contribution-matrix',
    // '/winger-matrix', // Removed Winger Matrix
  ],
};

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarMenu className="p-4 space-y-1">
        {Object.entries(sections).map(([sectionTitle, sectionItemsHrefs]) => (
          <React.Fragment key={sectionTitle}>
            <div className="px-4 py-3">
              <h2 className="text-lg font-bold text-gray-300 uppercase tracking-wider border-b border-sidebar-border/30 pb-1">
                {sectionTitle}
              </h2>
            </div>
            {navItems
              .filter(item => sectionItemsHrefs.includes(item.href))
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
                              "py-[10px] px-4 rounded-[8px]",
                              "bg-white/[.02] text-sidebar-foreground transition-all duration-300 ease-out",
                              isActive
                                ? "bg-primary/[.15] shadow-[0_2px_10px_hsla(var(--primary),0.5)] -translate-y-0.5 text-sidebar-primary-foreground"
                                : "hover:bg-white/[.05] hover:shadow-[0_2px_8px_rgba(80,0,160,0.4)] hover:-translate-y-0.5"
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
    </TooltipProvider>
  );
}
