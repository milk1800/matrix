import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  value?: string;
  description?: React.ReactNode; // Allow ReactNode for description (e.g. for colored text)
  icon?: LucideIcon;
  children?: React.ReactNode; // For embedding a chart or other content
  className?: string;
}

export function PlaceholderCard({ title, value, description, icon: Icon, children, className }: PlaceholderCardProps) {
  return (
    <Card className={cn(
      "shadow-none transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-card-hover-glow",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-primary" />}
      </CardHeader>
      <CardContent>
        {value && <div className="text-3xl font-bold text-foreground">{value}</div>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        {!children && !value && <div className="text-muted-foreground h-[50px] flex items-center">Placeholder content</div>}
      </CardContent>
    </Card>
  );
}
