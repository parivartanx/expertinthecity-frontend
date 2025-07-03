import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: string;
  isAdmin: boolean;
  expertDetails?: any;
  stats?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface AdminUserState {
  users: AdminUser[];
  pagination: AdminUserPagination | null;
  selectedUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params?: { page?: number; limit?: number; search?: string; role?: string; sortBy?: string; sortOrder?: string; startDate?: string; endDate?: string }) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<AdminUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminUserStore = create<AdminUserState>()(
  persist(
    (set, get) => ({
      users: [],
      pagination: null,
      selectedUser: null,
      isLoading: false,
      error: null,

      fetchUsers: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get("/admin/users", { params });
          if (response.data && response.data.data) {
            set({
              users: response.data.data.users,
              pagination: response.data.data.pagination,
              isLoading: false,
            });
          } else {
            throw new Error("Invalid users response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch users";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchUserById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get(`/admin/users/${id}`);
          if (response.data && response.data.data && response.data.data.user) {
            set({ selectedUser: response.data.data.user, isLoading: false });
          } else {
            throw new Error("Invalid user response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch user";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      updateUser: async (id: string, data: Partial<AdminUser>) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.patch(`/admin/users/${id}`, data);
          if (response.data && response.data.data && response.data.data.user) {
            // Update user in users list if present
            const updatedUser = response.data.data.user;
            set((state) => ({
              users: state.users.map((u) => (u.id === id ? updatedUser : u)),
              selectedUser: updatedUser,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid update user response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to update user";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteUser: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await axiosInstance.delete(`/admin/users/${id}`);
          set((state) => ({
            users: state.users.filter((u) => u.id !== id),
            selectedUser: state.selectedUser && state.selectedUser.id === id ? null : state.selectedUser,
            isLoading: false,
          }));
        } catch (error: any) {
          let errorMessage = "Failed to delete user";
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
      name: "admin-user-storage",
      partialize: (state) => ({
        users: state.users,
        pagination: state.pagination,
        selectedUser: state.selectedUser,
      }),
    }
  )
); 