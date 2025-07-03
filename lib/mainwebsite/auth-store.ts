import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";
import type { AdminUser } from "./admin-user-store";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: "USER" | "EXPERT"
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User, accessToken: string, refreshToken: string) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.post("/auth/login", {
            email,
            password,
          });

          console.log("Login response:", response.data);

          // Handle different possible response structures
          let user, accessToken, refreshToken;
          
          if (response.data.data) {
            // If response has data wrapper
            ({ user, accessToken, refreshToken } = response.data.data);
          } else if (response.data.user) {
            // If response is direct
            ({ user, accessToken, refreshToken } = response.data);
          } else {
            throw new Error("Invalid response format from server");
          }

          if (!user || !accessToken) {
            throw new Error("Missing user data or token in response");
          }

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
        } catch (error: any) {
          console.error("Login error:", error);
          console.error("Error response:", error.response?.data);
          
          let errorMessage = "Login failed";
          
          if (error.response?.status === 401) {
            errorMessage = "Invalid email or password";
          } else if (error.response?.status === 400) {
            errorMessage = error.response?.data?.message || "Invalid request data";
          } else if (error.message === "No refresh token available") {
            errorMessage = "Authentication session expired. Please try logging in again.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (
        email: string,
        password: string,
        name: string,
        role: "USER" | "EXPERT"
      ) => {
        try {
          set({ isLoading: true, error: null });
          console.log("Sending signup request with:", {
            email,
            password,
            name,
            role,
          });

          const response = await axiosInstance.post("/auth/register", {
            email,
            password,
            name,
            role,
          });

          console.log("Signup response:", response.data);

          if (response.data.status === "success") {
            const { user, accessToken, refreshToken } = response.data.data;

            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
          } else {
            throw new Error(response.data.message || "Signup failed");
          }
        } catch (error: any) {
          console.error("Signup error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });

          let errorMessage = "Signup failed";

          if (error.response?.status === 409) {
            errorMessage = "User already exists with this email";
          } else if (error.response?.status === 500) {
            errorMessage = "Internal server error. Please try again later";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        // Clear user profile from user store
        if (typeof window !== 'undefined') {
          const { useUserStore } = require('./user-store');
          useUserStore.getState().clearProfile();
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      initializeAuth: () => {
        // Check if we have tokens in localStorage
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        // Get the current state to check if we already have user data
        const currentState = useAuthStore.getState();
        
        if (accessToken && refreshToken && currentState.user) {
          // We have tokens and user data, ensure authentication state is correct
          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else if (accessToken && refreshToken) {
          // We have tokens but no user data, set basic auth state
          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // No tokens, ensure we're logged out
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

interface AdminAuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AdminUser, accessToken: string, refreshToken: string) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.post("/auth/admin-login", {
            email,
            password,
          });

          if (response.data.status === "success") {
            const { user, accessToken, refreshToken } = response.data.data;
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
            localStorage.setItem("adminAccessToken", accessToken);
            if (refreshToken) {
              localStorage.setItem("adminRefreshToken", refreshToken);
            }
            // Set isAuthenticated cookie for middleware/layout compatibility
            document.cookie = "isAuthenticated=true; path=/; max-age=86400";
          } else {
            throw new Error(response.data.message || "Login failed");
          }
        } catch (error: any) {
          let errorMessage = "Login failed";
          if (error.response?.status === 401) {
            errorMessage = "Invalid email or password";
          } else if (error.response?.status === 400) {
            errorMessage = error.response?.data?.message || "Invalid request data";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        // Clear isAuthenticated cookie
        document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      },

      clearError: () => set({ error: null }),

      setUser: (user: AdminUser, accessToken: string, refreshToken: string) => {
        localStorage.setItem("adminAccessToken", accessToken);
        localStorage.setItem("adminRefreshToken", refreshToken);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
