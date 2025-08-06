import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

interface Tag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface PostAnalytics {
  likes: number;
  comments: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  image: string | null;
  authorId: string;
  author: Author;
  tags: Tag[];
  analytics: PostAnalytics;
  createdAt: string;
  updatedAt: string;
  // Like-related properties from API response
  likes?: Array<{ userId: string }>;
  likedByIds?: string[];
  _count?: {
    comments: number;
    likes: number;
  };
}

interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

interface CreatePostData {
  title: string;
  content: string;
  imageKey?: string;
}

interface UpdatePostData {
  title?: string;
  content?: string;
  imageKey?: string;
}

interface PostFilters {
  tag?: string;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
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

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  
  // Post Actions
  listPosts: (filters?: PostFilters) => Promise<void>;
  getFollowingPosts: (filters?: PostFilters) => Promise<void>;
  getPostById: (id: string) => Promise<void>;
  createPost: (postData: CreatePostData) => Promise<void>;
  updatePost: (id: string, postData: UpdatePostData) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  
  // Upload Actions
  getUploadUrl: (contentType: string, fileName: string) => Promise<UploadUrlResponse>;
  
  // Utility Actions
  clearPosts: () => void;
  clearCurrentPost: () => void;
  clearError: () => void;
  setCurrentPost: (post: Post | null) => void;
  
  // Optimistic update methods for likes
  addLikeOptimistically: (postId: string, userId: string) => void;
  removeLikeOptimistically: (postId: string, userId: string) => void;
  
  // Optimistic update methods for comments
  addCommentOptimistically: (postId: string) => void;
  removeCommentOptimistically: (postId: string) => void;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      currentPost: null,
      isLoading: false,
      error: null,
      isLoaded: false,

