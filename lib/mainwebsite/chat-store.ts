import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "audio" | "video" | "system";
  status: "sent" | "delivered" | "read" | "failed";
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
    duration?: number;
    [key: string]: any;
  };
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  createdAt: string;
  updatedAt: string;
  
  // Related data
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}

interface Chat {
  id: string;
  type: "direct" | "group" | "expert" | "support";
  name?: string;
  avatar?: string;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount: number;
  isActive: boolean;
  isArchived: boolean;
  isMuted: boolean;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  settings?: {
    allowFileSharing: boolean;
    allowVoiceMessages: boolean;
    allowVideoCalls: boolean;
    autoDeleteMessages: boolean;
    deleteAfterDays?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ChatFilters {
  type?: string;
  isActive?: boolean;
  isArchived?: boolean;
  hasUnread?: boolean;
  participantId?: string;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  totalChats: number;
  totalMessages: number;
  currentPage: number;
  totalPages: number;
  filters: ChatFilters;
  isTyping: boolean;
  typingUsers: string[];
  
  // Chat Actions
  fetchChats: (page?: number, limit?: number) => Promise<void>;
  fetchChatById: (id: string) => Promise<void>;
  createChat: (chatData: Partial<Chat>) => Promise<void>;
  updateChat: (id: string, chatData: Partial<Chat>) => Promise<void>;
  archiveChat: (id: string) => Promise<void>;
  unarchiveChat: (id: string) => Promise<void>;
  muteChat: (id: string) => Promise<void>;
  unmuteChat: (id: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  leaveChat: (id: string) => Promise<void>;
  addParticipant: (chatId: string, participantId: string) => Promise<void>;
  removeParticipant: (chatId: string, participantId: string) => Promise<void>;
  
  // Message Actions
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, senderId: string, text: string) => Promise<void>;
  updateMessage: (id: string, messageData: Partial<Message>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  markAsRead: (chatId: string, messageIds?: string[]) => Promise<void>;
  markAsDelivered: (messageId: string) => Promise<void>;
  
  // File Upload Actions
  uploadFile: (chatId: string, file: File, type: "image" | "file" | "audio" | "video") => Promise<void>;
  
  // Real-time Actions
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  setTyping: (isTyping: boolean, userId?: string) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
  
  // Filter and Search Actions
  filterChats: (filters: Partial<ChatFilters>, page?: number, limit?: number) => Promise<void>;
  searchMessages: (chatId: string, query: string, page?: number, limit?: number) => Promise<void>;
  searchChats: (query: string, page?: number, limit?: number) => Promise<void>;
  
  // Utility Actions
  clearChats: () => void;
  clearMessages: () => void;
  clearCurrentChat: () => void;
  clearError: () => void;
  setFilters: (filters: Partial<ChatFilters>) => void;
  resetFilters: () => void;
  setCurrentChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;

  // New cleanup action
  cleanupMessagesListener: () => void;
}

let unsubscribeMessages: (() => void) | null = null;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChat: null,
      messages: [],
      isLoading: false,
      error: null,
      totalChats: 0,
      totalMessages: 0,
      currentPage: 1,
      totalPages: 1,
      filters: {},
      isTyping: false,
      typingUsers: [],

      // Chat Actions
      fetchChats: async (page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/chats", {
            params: {
              page,
              limit,
              ...get().filters
            }
          });
          
          if (response.data.success) {
            const { chats, totalChats, currentPage, totalPages } = response.data.data;
            set({
              chats,
              totalChats,
              currentPage,
              totalPages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch chats");
          }
        } catch (error: any) {
          console.error("Error fetching chats:", error);
          
          let errorMessage = "Failed to fetch chats";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chats not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      fetchChatById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/chats/${id}`);
          
          if (response.data.success) {
            const chat = response.data.data;
            set({
              currentChat: chat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch chat");
          }
        } catch (error: any) {
          console.error("Error fetching chat:", error);
          
          let errorMessage = "Failed to fetch chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      createChat: async (chatData: Partial<Chat>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/chats", chatData);
          
          if (response.data.success) {
            const newChat = response.data.data;
            const { chats, totalChats } = get();
            
            set({
              chats: [newChat, ...chats],
              totalChats: totalChats + 1,
              currentChat: newChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to create chat");
          }
        } catch (error: any) {
          console.error("Error creating chat:", error);
          
          let errorMessage = "Failed to create chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid chat data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updateChat: async (id: string, chatData: Partial<Chat>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/chats/${id}`, chatData);
          
          if (response.data.success) {
            const updatedChat = response.data.data;
            const { chats } = get();
            
            const updatedChats = chats.map(c => 
              c.id === id ? updatedChat : c
            );
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === id ? updatedChat : get().currentChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update chat");
          }
        } catch (error: any) {
          console.error("Error updating chat:", error);
          
          let errorMessage = "Failed to update chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid chat data";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      archiveChat: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/chats/${id}/archive`);
          
          if (response.data.success) {
            const archivedChat = response.data.data;
            const { chats } = get();
            
            const updatedChats = chats.map(c => 
              c.id === id ? archivedChat : c
            );
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === id ? archivedChat : get().currentChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to archive chat");
          }
        } catch (error: any) {
          console.error("Error archiving chat:", error);
          
          let errorMessage = "Failed to archive chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      unarchiveChat: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/chats/${id}/unarchive`);
          
          if (response.data.success) {
            const unarchivedChat = response.data.data;
            const { chats } = get();
            
            const updatedChats = chats.map(c => 
              c.id === id ? unarchivedChat : c
            );
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === id ? unarchivedChat : get().currentChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to unarchive chat");
          }
        } catch (error: any) {
          console.error("Error unarchiving chat:", error);
          
          let errorMessage = "Failed to unarchive chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      muteChat: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/chats/${id}/mute`);
          
          if (response.data.success) {
            const mutedChat = response.data.data;
            const { chats } = get();
            
            const updatedChats = chats.map(c => 
              c.id === id ? mutedChat : c
            );
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === id ? mutedChat : get().currentChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to mute chat");
          }
        } catch (error: any) {
          console.error("Error muting chat:", error);
          
          let errorMessage = "Failed to mute chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      unmuteChat: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/chats/${id}/unmute`);
          
          if (response.data.success) {
            const unmutedChat = response.data.data;
            const { chats } = get();
            
            const updatedChats = chats.map(c => 
              c.id === id ? unmutedChat : c
            );
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === id ? unmutedChat : get().currentChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to unmute chat");
          }
        } catch (error: any) {
          console.error("Error unmuting chat:", error);
          
          let errorMessage = "Failed to unmute chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteChat: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/chats/${id}`);
          
          if (response.data.success) {
            const { chats, totalChats } = get();
            
            const updatedChats = chats.filter(c => c.id !== id);
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === id ? null : get().currentChat,
              totalChats: Math.max(0, totalChats - 1),
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete chat");
          }
        } catch (error: any) {
          console.error("Error deleting chat:", error);
          
          let errorMessage = "Failed to delete chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      leaveChat: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/chats/${id}/leave`);
          
          if (response.data.success) {
            const { chats, totalChats } = get();
            
            const updatedChats = chats.filter(c => c.id !== id);
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === id ? null : get().currentChat,
              totalChats: Math.max(0, totalChats - 1),
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to leave chat");
          }
        } catch (error: any) {
          console.error("Error leaving chat:", error);
          
          let errorMessage = "Failed to leave chat";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      addParticipant: async (chatId: string, participantId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post(`/chats/${chatId}/participants`, {
            participantId
          });
          
          if (response.data.success) {
            const updatedChat = response.data.data;
            const { chats } = get();
            
            const updatedChats = chats.map(c => 
              c.id === chatId ? updatedChat : c
            );
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === chatId ? updatedChat : get().currentChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to add participant");
          }
        } catch (error: any) {
          console.error("Error adding participant:", error);
          
          let errorMessage = "Failed to add participant";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid participant data";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat or user not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      removeParticipant: async (chatId: string, participantId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/chats/${chatId}/participants/${participantId}`);
          
          if (response.data.success) {
            const updatedChat = response.data.data;
            const { chats } = get();
            
            const updatedChats = chats.map(c => 
              c.id === chatId ? updatedChat : c
            );
            
            set({
              chats: updatedChats,
              currentChat: get().currentChat?.id === chatId ? updatedChat : get().currentChat,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to remove participant");
          }
        } catch (error: any) {
          console.error("Error removing participant:", error);
          
          let errorMessage = "Failed to remove participant";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat or participant not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Message Actions
      fetchMessages: async (chatId: string) => {
        set({ isLoading: true, error: null });
        // Clean up previous listener
        if (unsubscribeMessages) unsubscribeMessages();
        const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
        unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
          set({ messages, totalMessages: messages.length, isLoading: false });
        });
      },

      sendMessage: async (chatId: string, senderId: string, text: string) => {
        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
          senderId,
          text,
          timestamp: serverTimestamp(),
          read: false,
        });
      },

