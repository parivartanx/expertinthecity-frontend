import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

export interface TotalStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalExperts: number;
  totalLikes: number;
  totalFollows: number;
  totalReviews: number;
  totalNotifications: number;
  totalCategories: number;
  totalSubcategories: number;
}

export interface RecentActivity {
  newUsers: number;
  newPosts: number;
  newComments: number;
  newFollows: number;
  newReviews: number;
}

export interface UserDistribution {
  byRole: Array<{
    role: string;
    count: number;
  }>;
  byProgressLevel: Array<{
    level: string;
    count: number;
  }>;
}

export interface BadgeDistribution {
  badge: string;
  count: number;
}

export interface ActivityTrend {
  date: string;
  count: number;
}

export interface ActivityTrends {
  userRegistrations: ActivityTrend[];
  posts: ActivityTrend[];
  comments: ActivityTrend[];
  follows: ActivityTrend[];
}

export interface EngagementMetrics {
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  avgFollowersPerUser: number;
}

export interface NotificationStats {
  type: string;
  count: number;
}

export interface ReviewStats {
  averageRating: number;
  satisfactionDistribution: any[];
}

export interface ExpertiseDistribution {
  skill: string;
  count: number;
}

export interface CategoryStats {
  name: string;
  subcategoryCount: number;
}

export interface ExpertQualityMetrics {
  verifiedExperts: number;
  verifiedPercentage: number;
  averageHourlyRate: number;
  minHourlyRate: number;
  maxHourlyRate: number;
  totalExperts: number;
}

export interface MonthlyUserExpertCount {
  month: string;
  USER: number;
  EXPERT: number;
}

export interface ReportStats {
  totalReports: number;
  byStatus: Array<{ status: string; count: number }>;
  byTargetType: Array<{ type: string; count: number }>;
  monthlyCounts: Array<{ month: string; count: number }>;
  recentReports: number;
}

interface AdminDashboardState {
  totalStats: TotalStats | null;
  recentActivity: RecentActivity | null;
  userDistribution: UserDistribution | null;
  badgeDistribution: BadgeDistribution[] | null;
  activityTrends: ActivityTrends | null;
  topExperts: any[] | null;
  engagementMetrics: EngagementMetrics | null;
  notificationStats: NotificationStats[] | null;
  reviewStats: ReviewStats | null;
  expertiseDistribution: ExpertiseDistribution[] | null;
  categoryStats: CategoryStats[] | null;
  expertQualityMetrics: ExpertQualityMetrics | null;
  monthlyUserExpertCounts: MonthlyUserExpertCount[] | null;
  reportStats: ReportStats | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
  clearError: () => void;
}

export const useAdminDashboardStore = create<AdminDashboardState>()(
  persist(
    (set) => ({
      totalStats: null,
      recentActivity: null,
      userDistribution: null,
      badgeDistribution: null,
      activityTrends: null,
      topExperts: null,
      engagementMetrics: null,
      notificationStats: null,
      reviewStats: null,
      expertiseDistribution: null,
      categoryStats: null,
      expertQualityMetrics: null,
      monthlyUserExpertCounts: null,
      reportStats: null,
      isLoading: false,
      error: null,

      fetchAnalytics: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get("/admin/dashboard-stats");
          if (response.data && response.data.data) {
            const {
              totalStats,
              recentActivity,
              userDistribution,
              badgeDistribution,
              activityTrends,
              topExperts,
              engagementMetrics,
              notificationStats,
              reviewStats,
              expertiseDistribution,
              categoryStats,
              expertQualityMetrics,
              monthlyUserExpertCounts,
              reportStats
            } = response.data.data;
            set({
              totalStats,
              recentActivity,
              userDistribution,
              badgeDistribution,
              activityTrends,
              topExperts,
              engagementMetrics,
              notificationStats,
              reviewStats,
              expertiseDistribution,
              categoryStats,
              expertQualityMetrics,
              monthlyUserExpertCounts,
              reportStats,
              isLoading: false
            });
          } else {
            throw new Error("Invalid dashboard stats response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch dashboard stats";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-dashboard-storage",
      partialize: (state) => ({
        totalStats: state.totalStats,
        recentActivity: state.recentActivity,
        userDistribution: state.userDistribution,
        badgeDistribution: state.badgeDistribution,
        activityTrends: state.activityTrends,
        topExperts: state.topExperts,
        engagementMetrics: state.engagementMetrics,
        notificationStats: state.notificationStats,
        reviewStats: state.reviewStats,
        expertiseDistribution: state.expertiseDistribution,
        categoryStats: state.categoryStats,
        expertQualityMetrics: state.expertQualityMetrics,
        monthlyUserExpertCounts: state.monthlyUserExpertCounts,
        reportStats: state.reportStats,
      }),
    }
  )
); 