      // Post Actions
      listPosts: async (filters: PostFilters = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          const params = new URLSearchParams();
          
          // Add filters to params
          if (filters.tag) params.append('tag', filters.tag);
          if (filters.userId) params.append('userId', filters.userId);
          if (filters.search) params.append('search', filters.search);
          if (filters.startDate) params.append('startDate', filters.startDate);
          if (filters.endDate) params.append('endDate', filters.endDate);
          if (filters.page) params.append('page', filters.page.toString());
          if (filters.limit) params.append('limit', filters.limit.toString());
          
          const response = await axiosInstance.get(`/posts?${params.toString()}`);
          
          if (response.data.status === 'success') {
            const posts = response.data.data.posts || [];
            set({
              posts,
              isLoading: false,
              isLoaded: true,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch posts");
          }
        } catch (error: any) {
          console.error("Error fetching posts:", error);
          
          let errorMessage = "Failed to fetch posts";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Posts not found";
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

      getFollowingPosts: async (filters: PostFilters = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          const params = new URLSearchParams();
          
          // Add filters to params
          if (filters.tag) params.append('tag', filters.tag);
          if (filters.search) params.append('search', filters.search);
          if (filters.startDate) params.append('startDate', filters.startDate);
          if (filters.endDate) params.append('endDate', filters.endDate);
          if (filters.page) params.append('page', filters.page.toString());
          if (filters.limit) params.append('limit', filters.limit.toString());
          
          const response = await axiosInstance.get(`/posts/feeds?${params.toString()}`);
          
          if (response.data.status === 'success') {
            const posts = response.data.data.posts || [];
            set({
              posts,
              isLoading: false,
              isLoaded: true,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch following posts");
          }
        } catch (error: any) {
          console.error("Error fetching following posts:", error);
          
          let errorMessage = "Failed to fetch following posts";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Following posts not found";
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

      getPostById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/posts/${id}`);
          
          if (response.data.status === 'success') {
            const post = response.data.data.post;
            set({
              currentPost: post,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch post");
          }
        } catch (error: any) {
          console.error("Error fetching post:", error);
          
          let errorMessage = "Failed to fetch post";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Post not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      createPost: async (postData: CreatePostData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/posts", postData);
          
          if (response.data.status === 'success') {
            const newPost = response.data.data.post;
            const { posts } = get();
            
            set({
              posts: [newPost, ...posts],
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to create post");
          }
        } catch (error: any) {
          console.error("Error creating post:", error);
          
          let errorMessage = "Failed to create post";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 403) {
            errorMessage = "Only experts can create posts";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.message || "Invalid post data";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updatePost: async (id: string, postData: UpdatePostData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.patch(`/posts/${id}`, postData);
          
          if (response.data.status === 'success') {
            const updatedPost = response.data.data.post;
            const { posts } = get();
            
            const updatedPosts = posts.map(post => 
              post.id === id ? updatedPost : post
            );
            
            set({
              posts: updatedPosts,
              currentPost: get().currentPost?.id === id ? updatedPost : get().currentPost,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update post");
          }
        } catch (error: any) {
          console.error("Error updating post:", error);
          
          let errorMessage = "Failed to update post";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 403) {
            errorMessage = "Only experts can update posts";
          } else if (error.response?.status === 404) {
            errorMessage = "Post not found";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.message || "Invalid post data";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deletePost: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/posts/${id}`);
          
          if (response.status === 204) {
            const { posts } = get();
            
            const updatedPosts = posts.filter(post => post.id !== id);
            
            set({
              posts: updatedPosts,
              currentPost: get().currentPost?.id === id ? null : get().currentPost,
              isLoading: false,
            });
          } else {
            throw new Error("Failed to delete post");
          }
        } catch (error: any) {
          console.error("Error deleting post:", error);
          
          let errorMessage = "Failed to delete post";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 403) {
            errorMessage = "Only experts can delete posts";
          } else if (error.response?.status === 404) {
            errorMessage = "Post not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Upload Actions
      getUploadUrl: async (contentType: string, fileName: string): Promise<UploadUrlResponse> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/posts/upload-url", {
            params: { contentType, fileName }
          });
          
          if (response.data.status === 'success') {
            set({ isLoading: false });
            return response.data.data;
          } else {
            throw new Error(response.data.error || "Failed to get upload URL");
          }
        } catch (error: any) {
          console.error("Error getting upload URL:", error);
          
          let errorMessage = "Failed to get upload URL";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.message || "Invalid upload parameters";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          throw new Error(errorMessage);
        }
      },

      // Utility Actions
      clearPosts: () => {
        set({
          posts: [],
          isLoading: false,
          error: null,
          isLoaded: false,
        });
      },

      clearCurrentPost: () => {
        set({ currentPost: null });
      },

      clearError: () => {
        set({ error: null });
      },

      setCurrentPost: (post: Post | null) => {
        set({ currentPost: post });
      },

      addLikeOptimistically: (postId: string, userId: string) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likedByIds: [...(post.likedByIds || []), userId],
                analytics: {
                  ...post.analytics,
                  likes: (post.analytics?.likes || 0) + 1
                },
                _count: {
                  ...post._count,
                  likes: (post._count?.likes || 0) + 1
                }
              };
            }
            return post;
          })
        }));
      },

      removeLikeOptimistically: (postId: string, userId: string) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likedByIds: (post.likedByIds || []).filter(id => id !== userId),
                analytics: {
                  ...post.analytics,
                  likes: Math.max(0, (post.analytics?.likes || 0) - 1)
                },
                _count: {
                  ...post._count,
                  likes: Math.max(0, (post._count?.likes || 0) - 1)
                }
              };
            }
            return post;
          })
        }));
      },

      addCommentOptimistically: (postId: string) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                analytics: {
                  ...post.analytics,
                  comments: (post.analytics?.comments || 0) + 1
                },
                _count: {
                  ...post._count,
                  comments: (post._count?.comments || 0) + 1
                }
              };
            }
            return post;
          })
        }));
      },

      removeCommentOptimistically: (postId: string) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                analytics: {
                  ...post.analytics,
                  comments: Math.max(0, (post.analytics?.comments || 0) - 1)
                },
                _count: {
                  ...post._count,
                  comments: Math.max(0, (post._count?.comments || 0) - 1)
                }
              };
            }
            return post;
          })
        }));
      },
    }),
    {
      name: "posts-storage",
      partialize: (state) => ({
        posts: state.posts,
        isLoaded: state.isLoaded,
      }),
    }
  )
); 