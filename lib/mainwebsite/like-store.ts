import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Like {
  id: string;
  postId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  post?: any; // For user likes, includes post details
  createdAt?: string;
}

interface LikeStoreState {
  likes: Like[];
  postLikes: Like[];
  userLikes: Like[];
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // Actions
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  getPostLikes: (postId: string, page?: number, limit?: number) => Promise<void>;
  getUserLikes: (page?: number, limit?: number) => Promise<void>;
  // Optimistic update methods
  addLikeOptimistically: (postId: string, userId: string, userName: string, userAvatar?: string) => void;
  removeLikeOptimistically: (postId: string, userId: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useLikeStore = create<LikeStoreState>()(
  persist(
    (set, get) => ({
      likes: [],
      postLikes: [],
      userLikes: [],
      isLoading: false,
      error: null,
      success: null,

      likePost: async (postId: string) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.post(`/likes/post/${postId}`);
          if (response.data.status === "success") {
            set({
              success: "Post liked successfully!",
              isLoading: false,
            });
            // Optionally refresh post likes
            await get().getPostLikes(postId);
          } else {
            throw new Error(response.data.message || "Failed to like post");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to like post",
            isLoading: false,
          });
        }
      },

      unlikePost: async (postId: string) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.delete(`/likes/post/${postId}`);
          if (response.data.status === "success") {
            set({
              success: "Post unliked successfully!",
              isLoading: false,
            });
            // Optionally refresh post likes
            await get().getPostLikes(postId);
          } else {
            throw new Error(response.data.message || "Failed to unlike post");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to unlike post",
            isLoading: false,
          });
        }
      },

      getPostLikes: async (postId: string, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get(`/likes/post/${postId}`, {
            params: { page, limit },
          });
          if (response.data.likes || response.data.data?.likes) {
            // Support both direct and paginated response
            const likes = response.data.likes || response.data.data.likes;
            set({ postLikes: likes, isLoading: false });
          } else if (response.data.status === "success") {
            set({
              postLikes: response.data.data.likes || [],
              isLoading: false,
            });
          } else {
            throw new Error(response.data.message || "Failed to fetch post likes");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to fetch post likes",
            isLoading: false,
          });
        }
      },

      getUserLikes: async (page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get(`/likes/user/me`, {
            params: { page, limit },
          });
          if (response.data.likes || response.data.data?.likes) {
            const likes = response.data.likes || response.data.data.likes;
            set({ userLikes: likes, isLoading: false });
          } else if (response.data.status === "success") {
            set({
              userLikes: response.data.data.likes || [],
              isLoading: false,
            });
          } else {
            throw new Error(response.data.message || "Failed to fetch user likes");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to fetch user likes",
            isLoading: false,
          });
        }
      },

      addLikeOptimistically: (postId: string, userId: string, userName: string, userAvatar?: string) => {
        const newLike: Like = {
          id: `temp-${Date.now()}`,
          postId,
          userId,
          user: {
            id: userId,
            name: userName,
            avatar: userAvatar || null,
          },
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          postLikes: [...state.postLikes, newLike],
        }));
      },

      removeLikeOptimistically: (postId: string, userId: string) => {
        set((state) => ({
          postLikes: state.postLikes.filter(like => !(like.postId === postId && like.userId === userId)),
        }));
      },

      clearError: () => set({ error: null }),
      clearSuccess: () => set({ success: null }),
    }),
    {
      name: "like-storage",
      partialize: (state) => ({
        userLikes: state.userLikes,
        postLikes: state.postLikes,
      }),
    }
  )
); 