"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressMetricProps {
  title: string;
  value: number;
  maxValue?: number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  showPercentage?: boolean;
  variant?: "glass" | "gradient";
}

export function ProgressMetric({
  title,
  value,
  maxValue = 100,
  icon: Icon,
  description,
  className,
  showPercentage = true,
  variant = "glass"
}: ProgressMetricProps) {
  const percentage = (value / maxValue) * 100;
  const glassClass =
    "bg-white/60 dark:bg-background/60 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200";
  const gradientClass =
    "bg-gradient-to-tr from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-200 text-white";
  const accentBar =
    variant === "glass"
      ? "bg-gradient-to-t from-primary/80 to-accent/80 w-1 rounded-l-lg absolute left-0 top-4 bottom-4"
      : "bg-white/20 w-1 rounded-l-lg absolute left-0 top-4 bottom-4";
  // Color progress bar based on value
  let progressColor = "bg-green-500";
  if (percentage < 40) progressColor = "bg-red-500";
  else if (percentage < 70) progressColor = "bg-yellow-400";

  return (
    <div className={cn("relative overflow-hidden rounded-xl group", variant === "glass" ? glassClass : gradientClass, className)}>
      <span className={accentBar} />
      <div className="flex items-center gap-4 px-5 pt-5 pb-2">
        <span className={cn(
          "inline-flex items-center justify-center rounded-full h-12 w-12",
          variant === "glass" ? "bg-primary/10 text-primary" : "bg-white/20 text-white"
        )}>
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <div className={cn("text-3xl font-extrabold", variant === "glass" ? "text-primary" : "text-white")}>{showPercentage ? `${percentage.toFixed(1)}%` : value}</div>
          <div className={cn("text-sm font-semibold", variant === "glass" ? "text-muted-foreground" : "text-white/80")}>{title}</div>
        </div>
      </div>
      <div className="px-5 pb-2">
        <div className="w-full h-3 rounded-full bg-muted/40 overflow-hidden">
          <div className={cn("h-3 rounded-full transition-all duration-300", progressColor)} style={{ width: `${percentage}%` }} />
        </div>
      </div>
      {description && (
        <div className={cn("px-5 pb-4 text-xs", variant === "glass" ? "text-muted-foreground" : "text-white/80")}>{description}</div>
      )}
    </div>
  );
} 