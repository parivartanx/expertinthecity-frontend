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
}

export interface RecentActivity {
  newUsers: number;
  newPosts: number;
  newComments: number;
  newFollows: number;
}

interface AdminDashboardState {
  totalStats: TotalStats | null;
  recentActivity: RecentActivity | null;
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
      isLoading: false,
      error: null,

      fetchAnalytics: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get("/admin/dashboard-stats");
          if (response.data && response.data.data) {
            const { totalStats, recentActivity } = response.data.data;
            set({ totalStats, recentActivity, isLoading: false });
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
      }),
    }
  )
); 