
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
      {navItems.map((item) => {
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
                      isActive
                        ? "bg-primary/[.15] text-primary-foreground -translate-y-0.5 shadow-[0_2px_10px_hsla(var(--primary),0.5)]"
                        : "bg-white/[.02] hover:bg-white/[.05] hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(80,0,160,0.4)]"
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
    </SidebarMenu>
  );
}
