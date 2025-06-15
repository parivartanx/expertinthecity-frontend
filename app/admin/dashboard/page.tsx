"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Award,
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analyticsData } from "@/lib/mock-data";

export default function DashboardPage() {
  const [combinedUserData, setCombinedUserData] = useState<any[]>([]);

  useEffect(() => {
    // Combine user and expert growth data for the line chart
    const combined = analyticsData.userGrowth.map((item, index) => {
      return {
        month: item.month,
        users: item.count,
        experts: analyticsData.expertGrowth[index]?.count || 0,
      };
    });
    setCombinedUserData(combined);
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analyticsData.userGrowth[analyticsData.userGrowth.length - 1].count}
          icon={Users}
          trend={{
            value: 8.2,
            isPositive: true,
          }}
        />
        <StatCard
          title="Total Experts"
          value={analyticsData.expertGrowth[analyticsData.expertGrowth.length - 1].count}
          icon={Award}
          trend={{
            value: 12.5,
            isPositive: true,
          }}
        />
        <StatCard
          title="Content Created"
          value={analyticsData.contentActivity.totalPosts}
          icon={FileText}
          description={`${analyticsData.contentActivity.postsLastMonth} new this month`}
        />
        <StatCard
          title="Open Reports"
          value={analyticsData.reportStatistics.openReports}
          icon={AlertTriangle}
          description={`Avg. resolution: ${analyticsData.reportStatistics.averageResolutionTime}`}
        />
      </div>

      {/* Growth Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <LineChart
          title="Platform Growth"
          description="User and expert growth over time"
          data={combinedUserData}
          xAxisKey="month"
          lines={[
            { key: "users", name: "Users", color: "hsl(var(--chart-1))" },
            { key: "experts", name: "Experts", color: "hsl(var(--chart-2))" },
          ]}
        />
        <BarChart
          title="New Posts by Month"
          description="Content creation activity"
          data={[
            { month: "Jul", count: 210 },
            { month: "Aug", count: 280 },
            { month: "Sep", count: 250 },
            { month: "Oct", count: 290 },
            { month: "Nov", count: 320 },
          ]}
          xAxisKey="month"
          yAxisKey="count"
          color="hsl(var(--chart-3))"
          showLabels={true}
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span>Engagement Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Active Users</span>
                <span className="text-sm font-medium">{analyticsData.engagementMetrics.averageDailyActiveUsers}</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Avg. Session Duration</span>
                <span className="text-sm font-medium">{analyticsData.engagementMetrics.averageSessionDuration}</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Actions Per Session</span>
                <span className="text-sm font-medium">{analyticsData.engagementMetrics.averageActionsPerSession}</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Chat Completion Rate</span>
                <span className="text-sm font-medium">{analyticsData.engagementMetrics.chatCompletionRate}%</span>
              </div>
              <Progress value={87.5} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Top Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.experts} experts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(category.users / analyticsData.topCategories[0].users) * 100} 
                      className="h-2" 
                    />
                    <span className="text-xs whitespace-nowrap">{category.users} users</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
