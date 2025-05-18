"use client";

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
}

const navItems: NavItem[] = [
  { href: '/asset-analytics', label: 'Asset Analytics', icon: BarChart3 },
  { href: '/client-analytics', label: 'Client Analytics', icon: Users },
  { href: '/financial-analytics', label: 'Financial Analytics', icon: TrendingUp },
  { href: '/conversion-analytics', label: 'Conversion Analytics', icon: Repeat },
  { href: '/resource-matrix', label: 'Resource Matrix', icon: LayoutGrid },
  { href: '/portfolio-matrix', label: 'Portfolio Matrix', icon: PieChart },
  { href: '/model-matrix', label: 'Model Matrix', icon: Shapes },
  { href: '/rmd-matrix', label: 'RMD Matrix', icon: CalendarClock },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/winger-matrix', label: 'Winger Matrix', icon: Layers },
];

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-4 space-y-1">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} asChild>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')}
                  className={cn(
                    "w-full justify-start",
                    (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/'))
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      ))}
    </SidebarMenu>
  );
}
