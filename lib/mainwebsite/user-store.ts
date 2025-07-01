import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

interface Follower {
  id: string;
  follower: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

interface Following {
  id: string;
  following: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  grade?: string;
  activities?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpertDetails {
  id: string;
  headline?: string;
  summary?: string;
  expertise?: string[];
  experience?: string;
  hourlyRate?: number;
  about?: string;
  availability?: string;
  languages?: string[];
  verified?: boolean;
  badges?: string[];
  progressLevel?: string;
  progressShow?: boolean;
  ratings?: number;
  createdAt: string;
  updatedAt: string;
  certifications?: Certification[];
  experiences?: Experience[];
  awards?: Award[];
  education?: Education[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  isVerified: boolean;
  isActive: boolean;
  role: "user" | "expert" | "admin";
  createdAt: string;
  updatedAt: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
    timezone: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface UserProfile {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  bio?: string;
  interests?: string[];
  tags?: string[];
  headline?: string;
  summary?: string;
  experience?: number;
  education?: string[];
  certifications?: string[];
  skills?: string[];
  languages?: string[];
  hourlyRate?: number;
  availability?: string;
  portfolio?: string[];
  testimonials?: Array<{
    id: string;
    text: string;
    author: string;
    rating: number;
    date: string;
  }>;
  address?: {
    pincode?: string;
    address?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  allUsers: User[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  
  // User Actions
  fetchCurrentUser: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  deleteUser: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
  updateSocialLinks: (socialLinks: Partial<User['socialLinks']>) => Promise<void>;
  
  // Profile Actions
  fetchUserProfile: (userId?: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  createProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  deleteProfile: () => Promise<void>;
  
  // Authentication Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  
  // Utility Actions
  clearUser: () => void;
  clearProfile: () => void;
  clearAllUsers: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      allUsers: [],
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isLoaded: false,

      // User Actions
      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/users/profile");
          
          if (response.data.success) {
            const user = response.data.data;
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              isLoaded: true,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch user");
          }
        } catch (error: any) {
          console.error("Error fetching user:", error);
          
          let errorMessage = "Failed to fetch user";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
            set({ isAuthenticated: false });
          } else if (error.response?.status === 404) {
            errorMessage = "User not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            isLoaded: true,
          });
        }
      },

      fetchAllUsers: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/users");
          
          if (response.data.success) {
            const users = response.data.data;
            set({
              allUsers: users,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch users");
          }
        } catch (error: any) {
          console.error("Error fetching users:", error);
          
          let errorMessage = "Failed to fetch users";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      getUserById: async (id: string): Promise<User | null> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/users/${id}`);
          
          if (response.data.success) {
            const user = response.data.data;
            set({ isLoading: false });
            return user;
          } else {
            throw new Error(response.data.error || "Failed to fetch user");
          }
        } catch (error: any) {
          console.error("Error fetching user by ID:", error);
          
          let errorMessage = "Failed to fetch user";
          
          if (error.response?.status === 404) {
            errorMessage = "User not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          return null;
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.patch("/users/profile", userData);
          
          if (response.data.success) {
            const updatedUser = response.data.data;
            set({
              user: updatedUser,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update user");
          }
        } catch (error: any) {
          console.error("Error updating user:", error);
          
          let errorMessage = "Failed to update user";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid user data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteUser: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete("/users/me");
          
          if (response.data.success) {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete user");
          }
        } catch (error: any) {
          console.error("Error deleting user:", error);
          
          let errorMessage = "Failed to delete user";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put("/users/change-password", {
            currentPassword,
            newPassword,
          });
          
          if (response.data.success) {
            set({ isLoading: false });
          } else {
            throw new Error(response.data.error || "Failed to change password");
          }
        } catch (error: any) {
          console.error("Error changing password:", error);
          
          let errorMessage = "Failed to change password";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid password";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updatePreferences: async (preferences: Partial<User['preferences']>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put("/users/preferences", preferences);
          
          if (response.data.success) {
            const updatedUser = response.data.data;
            set({
              user: updatedUser,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update preferences");
          }
        } catch (error: any) {
          console.error("Error updating preferences:", error);
          
          let errorMessage = "Failed to update preferences";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid preferences data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updateSocialLinks: async (socialLinks: Partial<User['socialLinks']>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put("/users/social-links", socialLinks);
          
          if (response.data.success) {
            const updatedUser = response.data.data;
            set({
              user: updatedUser,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update social links");
          }
        } catch (error: any) {
          console.error("Error updating social links:", error);
          
          let errorMessage = "Failed to update social links";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid social links data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Profile Actions
      fetchUserProfile: async (userId?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const targetUserId = userId || get().user?.id;
          if (!targetUserId) {
            throw new Error("No user ID provided");
          }
          
          const response = await axiosInstance.get(`/users/${targetUserId}/profile`);
          
          if (response.data.success) {
            const profile = response.data.data;
            set({
              profile,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch profile");
          }
        } catch (error: any) {
          console.error("Error fetching profile:", error);
          
          let errorMessage = "Failed to fetch profile";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Profile not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updateProfile: async (profileData: Partial<UserProfile>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put("/users/profile", profileData);
          
          if (response.data.success) {
            const updatedProfile = response.data.data;
            set({
              profile: updatedProfile,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update profile");
          }
        } catch (error: any) {
          console.error("Error updating profile:", error);
          
          let errorMessage = "Failed to update profile";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid profile data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      createProfile: async (profileData: Partial<UserProfile>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/users/profile", profileData);
          
          if (response.data.success) {
            const newProfile = response.data.data;
            set({
              profile: newProfile,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to create profile");
          }
        } catch (error: any) {
          console.error("Error creating profile:", error);
          
          let errorMessage = "Failed to create profile";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid profile data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete("/users/profile");
          
          if (response.data.success) {
            set({
              profile: null,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete profile");
          }
        } catch (error: any) {
          console.error("Error deleting profile:", error);
          
          let errorMessage = "Failed to delete profile";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Authentication Actions
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/auth/login", {
            email,
            password,
          });
          
          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Set the token in axios headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Login failed");
          }
        } catch (error: any) {
          console.error("Error logging in:", error);
          
          let errorMessage = "Login failed";
          
          if (error.response?.status === 401) {
            errorMessage = "Invalid email or password";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid login data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      register: async (userData: { name: string; email: string; password: string }) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/auth/register", userData);
          
          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Set the token in axios headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Registration failed");
          }
        } catch (error: any) {
          console.error("Error registering:", error);
          
          let errorMessage = "Registration failed";
          
          if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid registration data";
          } else if (error.response?.status === 409) {
            errorMessage = "Email already exists";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          
          await axiosInstance.post("/auth/logout");
          
          // Clear the token from axios headers
          delete axiosInstance.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: any) {
          console.error("Error logging out:", error);
          
          // Even if logout fails, clear local state
          delete axiosInstance.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/auth/forgot-password", { email });
          
          if (response.data.success) {
            set({ isLoading: false });
          } else {
            throw new Error(response.data.error || "Failed to send reset email");
          }
        } catch (error: any) {
          console.error("Error sending forgot password email:", error);
          
          let errorMessage = "Failed to send reset email";
          
          if (error.response?.status === 404) {
            errorMessage = "Email not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/auth/reset-password", {
            token,
            newPassword,
          });
          
          if (response.data.success) {
            set({ isLoading: false });
          } else {
            throw new Error(response.data.error || "Failed to reset password");
          }
        } catch (error: any) {
          console.error("Error resetting password:", error);
          
          let errorMessage = "Failed to reset password";
          
          if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid reset data";
          } else if (error.response?.status === 401) {
            errorMessage = "Invalid or expired reset token";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      verifyEmail: async (token: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/auth/verify-email", { token });
          
          if (response.data.success) {
            const updatedUser = response.data.data;
            set({
              user: updatedUser,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to verify email");
          }
        } catch (error: any) {
          console.error("Error verifying email:", error);
          
          let errorMessage = "Failed to verify email";
          
          if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid verification data";
          } else if (error.response?.status === 401) {
            errorMessage = "Invalid or expired verification token";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Utility Actions
      clearUser: () => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isLoaded: false,
        });
      },

      clearProfile: () => {
        set({
          profile: null,
          isLoading: false,
          error: null,
        });
      },

      clearAllUsers: () => {
        set({ allUsers: [] });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setProfile: (profile: UserProfile | null) => {
        set({ profile });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        isLoaded: state.isLoaded,
      }),
    }
  )
); 