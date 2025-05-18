
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  value?: string;
  description?: React.ReactNode;
  icon?: LucideIcon; // Icon is now only LucideIcon
  children?: React.ReactNode;
  className?: string;
}

export function PlaceholderCard({ title, value, description, icon: IconComponent, children, className }: PlaceholderCardProps) {
  return (
    <Card className={cn(
      "bg-black/[.40] backdrop-blur-sm rounded-lg shadow-white-glow-soft", // Updated background opacity
      "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-white-glow-hover",
      className
    )}>
      <CardHeader className="flex flex-row items-center space-y-0 p-4 pb-2"> {/* Adjusted for inline icon */}
        {IconComponent && (
          <IconComponent className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
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
