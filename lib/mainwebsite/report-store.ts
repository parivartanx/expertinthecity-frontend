import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

// Types
export type ReportTargetType = "POST" | "USER";
export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";
export type ReportPriority = "low" | "medium" | "high";

export interface Report {
  id: string;
  targetType: ReportTargetType | string;
  targetId: string;
  reportedBy?: string;
  reporter?: { id: string; name: string; avatar?: string };
  reportedUser?: { id: string; name: string; avatar?: string };
  post?: any;
  reason: string;
  description?: string;
  status: ReportStatus | string;
  createdAt: string;
  updatedAt?: string;
  priority?: ReportPriority | string;
  resolvedAt?: string;
  resolution?: string;
  [key: string]: any;
}

export interface ReportPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ReportsByUser {
  reportsMade: Report[];
  reportsReceived: Report[];
}

interface ReportStoreState {
  reports: Report[];
  userReports: ReportsByUser | null;
  adminReports: Report[];
  selectedReport: Report | null;
  pagination: ReportPagination | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // User actions
  reportPost: (postId: string, reason: string) => Promise<void>;
  reportUser: (userId: string, reason: string) => Promise<void>;
  getReportsByUser: (userId: string) => Promise<void>;

  // Admin actions
  adminGetAllReports: (params?: { status?: string; targetType?: string; search?: string; page?: number; limit?: number }) => Promise<void>;
  adminGetReportById: (id: string) => Promise<void>;
  adminUpdateReport: (id: string, data: { status?: string; reason?: string }) => Promise<void>;
  adminDeleteReport: (id: string) => Promise<void>;

  clearError: () => void;
  clearSuccess: () => void;
  clearSelectedReport: () => void;
}

export const useReportStore = create<ReportStoreState>()(
  persist(
    (set, get) => ({
      reports: [],
      userReports: null,
      adminReports: [],
      selectedReport: null,
      pagination: null,
      isLoading: false,
      error: null,
      success: null,

      // User: Report a post
      reportPost: async (postId, reason) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const res = await axiosInstance.post(`/posts/${postId}/report`, { reason });
          if (res.data.status === "success") {
            set({ success: "Post reported successfully.", isLoading: false });
          } else {
            throw new Error(res.data.message || "Failed to report post");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to report post",
            isLoading: false,
          });
        }
      },

      // User: Report a user
      reportUser: async (userId, reason) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const res = await axiosInstance.post(`/users/${userId}/report`, { reason });
          if (res.data.status === "success") {
            set({ success: "User reported successfully.", isLoading: false });
          } else {
            throw new Error(res.data.message || "Failed to report user");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to report user",
            isLoading: false,
          });
        }
      },

      // User: Get all reports made by or against a user
      getReportsByUser: async (userId) => {
        try {
          set({ isLoading: true, error: null });
          const res = await axiosInstance.get(`/reports/user/${userId}`);
          if (res.data.status === "success") {
            set({ userReports: res.data.data, isLoading: false });
          } else {
            throw new Error(res.data.message || "Failed to fetch user reports");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to fetch user reports",
            isLoading: false,
          });
        }
      },

      // Admin: Get all reports (with filters/pagination)
      adminGetAllReports: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          const res = await axiosInstance.get(`/reports/admin`, { params });
          if (res.data.status === "success") {
            set({
              adminReports: res.data.data.reports,
              pagination: {
                total: res.data.data.total,
                page: res.data.data.page,
                limit: res.data.data.limit,
                pages: res.data.data.pages,
              },
              isLoading: false,
            });
          } else {
            throw new Error(res.data.message || "Failed to fetch reports");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to fetch reports",
            isLoading: false,
          });
        }
      },

      // Admin: Get a single report by ID
      adminGetReportById: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const res = await axiosInstance.get(`/reports/admin/${id}`);
          if (res.data.status === "success") {
            set({ selectedReport: res.data.data.report, isLoading: false });
          } else {
            throw new Error(res.data.message || "Failed to fetch report");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to fetch report",
            isLoading: false,
          });
        }
      },

      // Admin: Update a report (status or details)
      adminUpdateReport: async (id, data) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const res = await axiosInstance.patch(`/reports/admin/${id}`, data);
          if (res.data.status === "success") {
            set({ success: "Report updated successfully.", isLoading: false });
            // Optionally refresh selected report
            await get().adminGetReportById(id);
          } else {
            throw new Error(res.data.message || "Failed to update report");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to update report",
            isLoading: false,
          });
        }
      },

      // Admin: Delete a report
      adminDeleteReport: async (id) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const res = await axiosInstance.delete(`/reports/admin/${id}`);
          if (res.data.status === "success") {
            set({ success: "Report deleted successfully.", isLoading: false });
            // Optionally refresh reports
            await get().adminGetAllReports();
          } else {
            throw new Error(res.data.message || "Failed to delete report");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to delete report",
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
      clearSuccess: () => set({ success: null }),
      clearSelectedReport: () => set({ selectedReport: null }),
    }),
    {
      name: "report-storage",
      partialize: (state) => ({
        reports: state.reports,
        userReports: state.userReports,
        adminReports: state.adminReports,
        pagination: state.pagination,
      }),
    }
  )
); 