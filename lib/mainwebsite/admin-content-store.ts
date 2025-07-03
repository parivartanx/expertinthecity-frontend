import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

export interface AdminContentPost {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  createdAt: string;
  expertId: string;
  expertName: string;
  likes: number;
  comments: number;
}

export interface AdminContentPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface AdminContentState {
  posts: AdminContentPost[];
  pagination: AdminContentPagination | null;
  selectedPost: AdminContentPost | null;
  isLoading: boolean;
  error: string | null;
  fetchPosts: (params?: { page?: number; limit?: number; search?: string; authorId?: string; sortBy?: string; sortOrder?: string; startDate?: string; endDate?: string }) => Promise<void>;
  fetchPostById: (id: string) => Promise<void>;
  updatePost: (id: string, data: Partial<AdminContentPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminContentStore = create<AdminContentState>()(
  persist(
    (set, get) => ({
      posts: [],
      pagination: null,
      selectedPost: null,
      isLoading: false,
      error: null,

      fetchPosts: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get("/admin/posts", { params });
          if (response.data && response.data.data) {
            const { posts, pagination } = response.data.data;
            set({
              posts: posts.map((post: any) => ({
                id: post.id,
                title: post.title,
                content: post.content,
                category: post.category,
                status: post.status,
                createdAt: post.createdAt,
                expertId: post.author?.id || "",
                expertName: post.author?.name || "",
                likes: post._count?.likes || 0,
                comments: post._count?.comments || 0,
              })),
              pagination,
              isLoading: false,
            });
          } else {
            throw new Error("Invalid posts response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch posts";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchPostById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get(`/admin/posts/${id}`);
          if (response.data && response.data.data && response.data.data.post) {
            const post = response.data.data.post;
            set({
              selectedPost: {
                id: post.id,
                title: post.title,
                content: post.content,
                category: post.category,
                status: post.status,
                createdAt: post.createdAt,
                expertId: post.author?.id || "",
                expertName: post.author?.name || "",
                likes: post._count?.likes || 0,
                comments: post._count?.comments || 0,
              },
              isLoading: false,
            });
          } else {
            throw new Error("Invalid post response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch post";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      updatePost: async (id: string, data: Partial<AdminContentPost>) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.patch(`/admin/posts/${id}`, data);
          if (response.data && response.data.data && response.data.data.post) {
            const updatedPost = response.data.data.post;
            set((state) => ({
              posts: state.posts.map((p) => p.id === id ? {
                id: updatedPost.id,
                title: updatedPost.title,
                content: updatedPost.content,
                category: updatedPost.category,
                status: updatedPost.status,
                createdAt: updatedPost.createdAt,
                expertId: updatedPost.author?.id || "",
                expertName: updatedPost.author?.name || "",
                likes: updatedPost._count?.likes || 0,
                comments: updatedPost._count?.comments || 0,
              } : p),
              selectedPost: {
                id: updatedPost.id,
                title: updatedPost.title,
                content: updatedPost.content,
                category: updatedPost.category,
                status: updatedPost.status,
                createdAt: updatedPost.createdAt,
                expertId: updatedPost.author?.id || "",
                expertName: updatedPost.author?.name || "",
                likes: updatedPost._count?.likes || 0,
                comments: updatedPost._count?.comments || 0,
              },
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid update post response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to update post";
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      deletePost: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await axiosInstance.delete(`/admin/posts/${id}`);
          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            selectedPost: state.selectedPost && state.selectedPost.id === id ? null : state.selectedPost,
            isLoading: false,
          }));
        } catch (error: any) {
          let errorMessage = "Failed to delete post";
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
      name: "admin-content-storage",
      partialize: (state) => ({
        posts: state.posts,
        pagination: state.pagination,
        selectedPost: state.selectedPost,
      }),
    }
  )
); 