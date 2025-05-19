
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  value?: string;
  description?: React.ReactNode;
  icon?: LucideIcon | string;
  iconClassName?: string; // New prop for custom icon styling
  children?: React.ReactNode;
  className?: string;
}

export function PlaceholderCard({ title, value, description, icon, iconClassName, children, className }: PlaceholderCardProps) {
  const isStringPathIcon = typeof icon === 'string';
  const LucideIconComponent = typeof icon === 'function' ? icon : null;

  return (
    <Card className={cn(
      "bg-black/[.40] backdrop-blur-sm rounded-lg shadow-white-glow-soft",
      "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-white-glow-hover",
      className
    )}>
      <CardHeader className={cn(
        "flex p-4",
        isStringPathIcon ? "flex-col items-start pb-2" : "flex-row items-center space-y-0 pb-2"
      )}>
        {isStringPathIcon && icon && (
          <div className="mb-3"> {/* Adjusted margin for visual balance with title */}
            <Image src={icon} alt={title} width={32} height={32} />
          </div>
        )}
        {!isStringPathIcon && LucideIconComponent && (
          <LucideIconComponent className={cn("h-5 w-5 mr-3 shrink-0", iconClassName || "text-muted-foreground")} />
        )}
        <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {value && <div className="text-3xl font-bold text-foreground">{value}</div>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children && <div className={cn(value || description ? "mt-4" : "")}>{children}</div>}
        {!children && !value && !description && (
          <div className="text-muted-foreground h-[50px] flex items-center">Placeholder content</div>
        )}
      </CardContent>
    </Card>
  );
}