      updateMessage: async (id: string, messageData: Partial<Message>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/messages/${id}`, messageData);
          
          if (response.data.success) {
            const updatedMessage = response.data.data;
            const { messages } = get();
            
            const updatedMessages = messages.map(m => 
              m.id === id ? updatedMessage : m
            );
            
            set({
              messages: updatedMessages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update message");
          }
        } catch (error: any) {
          console.error("Error updating message:", error);
          
          let errorMessage = "Failed to update message";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid message data";
          } else if (error.response?.status === 404) {
            errorMessage = "Message not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteMessage: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/messages/${id}`);
          
          if (response.data.success) {
            const { messages, totalMessages } = get();
            
            const updatedMessages = messages.filter(m => m.id !== id);
            
            set({
              messages: updatedMessages,
              totalMessages: Math.max(0, totalMessages - 1),
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete message");
          }
        } catch (error: any) {
          console.error("Error deleting message:", error);
          
          let errorMessage = "Failed to delete message";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Message not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      markAsRead: async (chatId: string, messageIds?: string[]) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/chats/${chatId}/mark-read`, {
            messageIds
          });
          
          if (response.data.success) {
            const { messages } = get();
            
            const updatedMessages = messages.map(m => 
              (!messageIds || messageIds.includes(m.id)) ? { ...m, status: 'read' as const } : m
            );
            
            set({
              messages: updatedMessages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to mark messages as read");
          }
        } catch (error: any) {
          console.error("Error marking messages as read:", error);
          
          let errorMessage = "Failed to mark messages as read";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      markAsDelivered: async (messageId: string) => {
        try {
          const { messages } = get();
          
          const updatedMessages = messages.map(m => 
            m.id === messageId ? { ...m, status: 'delivered' as const } : m
          );
          
          set({
            messages: updatedMessages,
          });
        } catch (error: any) {
          console.error("Error marking message as delivered:", error);
        }
      },

      // File Upload Actions
      uploadFile: async (chatId: string, file: File, type: "image" | "file" | "audio" | "video") => {
        try {
          set({ isLoading: true, error: null });
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', type);
          
          const response = await axiosInstance.post(`/chats/${chatId}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (response.data.success) {
            const uploadedMessage = response.data.data;
            const { messages, totalMessages } = get();
            
            set({
              messages: [...messages, uploadedMessage],
              totalMessages: totalMessages + 1,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to upload file");
          }
        } catch (error: any) {
          console.error("Error uploading file:", error);
          
          let errorMessage = "Failed to upload file";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid file";
          } else if (error.response?.status === 413) {
            errorMessage = "File too large";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Real-time Actions
      addMessage: (message: Message) => {
        const { messages, totalMessages } = get();
        set({
          messages: [...messages, message],
          totalMessages: totalMessages + 1,
        });
      },

      updateMessageStatus: (messageId: string, status: Message['status']) => {
        const { messages } = get();
        const updatedMessages = messages.map(m => 
          m.id === messageId ? { ...m, status } : m
        );
        set({ messages: updatedMessages });
      },

      setTyping: (isTyping: boolean, userId?: string) => {
        set({ isTyping });
      },

      addTypingUser: (userId: string) => {
        const { typingUsers } = get();
        if (!typingUsers.includes(userId)) {
          set({ typingUsers: [...typingUsers, userId] });
        }
      },

      removeTypingUser: (userId: string) => {
        const { typingUsers } = get();
        set({ typingUsers: typingUsers.filter(id => id !== userId) });
      },

      // Filter and Search Actions
      filterChats: async (filters: Partial<ChatFilters>, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const newFilters = { ...get().filters, ...filters };
          set({ filters: newFilters });
          
          const response = await axiosInstance.get("/chats/filter", {
            params: {
              page,
              limit,
              ...newFilters
            }
          });
          
          if (response.data.success) {
            const { chats, totalChats, currentPage, totalPages } = response.data.data;
            set({
              chats,
              totalChats,
              currentPage,
              totalPages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to filter chats");
          }
        } catch (error: any) {
          console.error("Error filtering chats:", error);
          
          let errorMessage = "Failed to filter chats";
          
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

      searchMessages: async (chatId: string, query: string, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/chats/${chatId}/messages/search`, {
            params: {
              q: query,
              page,
              limit
            }
          });
          
          if (response.data.success) {
            const { messages, totalMessages, currentPage, totalPages } = response.data.data;
            set({
              messages,
              totalMessages,
              currentPage,
              totalPages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to search messages");
          }
        } catch (error: any) {
          console.error("Error searching messages:", error);
          
          let errorMessage = "Failed to search messages";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Chat not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      searchChats: async (query: string, page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/chats/search", {
            params: {
              q: query,
              page,
              limit,
              ...get().filters
            }
          });
          
          if (response.data.success) {
            const { chats, totalChats, currentPage, totalPages } = response.data.data;
            set({
              chats,
              totalChats,
              currentPage,
              totalPages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to search chats");
          }
        } catch (error: any) {
          console.error("Error searching chats:", error);
          
          let errorMessage = "Failed to search chats";
          
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

      // Utility Actions
      clearChats: () => {
        set({
          chats: [],
          currentChat: null,
          totalChats: 0,
          currentPage: 1,
          totalPages: 1,
          isLoading: false,
          error: null,
        });
      },

      clearMessages: () => {
        set({
          messages: [],
          totalMessages: 0,
          currentPage: 1,
          totalPages: 1,
          isLoading: false,
          error: null,
        });
      },

      clearCurrentChat: () => {
        set({ currentChat: null });
      },

      clearError: () => {
        set({ error: null });
      },

      setFilters: (filters: Partial<ChatFilters>) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      resetFilters: () => {
        set({ filters: {} });
      },

      setCurrentChat: (chat: Chat | null) => {
        set({ currentChat: chat });
      },

      setMessages: (messages: Message[]) => {
        set({ messages });
      },

      // New cleanup action
      cleanupMessagesListener: () => {
        if (unsubscribeMessages) {
          unsubscribeMessages();
          unsubscribeMessages = null;
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        chats: state.chats,
        currentChat: state.currentChat,
        messages: state.messages,
        filters: state.filters,
      }),
    }
  )
); 