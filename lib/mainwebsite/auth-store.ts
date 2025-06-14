import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

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
          const response = await axiosInstance.post("/api/auth/login", {
            email,
            password,
          });

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
        } catch (error: any) {
          console.log(error.response.data);
          set({
            error: error.response?.data?.message || "Login failed",
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

          const response = await axiosInstance.post("/api/auth/register", {
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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
