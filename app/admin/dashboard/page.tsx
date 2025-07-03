"use client";

import { useEffect } from "react";
import {
  Users,
  Award,
  FileText,
  MessageCircle,
  ThumbsUp,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { useAdminDashboardStore } from "@/lib/mainwebsite/admin-dashboard-store";

export default function DashboardPage() {
  const { totalStats, recentActivity, isLoading, error, fetchAnalytics } = useAdminDashboardStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={totalStats?.totalUsers ?? 0}
          icon={Users}
        />
        <StatCard
          title="Total Experts"
          value={totalStats?.totalExperts ?? 0}
          icon={Award}
        />
        <StatCard
          title="Total Posts"
          value={totalStats?.totalPosts ?? 0}
          icon={FileText}
        />
        <StatCard
          title="Total Comments"
          value={totalStats?.totalComments ?? 0}
          icon={MessageCircle}
        />
        <StatCard
          title="Total Likes"
          value={totalStats?.totalLikes ?? 0}
          icon={ThumbsUp}
        />
        <StatCard
          title="Total Follows"
          value={totalStats?.totalFollows ?? 0}
          icon={Users}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mt-8">
        <StatCard
          title="New Users (7d)"
          value={recentActivity?.newUsers ?? 0}
          icon={UserPlus}
        />
        <StatCard
          title="New Posts (7d)"
          value={recentActivity?.newPosts ?? 0}
          icon={FileText}
        />
        <StatCard
          title="New Comments (7d)"
          value={recentActivity?.newComments ?? 0}
          icon={MessageCircle}
        />
        <StatCard
          title="New Follows (7d)"
          value={recentActivity?.newFollows ?? 0}
          icon={UserCheck}
        />
      </div>
    </div>
  );
}
