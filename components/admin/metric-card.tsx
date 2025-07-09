"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
  variant?: "glass" | "gradient";
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
  variant = "glass"
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    return trend.isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    return trend.isPositive ? "text-green-500" : "text-red-500";
  };

  const glassClass =
    "bg-white/60 dark:bg-background/60 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200";
  const gradientClass =
    "bg-gradient-to-tr from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-200 text-white";
  const accentBar =
    variant === "glass"
      ? "bg-gradient-to-t from-primary/80 to-accent/80 w-1 rounded-l-lg absolute left-0 top-4 bottom-4"
      : "bg-white/20 w-1 rounded-l-lg absolute left-0 top-4 bottom-4";

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
          <div className={cn("text-3xl font-extrabold", variant === "glass" ? "text-primary" : "text-white")}>{formatValue(value)}</div>
          <div className={cn("text-sm font-semibold", variant === "glass" ? "text-muted-foreground" : "text-white/80")}>{title}</div>
        </div>
      </div>
      {description && (
        <div className={cn("px-5 pb-4 text-xs", variant === "glass" ? "text-muted-foreground" : "text-white/80")}>{description}</div>
      )}
      {trend && (
        <div className="flex items-center space-x-1 px-5 pb-4">
          {getTrendIcon()}
          <span className={cn("text-xs font-medium", getTrendColor())}>
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </span>
          <span className={cn("text-xs", variant === "glass" ? "text-muted-foreground" : "text-white/60")}>from last month</span>
        </div>
      )}
    </div>
  );
} 