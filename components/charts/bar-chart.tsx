"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartProps {
  title: string;
  description?: string;
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  color?: string;
  showLabels?: boolean;
  className?: string;
}

export function BarChart({
  title,
  description,
  data,
  xAxisKey,
  yAxisKey,
  color = "hsl(var(--chart-1))",
  showLabels = false,
  className
}: BarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Bar 
              dataKey={yAxisKey} 
              fill={color} 
              radius={[4, 4, 0, 0]}
              barSize={40}
            >
              {showLabels && (
                <LabelList 
                  dataKey={yAxisKey} 
                  position="top" 
                  style={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
              )}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}