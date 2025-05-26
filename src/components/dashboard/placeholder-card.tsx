
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  value?: string;
  description?: React.ReactNode;
  icon?: LucideIcon | string;
  iconClassName?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PlaceholderCard({ title, value, description, icon, iconClassName, children, className }: PlaceholderCardProps) {
  const isStringPathIcon = typeof icon === 'string';
  const IconComponent = typeof icon === 'function' ? icon : null;

  return (
    <Card className={cn(
      "bg-black/[.40] backdrop-blur-sm rounded-lg shadow-white-glow-soft",
      "transition-all duration-200 ease-out",
      "hover:-translate-y-1 hover:shadow-white-glow-hover",
      "overflow-x-hidden", // Keep this to prevent horizontal scroll on card
      "flex flex-col", // Ensure the card itself can manage height for its children if needed
      className
    )}>
      <CardHeader className={cn(
        "flex p-4 pb-2", // Standardized base padding
        isStringPathIcon ? "flex-col items-start" : "flex-row items-start", // Use items-start for Lucide icons too for better alignment if title wraps
        // Apply min-height if it's a Lucide icon to ensure consistent header height
        // for cards in a row, helping align elements in CardContent below.
        // 72px accommodates ~2 lines of text-base title + icon + padding.
        (!isStringPathIcon && IconComponent) && "min-h-[72px]"
      )}>
        {isStringPathIcon && icon && (
          <div className="mb-3"> {/* Spacing for icon above title */}
            <Image src={icon} alt={title} width={32} height={32} />
          </div>
        )}
        {/* Container for icon (if Lucide) and title to manage their alignment */}
        <div className={cn(
          "flex w-full", 
          isStringPathIcon ? "items-start" : "items-center gap-3" // Use items-center for Lucide + title if title is single line
                                                                  // If title can wrap, items-start for icon might be better
        )}>
          {!isStringPathIcon && IconComponent && (
            <IconComponent className={cn("h-5 w-5 shrink-0 mt-0.5", iconClassName || "text-muted-foreground")} /> // Added mt-0.5 for fine-tuning
          )}
          <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className={cn(
        "p-4 pt-0",
        "flex flex-col flex-grow" // Allow content to grow
      )}>
        {value && <div className="text-3xl font-bold text-foreground">{value}</div>}
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        {children && <div className={cn("flex-grow", value || description ? "mt-4" : "")}>{children}</div>}
        {!children && !value && !description && (
          <div className="text-muted-foreground h-[50px] flex items-center flex-grow">Placeholder content</div>
        )}
      </CardContent>
    </Card>
  );
}

