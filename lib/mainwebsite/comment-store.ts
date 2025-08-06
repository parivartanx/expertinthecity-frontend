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
  createComment: (postId: string, content: string) => Promise<Comment>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;

  getReplies: (commentId: string, page?: number, limit?: number) => Promise<void>;
  createReply: (commentId: string, content: string) => Promise<Reply>;
  updateReply: (replyId: string, content: string) => Promise<void>;
  deleteReply: (replyId: string) => Promise<void>;

  clearError: () => void;
  clearSuccess: () => void;
  
  // Optimistic update methods
  addCommentOptimisticallyToStore: (postId: string, content: string, author: Author) => string;
  updateCommentOptimistically: (commentId: string, content: string) => void;
  deleteCommentOptimistically: (commentId: string) => void;
  updateOptimisticCommentWithReal: (tempId: string, realComment: Comment) => void;
  addReplyOptimistically: (commentId: string, content: string, author: Author) => string;
  updateReplyOptimistically: (replyId: string, content: string) => void;
  deleteReplyOptimistically: (replyId: string) => void;
  updateOptimisticReplyWithReal: (tempId: string, realReply: Reply) => void;
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
            // Return the created comment data
            return response.data.data?.comment || response.data.comment;
          } else {
            throw new Error(response.data.message || "Failed to add comment");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to add comment",
            isLoading: false,
          });
          throw error;
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
            // Return the created reply data
            return response.data.data?.reply || response.data.reply;
          } else {
            throw new Error(response.data.message || "Failed to add reply");
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Failed to add reply",
            isLoading: false,
          });
          throw error;
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

      addCommentOptimisticallyToStore: (postId: string, content: string, author: Author) => {
        const tempId = `temp-${Date.now()}`;
        const newComment: Comment = {
          id: tempId,
          content,
          author,
          postId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replies: [],
        };
        
        set((state) => ({
          comments: [...state.comments, newComment],
        }));
        
        return tempId;
      },

      updateCommentOptimistically: (commentId: string, content: string) => {
        set((state) => ({
          comments: state.comments.map(comment => 
            comment.id === commentId 
              ? { ...comment, content, updatedAt: new Date().toISOString() }
              : comment
          ),
        }));
      },

      deleteCommentOptimistically: (commentId: string) => {
        set((state) => ({
          comments: state.comments.filter(comment => comment.id !== commentId),
        }));
      },

      addReplyOptimistically: (commentId: string, content: string, author: Author) => {
        const tempId = `temp-reply-${Date.now()}`;
        const newReply: Reply = {
          id: tempId,
          content,
          author,
          commentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          replies: [...state.replies, newReply],
          comments: state.comments.map(comment => 
            comment.id === commentId 
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          ),
        }));
        
        return tempId;
      },

      updateReplyOptimistically: (replyId: string, content: string) => {
        set((state) => ({
          replies: state.replies.map(reply => 
            reply.id === replyId 
              ? { ...reply, content, updatedAt: new Date().toISOString() }
              : reply
          ),
          comments: state.comments.map(comment => ({
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === replyId 
                ? { ...reply, content, updatedAt: new Date().toISOString() }
                : reply
            ),
          })),
        }));
      },

      deleteReplyOptimistically: (replyId: string) => {
        set((state) => ({
          replies: state.replies.filter(reply => reply.id !== replyId),
          comments: state.comments.map(comment => ({
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== replyId),
          })),
        }));
      },

      updateOptimisticReplyWithReal: (tempId: string, realReply: Reply) => {
        set((state) => ({
          replies: state.replies.map(reply => 
            reply.id === tempId ? realReply : reply
          ),
          comments: state.comments.map(comment => ({
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === tempId ? realReply : reply
            ),
          })),
        }));
      },

      updateOptimisticCommentWithReal: (tempId: string, realComment: Comment) => {
        set((state) => ({
          comments: state.comments.map(comment => 
            comment.id === tempId ? realComment : comment
          ),
        }));
      },
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