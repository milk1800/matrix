
"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  TrendingUp,
  Repeat,
  LayoutGrid,
  PieChart,
  Shapes,
  // FileText, // Removed as "Reports" is being removed
  FlaskConical,
  PiggyBank, // Assuming this was for Contribution Matrix if TrendingUp was a duplicate
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Updated navItems without "Reports"
const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/asset-analytics', label: 'Asset Analytics', icon: BarChart3 },
  { href: '/client-analytics', label: 'Client Analytics', icon: Users },
  { href: '/financial-analytics', label: 'Financial Analytics', icon: TrendingUp },
  { href: '/conversion-analytics', label: 'Conversion Analytics', icon: Repeat },
  { href: '/resource-matrix', label: 'Resource Matrix', icon: LayoutGrid },
  { href: '/portfolio-matrix', label: 'Portfolio Matrix', icon: PieChart },
  { href: '/model-matrix', label: 'Model Matrix', icon: Shapes },
  { href: '/contribution-matrix', label: 'Contribution Matrix', icon: TrendingUp }, // Or PiggyBank if preferred
  { href: '/project-x', label: 'Project X', icon: FlaskConical },
];

const sections = [
  {
    title: "ANALYTICS CENTER",
    items: ['/dashboard', '/asset-analytics', '/client-analytics', '/financial-analytics', '/conversion-analytics'],
  },
  {
    title: "MATRIX TOOLS",
    items: ['/resource-matrix', '/portfolio-matrix', '/model-matrix', '/contribution-matrix', '/project-x'],
  },
];

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarMenu className="p-4 space-y-1">
        {sections.map((section, sectionIndex) => (
          <React.Fragment key={section.title}>
            {sectionIndex > 0 && <div className="pt-2" />} {/* Add spacing before subsequent sections */}
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-lg font-bold text-gray-300 tracking-wider uppercase border-b border-sidebar-border/30 pb-1">
                {section.title}
              </h2>
            </div>
            {navItems
              .filter(navItem => section.items.includes(navItem.href))
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
