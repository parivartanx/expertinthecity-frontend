import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Follower {
  id: string;
  name: string;
  avatar: string | null;
  followedAt: string;
}

interface Following {
  id: string;
  name: string;
  avatar: string | null;
  followedAt: string;
}

interface FollowStatus {
  isFollowing: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FollowState {
  followers: Follower[];
  following: Following[];
  followStatuses: Record<string, boolean>; // userId -> isFollowing
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  
  // Follow/Unfollow Actions
  followExpert: (userId: string) => Promise<void>;
  unfollowExpert: (userId: string) => Promise<void>;
  checkFollowStatus: (userId: string) => Promise<void>;
  
  // Get Lists Actions
  getFollowers: (page?: number, limit?: number) => Promise<void>;
  getFollowing: (page?: number, limit?: number) => Promise<void>;
  
  // Utility Actions
  clearFollowers: () => void;
  clearFollowing: () => void;
  clearError: () => void;
  setFollowStatus: (expertId: string, isFollowing: boolean) => void;
  clearFollowStatuses: () => void;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      followers: [],
      following: [],
      followStatuses: {},
      isLoading: false,
      error: null,
      isLoaded: false,

      // Follow/Unfollow Actions
      followExpert: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post(`/follows/${userId}`);
          
          if (response.data.status === 'success') {
            const { followStatuses } = get();
            
            set({
              followStatuses: {
                ...followStatuses,
                [userId]: true
              },
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to follow expert");
          }
        } catch (error: any) {
          console.error("Error following expert:", error);
          
          let errorMessage = "Failed to follow expert";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            if (error.response.data.message === 'Cannot follow yourself') {
              errorMessage = "Cannot follow yourself";
            } else if (error.response.data.message === 'Already following this expert') {
              errorMessage = "Already following this expert";
            } else {
              errorMessage = error.response.data.message || "Invalid request";
            }
          } else if (error.response?.status === 404) {
            errorMessage = "Expert not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      unfollowExpert: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/follows/${userId}`);
          
          if (response.data.status === 'success') {
            const { followStatuses } = get();
            
            set({
              followStatuses: {
                ...followStatuses,
                [userId]: false
              },
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to unfollow expert");
          }
        } catch (error: any) {
          console.error("Error unfollowing expert:", error);
          
          let errorMessage = "Failed to unfollow expert";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Follow relationship not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      checkFollowStatus: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/follows/status/${userId}`);
          
          if (response.data.status === 'success') {
            const { followStatuses } = get();
            const isFollowing = response.data.data.isFollowing;
            
            set({
              followStatuses: {
                ...followStatuses,
                [userId]: isFollowing
              },
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to check follow status");
          }
        } catch (error: any) {
          console.error("Error checking follow status:", error);
          
          let errorMessage = "Failed to check follow status";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Expert not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Get Lists Actions
      getFollowers: async (page = 1, limit = 10) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/follows/followers", {
            params: { page, limit }
          });
          
          if (response.data.status === 'success') {
            const followers = response.data.data.followers || [];
            set({
              followers,
              isLoading: false,
              isLoaded: true,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch followers");
          }
        } catch (error: any) {
          console.error("Error fetching followers:", error);
          
          let errorMessage = "Failed to fetch followers";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Followers not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            isLoaded: false,
          });
        }
      },

      getFollowing: async (page = 1, limit = 10) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/follows/following", {
            params: { page, limit }
          });
          
          if (response.data.status === 'success') {
            const following = response.data.data.following || [];
            set({
              following,
              isLoading: false,
              isLoaded: true,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch following");
          }
        } catch (error: any) {
          console.error("Error fetching following:", error);
          
          let errorMessage = "Failed to fetch following";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Following list not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            isLoaded: false,
          });
        }
      },

      // Utility Actions
      clearFollowers: () => {
        set({
          followers: [],
          isLoading: false,
          error: null,
          isLoaded: false,
        });
      },

      clearFollowing: () => {
        set({
          following: [],
          isLoading: false,
          error: null,
          isLoaded: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setFollowStatus: (userId: string, isFollowing: boolean) => {
        const { followStatuses } = get();
        set({
          followStatuses: {
            ...followStatuses,
            [userId]: isFollowing
          }
        });
      },

      clearFollowStatuses: () => {
        set({ followStatuses: {} });
      },
    }),
    {
      name: "follow-storage",
      partialize: (state) => ({
        followStatuses: state.followStatuses,
        isLoaded: state.isLoaded,
      }),
    }
  )
); 