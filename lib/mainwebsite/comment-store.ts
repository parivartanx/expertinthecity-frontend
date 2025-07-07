import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

interface Reply {
  id: string;
  content: string;
  author: Author;
  commentId: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  postId: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
}

interface CommentStoreState {
  comments: Comment[];
  replies: Reply[];
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // Actions
  getComments: (postId: string, page?: number, limit?: number) => Promise<void>;
  createComment: (postId: string, content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;

  getReplies: (commentId: string, page?: number, limit?: number) => Promise<void>;
  createReply: (commentId: string, content: string) => Promise<void>;
  updateReply: (replyId: string, content: string) => Promise<void>;
  deleteReply: (replyId: string) => Promise<void>;

  clearError: () => void;
  clearSuccess: () => void;
}

export const useCommentStore = create<CommentStoreState>()(
  persist(
    (set, get) => ({
      comments: [],
      replies: [],
      isLoading: false,
      error: null,
      success: null,

      getComments: async (postId, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get(`/comments/post/${postId}`, {
            params: { page, limit },
          });
          if (response.data.comments || response.data.data?.comments) {
            const comments = response.data.comments || response.data.data.comments;
            set({ comments, isLoading: false });
          } else if (response.data.status === "success") {
            set({ comments: response.data.data.comments || [], isLoading: false });
          } else {
            throw new Error(response.data.message || "Failed to fetch comments");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to fetch comments",
            isLoading: false,
          });
        }
      },

      createComment: async (postId, content) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.post(`/comments/post/${postId}`, { content });
          if (response.data.status === "success") {
            set({ success: "Comment added!", isLoading: false });
            // Optionally refresh comments
            await get().getComments(postId);
          } else {
            throw new Error(response.data.message || "Failed to add comment");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to add comment",
            isLoading: false,
          });
        }
      },

      updateComment: async (commentId, content) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.patch(`/comments/${commentId}`, { content });
          if (response.data.status === "success") {
            set({ success: "Comment updated!", isLoading: false });
            // Optionally refresh comments (find postId from state if needed)
          } else {
            throw new Error(response.data.message || "Failed to update comment");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to update comment",
            isLoading: false,
          });
        }
      },

      deleteComment: async (commentId) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.delete(`/comments/${commentId}`);
          if (response.data.status === "success") {
            set({ success: "Comment deleted!", isLoading: false });
            // Optionally refresh comments
          } else {
            throw new Error(response.data.message || "Failed to delete comment");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to delete comment",
            isLoading: false,
          });
        }
      },

      getReplies: async (commentId, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get(`/comments/${commentId}/replies`, {
            params: { page, limit },
          });
          if (response.data.replies || response.data.data?.replies) {
            const replies = response.data.replies || response.data.data.replies;
            set({ replies, isLoading: false });
          } else if (response.data.status === "success") {
            set({ replies: response.data.data.replies || [], isLoading: false });
          } else {
            throw new Error(response.data.message || "Failed to fetch replies");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to fetch replies",
            isLoading: false,
          });
        }
      },

      createReply: async (commentId, content) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.post(`/comments/${commentId}/replies`, { content });
          if (response.data.status === "success") {
            set({ success: "Reply added!", isLoading: false });
            // Optionally refresh replies
            await get().getReplies(commentId);
          } else {
            throw new Error(response.data.message || "Failed to add reply");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to add reply",
            isLoading: false,
          });
        }
      },

      updateReply: async (replyId, content) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.patch(`/comments/replies/${replyId}`, { content });
          if (response.data.status === "success") {
            set({ success: "Reply updated!", isLoading: false });
            // Optionally refresh replies
          } else {
            throw new Error(response.data.message || "Failed to update reply");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to update reply",
            isLoading: false,
          });
        }
      },

      deleteReply: async (replyId) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await axiosInstance.delete(`/comments/replies/${replyId}`);
          if (response.data.status === "success") {
            set({ success: "Reply deleted!", isLoading: false });
            // Optionally refresh replies
          } else {
            throw new Error(response.data.message || "Failed to delete reply");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to delete reply",
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
      clearSuccess: () => set({ success: null }),
    }),
    {
      name: "comment-storage",
      partialize: (state) => ({
        comments: state.comments,
        replies: state.replies,
      }),
    }
  )
); 