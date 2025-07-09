import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

export interface AdminNotification {
  id: string;
  type: "FOLLOW" | "LIKE" | "COMMENT" | "MESSAGE" | "MESSAGE_SCHEDULE" | "BADGE_EARNED" | "SUGGESTION" | "OTHER";
  content: string;
  read: boolean;
  recipientId: string;
  senderId: string;
  recipient: {
    id: string;
    name: string;
    avatar?: string;
  };
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotificationPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface AdminNotificationState {
  notifications: AdminNotification[];
  pagination: AdminNotificationPagination | null;
  selectedNotification: AdminNotification | null;
  isLoading: boolean;
  error: string | null;
  
  // CRUD Operations
  fetchNotifications: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    type?: string; 
    read?: boolean;
    sortBy?: string; 
    sortOrder?: string; 
    startDate?: string; 
    endDate?: string;
    recipientId?: string;
    senderId?: string;
  }) => Promise<void>;
  fetchNotificationById: (id: string) => Promise<void>;
  createNotification: (data: Partial<AdminNotification>) => Promise<void>;
  updateNotification: (id: string, data: Partial<AdminNotification>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  
  // Bulk Operations
  bulkDeleteNotifications: (ids: string[]) => Promise<void>;
  bulkMarkAsRead: (ids: string[]) => Promise<void>;
  
  // Utility Actions
  clearError: () => void;
  clearSelectedNotification: () => void;
}

export const useAdminNotificationsStore = create<AdminNotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      pagination: null,
      selectedNotification: null,
      isLoading: false,
      error: null,

      fetchNotifications: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get("/admin/notifications", { params });
          if (response.data && response.data.data) {
            set({
              notifications: response.data.data.notifications || response.data.data,
              pagination: response.data.data.pagination,
              isLoading: false,
            });
          } else {
            throw new Error("Invalid notifications response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch notifications";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchNotificationById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get(`/admin/notifications/${id}`);
          if (response.data && response.data.data && response.data.data.notification) {
            set({ selectedNotification: response.data.data.notification, isLoading: false });
          } else if (response.data && response.data.data) {
            set({ selectedNotification: response.data.data, isLoading: false });
          } else {
            throw new Error("Invalid notification response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch notification";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      createNotification: async (data: Partial<AdminNotification>) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.post("/admin/notifications", data);
          if (response.data && response.data.data && response.data.data.notification) {
            const newNotification = response.data.data.notification;
            set((state) => ({
              notifications: [newNotification, ...state.notifications],
              selectedNotification: newNotification,
              isLoading: false,
            }));
          } else if (response.data && response.data.data) {
            const newNotification = response.data.data;
            set((state) => ({
              notifications: [newNotification, ...state.notifications],
              selectedNotification: newNotification,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid create notification response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to create notification";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      updateNotification: async (id: string, data: Partial<AdminNotification>) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.patch(`/admin/notifications/${id}`, data);
          if (response.data && response.data.data && response.data.data.notification) {
            const updatedNotification = response.data.data.notification;
            set((state) => ({
              notifications: state.notifications.map((n) => (n.id === id ? updatedNotification : n)),
              selectedNotification: updatedNotification,
              isLoading: false,
            }));
          } else if (response.data && response.data.data) {
            const updatedNotification = response.data.data;
            set((state) => ({
              notifications: state.notifications.map((n) => (n.id === id ? updatedNotification : n)),
              selectedNotification: updatedNotification,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid update notification response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to update notification";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteNotification: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await axiosInstance.delete(`/admin/notifications/${id}`);
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
            selectedNotification: state.selectedNotification && state.selectedNotification.id === id ? null : state.selectedNotification,
            isLoading: false,
          }));
        } catch (error: any) {
          let errorMessage = "Failed to delete notification";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      bulkDeleteNotifications: async (ids: string[]) => {
        try {
          set({ isLoading: true, error: null });
          await axiosInstance.delete("/admin/notifications/bulk", { data: { ids } });
          set((state) => ({
            notifications: state.notifications.filter((n) => !ids.includes(n.id)),
            selectedNotification: state.selectedNotification && ids.includes(state.selectedNotification.id) ? null : state.selectedNotification,
            isLoading: false,
          }));
        } catch (error: any) {
          let errorMessage = "Failed to delete notifications";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      bulkMarkAsRead: async (ids: string[]) => {
        try {
          set({ isLoading: true, error: null });
          await axiosInstance.patch("/admin/notifications/bulk/read", { ids });
          set((state) => ({
            notifications: state.notifications.map((n) => 
              ids.includes(n.id) ? { ...n, read: true } : n
            ),
            selectedNotification: state.selectedNotification && ids.includes(state.selectedNotification.id) 
              ? { ...state.selectedNotification, read: true } 
              : state.selectedNotification,
            isLoading: false,
          }));
        } catch (error: any) {
          let errorMessage = "Failed to mark notifications as read";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
      clearSelectedNotification: () => set({ selectedNotification: null }),
    }),
    {
      name: "admin-notifications-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        pagination: state.pagination,
        selectedNotification: state.selectedNotification,
      }),
    }
  )
); 