import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "chat" | "booking" | "payment" | "system";
  isRead: boolean;
  isArchived: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    expertId?: string;
    bookingId?: string;
    chatId?: string;
    paymentId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotificationSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    chat: boolean;
    booking: boolean;
    payment: boolean;
    system: boolean;
    marketing: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  settings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: {
    type?: string;
    isRead?: boolean;
    priority?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  
  // Notification Actions
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  fetchNotificationById: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  unarchiveNotification: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  createNotification: (notificationData: Partial<Notification>) => Promise<void>;
  
  // Settings Actions
  fetchNotificationSettings: () => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  createNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  
  // Filter and Search Actions
  filterNotifications: (filters: Partial<NotificationsState['filters']>, page?: number, limit?: number) => Promise<void>;
  searchNotifications: (query: string, page?: number, limit?: number) => Promise<void>;
  
  // Real-time Actions
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  removeNotification: (id: string) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  
  // Utility Actions
  clearNotifications: () => void;
  clearError: () => void;
  setFilters: (filters: Partial<NotificationsState['filters']>) => void;
  resetFilters: () => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      settings: null,
      isLoading: false,
      error: null,
      unreadCount: 0,
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
      filters: {},

      // Notification Actions
      fetchNotifications: async (page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/notifications", {
            params: {
              page,
              limit,
              ...get().filters
            }
          });
          
          if (response.data.success) {
            const { notifications, totalCount, currentPage, totalPages, unreadCount } = response.data.data;
            set({
              notifications,
              totalCount,
              currentPage,
              totalPages,
              unreadCount,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch notifications");
          }
        } catch (error: any) {
          console.error("Error fetching notifications:", error);
          
          let errorMessage = "Failed to fetch notifications";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notifications not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      fetchNotificationById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/notifications/${id}`);
          
          if (response.data.success) {
            const notification = response.data.data;
            const { notifications } = get();
            
            const updatedNotifications = notifications.map(n => 
              n.id === id ? notification : n
            );
            
            set({
              notifications: updatedNotifications,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch notification");
          }
        } catch (error: any) {
          console.error("Error fetching notification:", error);
          
          let errorMessage = "Failed to fetch notification";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notification not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      markAsRead: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/notifications/${id}/read`);
          
          if (response.data.success) {
            const { notifications, unreadCount } = get();
            
            const updatedNotifications = notifications.map(n => 
              n.id === id ? { ...n, isRead: true } : n
            );
            
            set({
              notifications: updatedNotifications,
              unreadCount: Math.max(0, unreadCount - 1),
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to mark notification as read");
          }
        } catch (error: any) {
          console.error("Error marking notification as read:", error);
          
          let errorMessage = "Failed to mark notification as read";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notification not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      markAllAsRead: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put("/notifications/mark-all-read");
          
          if (response.data.success) {
            const { notifications } = get();
            
            const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
            
            set({
              notifications: updatedNotifications,
              unreadCount: 0,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to mark all notifications as read");
          }
        } catch (error: any) {
          console.error("Error marking all notifications as read:", error);
          
          let errorMessage = "Failed to mark all notifications as read";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      markAsUnread: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/notifications/${id}/unread`);
          
          if (response.data.success) {
            const { notifications, unreadCount } = get();
            
            const updatedNotifications = notifications.map(n => 
              n.id === id ? { ...n, isRead: false } : n
            );
            
            set({
              notifications: updatedNotifications,
              unreadCount: unreadCount + 1,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to mark notification as unread");
          }
        } catch (error: any) {
          console.error("Error marking notification as unread:", error);
          
          let errorMessage = "Failed to mark notification as unread";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notification not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      archiveNotification: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/notifications/${id}/archive`);
          
          if (response.data.success) {
            const { notifications } = get();
            
            const updatedNotifications = notifications.map(n => 
              n.id === id ? { ...n, isArchived: true } : n
            );
            
            set({
              notifications: updatedNotifications,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to archive notification");
          }
        } catch (error: any) {
          console.error("Error archiving notification:", error);
          
          let errorMessage = "Failed to archive notification";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notification not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      unarchiveNotification: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/notifications/${id}/unarchive`);
          
          if (response.data.success) {
            const { notifications } = get();
            
            const updatedNotifications = notifications.map(n => 
              n.id === id ? { ...n, isArchived: false } : n
            );
            
            set({
              notifications: updatedNotifications,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to unarchive notification");
          }
        } catch (error: any) {
          console.error("Error unarchiving notification:", error);
          
          let errorMessage = "Failed to unarchive notification";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notification not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteNotification: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/notifications/${id}`);
          
          if (response.data.success) {
            const { notifications, unreadCount } = get();
            
            const deletedNotification = notifications.find(n => n.id === id);
            const updatedNotifications = notifications.filter(n => n.id !== id);
            
            set({
              notifications: updatedNotifications,
              unreadCount: deletedNotification?.isRead ? unreadCount : Math.max(0, unreadCount - 1),
              totalCount: Math.max(0, get().totalCount - 1),
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete notification");
          }
        } catch (error: any) {
          console.error("Error deleting notification:", error);
          
          let errorMessage = "Failed to delete notification";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notification not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteAllNotifications: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete("/notifications");
          
          if (response.data.success) {
            set({
              notifications: [],
              unreadCount: 0,
              totalCount: 0,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete all notifications");
          }
        } catch (error: any) {
          console.error("Error deleting all notifications:", error);
          
          let errorMessage = "Failed to delete all notifications";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      createNotification: async (notificationData: Partial<Notification>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/notifications", notificationData);
          
          if (response.data.success) {
            const newNotification = response.data.data;
            const { notifications, totalCount, unreadCount } = get();
            
            set({
              notifications: [newNotification, ...notifications],
              totalCount: totalCount + 1,
              unreadCount: newNotification.isRead ? unreadCount : unreadCount + 1,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to create notification");
          }
        } catch (error: any) {
          console.error("Error creating notification:", error);
          
          let errorMessage = "Failed to create notification";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid notification data";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Settings Actions
      fetchNotificationSettings: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/notifications/settings");
          
          if (response.data.success) {
            const settings = response.data.data;
            set({
              settings,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch notification settings");
          }
        } catch (error: any) {
          console.error("Error fetching notification settings:", error);
          
          let errorMessage = "Failed to fetch notification settings";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Notification settings not found";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updateNotificationSettings: async (settings: Partial<NotificationSettings>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put("/notifications/settings", settings);
          
          if (response.data.success) {
            const updatedSettings = response.data.data;
            set({
              settings: updatedSettings,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update notification settings");
          }
        } catch (error: any) {
          console.error("Error updating notification settings:", error);
          
          let errorMessage = "Failed to update notification settings";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid settings data";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      createNotificationSettings: async (settings: Partial<NotificationSettings>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/notifications/settings", settings);
          
          if (response.data.success) {
            const newSettings = response.data.data;
            set({
              settings: newSettings,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to create notification settings");
          }
        } catch (error: any) {
          console.error("Error creating notification settings:", error);
          
          let errorMessage = "Failed to create notification settings";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid settings data";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Filter and Search Actions
      filterNotifications: async (filters: Partial<NotificationsState['filters']>, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const newFilters = { ...get().filters, ...filters };
          set({ filters: newFilters });
          
          const response = await axiosInstance.get("/notifications/filter", {
            params: {
              page,
              limit,
              ...newFilters
            }
          });
          
          if (response.data.success) {
            const { notifications, totalCount, currentPage, totalPages, unreadCount } = response.data.data;
            set({
              notifications,
              totalCount,
              currentPage,
              totalPages,
              unreadCount,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to filter notifications");
          }
        } catch (error: any) {
          console.error("Error filtering notifications:", error);
          
          let errorMessage = "Failed to filter notifications";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      searchNotifications: async (query: string, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/notifications/search", {
            params: {
              q: query,
              page,
              limit,
              ...get().filters
            }
          });
          
          if (response.data.success) {
            const { notifications, totalCount, currentPage, totalPages, unreadCount } = response.data.data;
            set({
              notifications,
              totalCount,
              currentPage,
              totalPages,
              unreadCount,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to search notifications");
          }
        } catch (error: any) {
          console.error("Error searching notifications:", error);
          
          let errorMessage = "Failed to search notifications";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.data?.error) {
            errorMessage = typeof error.response.data.error === "string"
              ? error.response.data.error
              : error.response.data.error.message || JSON.stringify(error.response.data.error);
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Real-time Actions
      addNotification: (notification: Notification) => {
        const { notifications, totalCount, unreadCount } = get();
        set({
          notifications: [notification, ...notifications],
          totalCount: totalCount + 1,
          unreadCount: notification.isRead ? unreadCount : unreadCount + 1,
        });
      },

      updateNotification: (id: string, updates: Partial<Notification>) => {
        const { notifications, unreadCount } = get();
        const updatedNotifications = notifications.map(n => 
          n.id === id ? { ...n, ...updates } : n
        );
        
        const updatedNotification = updatedNotifications.find(n => n.id === id);
        const oldNotification = notifications.find(n => n.id === id);
        
        let newUnreadCount = unreadCount;
        if (oldNotification && updatedNotification) {
          if (!oldNotification.isRead && updatedNotification.isRead) {
            newUnreadCount = Math.max(0, unreadCount - 1);
          } else if (oldNotification.isRead && !updatedNotification.isRead) {
            newUnreadCount = unreadCount + 1;
          }
        }
        
        set({
          notifications: updatedNotifications,
          unreadCount: newUnreadCount,
        });
      },

      removeNotification: (id: string) => {
        const { notifications, totalCount, unreadCount } = get();
        const deletedNotification = notifications.find(n => n.id === id);
        const updatedNotifications = notifications.filter(n => n.id !== id);
        
        set({
          notifications: updatedNotifications,
          totalCount: Math.max(0, totalCount - 1),
          unreadCount: deletedNotification?.isRead ? unreadCount : Math.max(0, unreadCount - 1),
        });
      },

      incrementUnreadCount: () => {
        const { unreadCount } = get();
        set({ unreadCount: unreadCount + 1 });
      },

      decrementUnreadCount: () => {
        const { unreadCount } = get();
        set({ unreadCount: Math.max(0, unreadCount - 1) });
      },

      // Utility Actions
      clearNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setFilters: (filters: Partial<NotificationsState['filters']>) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      resetFilters: () => {
        set({ filters: {} });
      },

      setUnreadCount: (count: number) => {
        set({ unreadCount: Math.max(0, count) });
      },
    }),
    {
      name: "notifications-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings,
        unreadCount: state.unreadCount,
        filters: state.filters,
      }),
    }
  )
); 