
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
  PiggyBank,
  FlaskConical,
  ShieldAlert,
  BellRing, // Added BellRing
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  hasNewAlerts?: boolean; // Optional: for the alert icon
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/asset-analytics', label: 'Asset Analytics', icon: BarChart3 },
  { href: '/client-analytics', label: 'Client Analytics', icon: Users },
  { href: '/financial-analytics', label: 'Financial Analytics', icon: TrendingUp },
  { href: '/conversion-analytics', label: 'Conversion Analytics', icon: Repeat },
  { href: '/reports', label: 'Reports', icon: BarChart3 }, // Assuming BarChart3 for reports for now
  { href: '/compliance-matrix', label: 'Compliance Matrix', icon: ShieldAlert },
  { href: '/resource-matrix', label: 'Resource Matrix', icon: LayoutGrid },
  { href: '/portfolio-matrix', label: 'Portfolio Matrix', icon: PieChart },
  { href: '/model-matrix', label: 'Model Matrix', icon: Shapes },
  { href: '/contribution-matrix', label: 'Contribution Matrix', icon: TrendingUp }, // Changed to TrendingUp
  { href: '/alerts', label: 'Alerts', icon: BellRing, hasNewAlerts: true }, // New Alerts tab
  { href: '/project-x', label: 'Project X', icon: FlaskConical },
];


export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarMenu className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          const IconComponent = item.icon;
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
                        "bg-white/[.02] text-sidebar-foreground transition-all duration-200 ease-out",
                        isActive
                          ? "bg-primary/[.30] shadow-[0_0_12px_rgba(124,58,237,0.25)] -translate-y-px text-sidebar-primary-foreground"
                          : "hover:bg-black/50 hover:shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:-translate-y-px"
                      )}
                    >
                      <a>
                        <IconComponent className={cn(
                          "h-5 w-5 mr-3 shrink-0",
                          item.hasNewAlerts && "animate-red-pulse text-red-400" // Pulse effect for alerts
                        )} />
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
      </SidebarMenu>
    </TooltipProvider>
  );
}

