
import type { LucideIcon } from "lucide-react";
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  value?: string;
  description?: React.ReactNode; // Allow ReactNode for description (e.g. for colored text)
  icon?: LucideIcon | string; // Can be LucideIcon component or string path
  children?: React.ReactNode; // For embedding a chart or other content
  className?: string;
}

export function PlaceholderCard({ title, value, description, icon, children, className }: PlaceholderCardProps) {
  const IconComponent = typeof icon === 'function' ? icon : null;
  const iconPath = typeof icon === 'string' ? icon : null;

  return (
    <Card className={cn(
      "shadow-card-default-glow hover:shadow-card-hover-glow hover:-translate-y-1 transition-all duration-300 ease-in-out bg-card/50 border border-white/10",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        {iconPath && (
          <Image src={iconPath} alt={title} width={36} height={36} className="mb-2 text-primary" />
        )}
        <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
        {IconComponent && !iconPath && <IconComponent className="h-5 w-5 text-primary" />}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {value && <div className="text-3xl font-bold text-foreground">{value}</div>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        {!children && !value && !IconComponent && !iconPath && <div className="text-muted-foreground h-[50px] flex items-center">Placeholder content</div>}
      </CardContent>
    </Card>
  );
}
