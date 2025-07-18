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
  Bell,
  Star,
  Folder,
  Layers,
  BadgeCheck,
  PieChart as PieIcon,
  TrendingUp,
  HeartHandshake,
  UserCog,
  User as UserIcon,
  ListChecks,
  DollarSign,
  Smile,
  Sparkles,
  LayoutGrid,
  Activity
} from "lucide-react";
import { useAdminDashboardStore } from "@/lib/mainwebsite/admin-dashboard-store";
import { MetricCard } from "@/components/admin/metric-card";
import { ProgressMetric } from "@/components/admin/progress-metric";
import { PieChart } from "@/components/charts/pie-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Skeleton } from "@/components/ui/skeleton";

// Helper for card color classes
const cardColors = [
  "bg-blue-100 text-blue-900",
  "bg-green-100 text-green-900",
  "bg-yellow-100 text-yellow-900",
  "bg-red-100 text-red-900",
  "bg-purple-100 text-purple-900",
  "bg-pink-100 text-pink-900"
];

function StatCard({ title, value, icon: Icon, details, colorClass, loading }: { title: string; value: string | number | null | undefined; icon: any; details?: string; colorClass: string; loading?: boolean }) {
  return (
    <div className={`flex flex-col justify-between rounded-2xl p-6 w-full h-full ${colorClass}`}> 
      <div className="flex items-center justify-between">
        <div className="text-base font-medium mb-1">{title}</div>
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/60">
          <Icon className="h-7 w-7" />
        </span>
      </div>
      <div className="text-3xl font-extrabold mb-2">
        {loading ? <Skeleton className="h-8 w-20 rounded" /> : value}
      </div>
      {details && <div className="text-sm opacity-80">{details}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const {
    totalStats,
    recentActivity,
    userDistribution,
    badgeDistribution,
    activityTrends,
    engagementMetrics,
    notificationStats,
    reviewStats,
    expertiseDistribution,
    categoryStats,
    expertQualityMetrics,
    monthlyUserExpertCounts, // <-- new
    reportStats,
    isLoading,
    error,
    fetchAnalytics,
  } = useAdminDashboardStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Remove blocking loading/error UI. Show error as a toast or inline if needed.

  return (
    <div className="space-y-10 px-2 md:px-6 py-8">
      <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 mb-6">
        <Sparkles className="h-8 w-8 text-primary animate-bounce" />
        Admin Dashboard
      </h1>
      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={totalStats?.totalUsers ?? null} 
          icon={Users} 
          colorClass={cardColors[1]}
          details={recentActivity?.newUsers !== undefined ? `New (7d): ${recentActivity.newUsers}` : undefined}
          loading={isLoading || totalStats?.totalUsers === undefined}
        />
        <StatCard title="Total Experts" value={totalStats?.totalExperts ?? null} icon={Award} colorClass={cardColors[0]} loading={isLoading || totalStats?.totalExperts === undefined} />
        <StatCard title="Total Posts" value={totalStats?.totalPosts ?? null} icon={FileText} colorClass={cardColors[2]} loading={isLoading || totalStats?.totalPosts === undefined} />
        <StatCard title="Total Categories" value={totalStats?.totalCategories ?? null} icon={Folder} colorClass={cardColors[4]} loading={isLoading || totalStats?.totalCategories === undefined} />
        <StatCard title="Total Subcategories" value={totalStats?.totalSubcategories ?? null} icon={Layers} colorClass={cardColors[5]} loading={isLoading || totalStats?.totalSubcategories === undefined} />
        <StatCard title="Total Reviews" value={totalStats?.totalReviews ?? null} icon={Star} colorClass={cardColors[3]} loading={isLoading || totalStats?.totalReviews === undefined} />
        {/* New: Total Reports Card */}
        <StatCard
          title="Total Reports"
          value={reportStats?.totalReports ?? null}
          icon={ListChecks}
          colorClass={cardColors[3]}
          details={reportStats?.recentReports !== undefined ? `Recent (7d): ${reportStats.recentReports}` : undefined}
          loading={isLoading || reportStats?.totalReports === undefined}
        />
        {/* Notification Card */}
        <StatCard 
          title="Notifications" 
          value={notificationStats ? notificationStats.reduce((sum, stat) => sum + (stat.count || 0), 0) : null}
          icon={Bell}
          colorClass={cardColors[0]}
          details={notificationStats && notificationStats.length > 0 ? notificationStats.map(stat => `${stat.type}: ${stat.count}`).join(", ") : undefined}
          loading={isLoading || !notificationStats}
        />
      </div>

      {/* Monthly User/Expert Counts Trend Section */}
      {monthlyUserExpertCounts && monthlyUserExpertCounts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 mt-8">
            <TrendingUp className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-bold tracking-tight">Monthly User & Expert Registrations</h2>
          </div>
          <div className="w-full mb-10">
            <LineChart
              title="Monthly User & Expert Registrations"
              description="Registrations by month"
              data={monthlyUserExpertCounts}
              xAxisKey="month"
              lines={[
                { key: "USER", name: "Users", color: "#6366f1" },
                { key: "EXPERT", name: "Experts", color: "#10b981" }
              ]}
            />
          </div>
        </div>
      )}

      {/* Distributions Section */}
      <div>
        <div className="flex items-center gap-2 mb-3 mt-8">
          <PieIcon className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-bold tracking-tight">Distributions</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <PieChart
            title="User Role Distribution"
            description="Breakdown by user roles"
            data={userDistribution?.byRole ?? []}
            dataKey="count"
            nameKey="role"
          />
          <PieChart
            title="Badge Distribution"
            description="Expert badges"
            data={badgeDistribution ?? []}
            dataKey="count"
            nameKey="badge"
          />
          <PieChart
            title="Progress Level Distribution"
            description="User progress levels"
            data={userDistribution?.byProgressLevel ?? []}
            dataKey="count"
            nameKey="level"
          />
        </div>
      </div>

      {/* Expertise & Category Stats */}
      <div>
        <div className="flex items-center gap-2 mb-3 mt-8">
          <Users className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-bold tracking-tight">Expertise & Categories</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <BarChart
            title="Expertise Distribution"
            description="Top skills among experts"
            data={expertiseDistribution ?? []}
            xAxisKey="skill"
            yAxisKey="count"
            color="#f59e42"
          />
          <BarChart
            title="Category Stats"
            description="Subcategories per category"
            data={categoryStats ?? []}
            xAxisKey="name"
            yAxisKey="subcategoryCount"
            color="#6366f1"
          />
        </div>
      </div>

      {/* Quality & Engagement Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-3 mt-8">
          <Star className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-bold tracking-tight">Quality & Engagement</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ProgressMetric
            title="Verified Experts"
            value={expertQualityMetrics?.verifiedPercentage ?? 0}
            icon={BadgeCheck}
            description={`Verified: ${expertQualityMetrics?.verifiedExperts ?? 0} / ${expertQualityMetrics?.totalExperts ?? 0}`}
            variant="glass"
          />
          <ProgressMetric
            title="Average Rating"
            value={reviewStats?.averageRating ?? 0}
            maxValue={5}
            icon={Star}
            description="Average review rating (out of 5)"
            showPercentage={false}
            variant="glass"
          />
          <ProgressMetric
            title="Avg. Followers per User"
            value={engagementMetrics?.avgFollowersPerUser ?? 0}
            maxValue={10}
            icon={Users}
            description="Average followers per user"
            showPercentage={false}
            variant="glass"
          />
          <ProgressMetric
            title="Avg. Likes per Post"
            value={engagementMetrics?.avgLikesPerPost ?? 0}
            maxValue={10}
            icon={ThumbsUp}
            description="Average likes per post"
            showPercentage={false}
            variant="glass"
          />
          <ProgressMetric
            title="Avg. Comments per Post"
            value={engagementMetrics?.avgCommentsPerPost ?? 0}
            maxValue={10}
            icon={MessageCircle}
            description="Average comments per post"
            showPercentage={false}
            variant="glass"
          />
        </div>
      </div>

      {/* Review Satisfaction Distribution (optional) */}
      {reviewStats?.satisfactionDistribution && reviewStats.satisfactionDistribution.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 mt-8">
            <PieIcon className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-bold tracking-tight">Review Satisfaction Distribution</h2>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <PieChart
              title="Review Satisfaction Distribution"
              description="Breakdown of review satisfaction"
              data={reviewStats.satisfactionDistribution}
              dataKey="count"
              nameKey="satisfaction"
            />
            {/* Report Stats Pie Chart */}
            {reportStats?.byStatus && reportStats.byStatus.length > 0 && (
              <PieChart
                title="Report Status Distribution"
                description="Breakdown of report statuses"
                data={reportStats.byStatus}
                dataKey="count"
                nameKey="status"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
