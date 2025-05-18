import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  value?: string;
  description?: React.ReactNode;
  icon?: LucideIcon | string; // Icon can be a LucideIcon component OR a string path
  children?: React.ReactNode;
  className?: string;
}

export function PlaceholderCard({ title, value, description, icon, children, className }: PlaceholderCardProps) {
  const isStringPathIcon = typeof icon === 'string';
  const LucideIconComponent = typeof icon === 'function' ? icon : null;

  return (
    <Card className={cn(
      "bg-black/[.40] backdrop-blur-sm rounded-lg shadow-white-glow-soft",
      "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-white-glow-hover",
      className
    )}>
      <CardHeader className={cn(
        "flex p-4", // Unified base padding
        isStringPathIcon ? "flex-col items-start pb-2" : "flex-row items-center space-y-0 pb-2" // Adjust layout based on icon type
      )}>
        {isStringPathIcon && icon && ( // If icon is a string path, render Image
          <div className="mb-2"> {/* Wrapper for consistent spacing for top image */}
            <Image src={icon} alt={title} width={32} height={32} />
          </div>
        )}
        {/* Render LucideIconComponent only if it's a function AND not a string path case */}
        {!isStringPathIcon && LucideIconComponent && (
          <LucideIconComponent className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
        )}
        <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {value && <div className="text-3xl font-bold text-foreground">{value}</div>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        {!children && !value && (
          <div className="text-muted-foreground h-[50px] flex items-center">Placeholder content</div>
        )}
      </CardContent>
    </Card>
  );
}
