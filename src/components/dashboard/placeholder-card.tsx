
import type { LucideIcon } from "lucide-react";
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  value?: string;
  description?: React.ReactNode;
  icon?: LucideIcon | string;
  children?: React.ReactNode;
  className?: string;
}

export function PlaceholderCard({ title, value, description, icon, children, className }: PlaceholderCardProps) {
  const IconComponent = typeof icon === 'function' ? icon : null;
  const iconPath = typeof icon === 'string' ? icon : null;

  return (
    <Card className={cn(
      "bg-card backdrop-blur-sm rounded-lg shadow-white-glow-soft",
      "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-white-glow-hover",
      className
    )}>
      <CardHeader className={cn(
        "flex space-y-0 p-6 pb-2", 
        iconPath ? "flex-col items-start" : "flex-row items-center justify-between"
      )}>
        {iconPath && (
          <div className="mb-2">
            <Image src={iconPath} alt={`${title} icon`} width={36} height={36} />
          </div>
        )}
        <div className={cn("flex w-full items-center", iconPath ? "justify-start" : "justify-between")}>
          <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
          {IconComponent && !iconPath && (
            <IconComponent className="h-5 w-5 text-primary shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {value && <div className="text-3xl font-bold text-foreground">{value}</div>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        {!children && !value && !IconComponent && !iconPath && (
          <div className="text-muted-foreground h-[50px] flex items-center">Placeholder content</div>
        )}
      </CardContent>
    </Card>
  );
}
