import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";
import { useAdminAuthStore } from "./auth-store";

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

// Helper function to refresh admin token
const refreshAdminToken = async () => {
  try {
    const adminRefreshToken = localStorage.getItem("adminRefreshToken");
    if (!adminRefreshToken) {
      throw new Error("No admin refresh token available");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
    const response = await fetch(`${baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: adminRefreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh admin token");
    }

    const data = await response.json();
    
    if (data.status === "success") {
      const { accessToken, refreshToken } = data;
      localStorage.setItem("adminAccessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("adminRefreshToken", refreshToken);
      }
      return accessToken;
    } else {
      throw new Error("Invalid refresh token response");
    }
  } catch (error) {
    // Clear admin tokens on refresh failure
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    throw error;
  }
};

// Helper function to make authenticated admin API calls
const makeAdminApiCall = async (url: string, options: RequestInit = {}) => {

  let adminToken = localStorage.getItem("adminAccessToken");
  if (!adminToken) {
    // Try to re-initialize from Zustand auth store
    if (typeof window !== 'undefined' && useAdminAuthStore?.getState) {
      useAdminAuthStore.getState().initializeAuth?.();
      adminToken = localStorage.getItem("adminAccessToken");
    }
    if (!adminToken) {
      throw new Error("No admin access token available");
    }
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Try to refresh token
      const newToken = await refreshAdminToken();
      
      // Retry with new token
      const retryConfig = {
        ...config,
        headers: {
          ...config.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      };
      
      const retryResponse = await fetch(url, retryConfig);
      
      if (!retryResponse.ok) {
        throw new Error(`API call failed: ${retryResponse.status}`);
      }
      
      return retryResponse;
    }
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("No admin access token available")) {
      // Redirect to admin login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    throw error;
  }
};

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
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const queryParams = new URLSearchParams();
          
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
          
          const url = `${baseURL}/admin/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          const response = await makeAdminApiCall(url);
          const data = await response.json();
          
          if (data.status === "success" && data.data) {
            const { posts, pagination } = data.data;
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
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchPostById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/posts/${id}`;
          const response = await makeAdminApiCall(url);
          const data = await response.json();
          
          if (data.status === "success" && data.data && data.data.post) {
            const post = data.data.post;
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
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      updatePost: async (id: string, data: Partial<AdminContentPost>) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/posts/${id}`;
          const response = await makeAdminApiCall(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
          });
          const responseData = await response.json();
          
          if (responseData.status === "success" && responseData.data && responseData.data.post) {
            const updatedPost = responseData.data.post;
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
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      deletePost: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/posts/${id}`;
          await makeAdminApiCall(url, {
            method: 'DELETE',
          });
          
          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            selectedPost: state.selectedPost && state.selectedPost.id === id ? null : state.selectedPost,
            isLoading: false,
          }));
        } catch (error: any) {
          let errorMessage = "Failed to delete post";
          if (error.message) {
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