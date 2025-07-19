import { create } from "zustand";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  getDocs,
  getDoc,
  setDoc,
  arrayUnion,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuthStore } from "./auth-store";

// Types
export interface MessageReaction {
  userId: string;
  userName: string;
  reaction: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: "USER" | "EXPERT";
  timestamp: Date;
  readBy: string[];
  reactions?: MessageReaction[];
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: "USER" | "EXPERT";
  isOnline: boolean;
  lastSeen: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  participantDetails: {
    [userId: string]: ChatParticipant;
  };
  lastMessage?: ChatMessage;
  unreadCount: { [userId: string]: number };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: ChatMessage[] };
  currentChat: Chat | null;
  onlineUsers: Set<string>;
  typingUsers: { [chatId: string]: Set<string> };
  isLoading: boolean;
  error: string | null;
  
  fetchChats: () => void;
  fetchMessages: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  createChat: (participantIds: string[], fallbackProfile?: any) => Promise<string>;
  markMessageAsRead: (chatId: string, messageId: string) => Promise<void>;
  setTypingStatus: (chatId: string, isTyping: boolean) => Promise<void>;
  setCurrentChat: (chat: Chat | null) => void;
  clearMessages: () => void;
  clearError: () => void;
  deleteChat: (chatId: string) => Promise<void>;
  
  // Reaction Actions
  addReaction: (chatId: string, messageId: string, reaction: string) => Promise<void>;
  removeReaction: (chatId: string, messageId: string, reaction: string) => Promise<void>;
}

// Helper to fetch user info from backend API
async function fetchUserInfo(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api"}/users/${userId}`);
    if (!res.ok) return null;
    const data = await res.json();
    // Support both { user: {...} } and direct user object
    return data.user || data.data?.user || data.data || null;
  } catch (e) {
    return null;
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  currentChat: null,
  onlineUsers: new Set(),
  typingUsers: {},
  isLoading: false,
  error: null,

  fetchChats: () => {
    try {
      set({ isLoading: true, error: null });
      const currentUser = useAuthStore.getState().user;
      console.log("Current user ID in app:", currentUser?.id);
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", currentUser.id),
        orderBy("updatedAt", "desc")
      );

      onSnapshot(q, (snapshot) => {
        const chats: Chat[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          chats.push({
            id: doc.id,
            participants: data.participants || [],
            participantDetails: data.participantDetails || {},
            lastMessage: data.lastMessage ? {
              ...data.lastMessage,
              timestamp: data.lastMessage.timestamp?.toDate() || new Date(),
            } : undefined,
            unreadCount: data.unreadCount || {},
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            isActive: data.isActive !== false,
          });
        });
        console.log("Chats fetched from Firebase:", chats);
        set({ chats, isLoading: false });
      });
    } catch (error: any) {
      console.error("Error fetching chats:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMessages: (chatId: string) => {
    try {
      const currentUser = useAuthStore.getState().user;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(
        messagesRef,
        orderBy("timestamp", "desc"),
        limit(50)
      );

      onSnapshot(q, (snapshot) => {
        const messages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            content: data.content,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar,
            senderRole: data.senderRole,
            timestamp: data.timestamp?.toDate() || new Date(),
            readBy: data.readBy || [],
            reactions: data.reactions?.map((r: any) => ({
              userId: r.userId,
              userName: r.userName,
              reaction: r.reaction,
              timestamp: r.timestamp?.toDate() || new Date(),
            })) || [],
          });
        });
        
        messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: messages,
          },
        }));
      });
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      set({ error: error.message });
    }
  },

  sendMessage: async (chatId: string, content: string) => {
    try {
      const currentUser = useAuthStore.getState().user;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const messageData = {
        content,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar ?? "/default-avatar.png",
        senderRole: currentUser.role.toUpperCase() as "USER" | "EXPERT",
        timestamp: serverTimestamp(),
        readBy: [currentUser.id],
      };

      const messagesRef = collection(db, "chats", chatId, "messages");
      const messageRef = await addDoc(messagesRef, messageData);

      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const participants = chatData.participants || [];
        const unreadCount = { ...chatData.unreadCount };
        
        participants.forEach((participantId: string) => {
          if (participantId !== currentUser.id) {
            unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
          }
        });

        await updateDoc(chatRef, {
          lastMessage: {
            id: messageRef.id,
            content,
            senderId: currentUser.id,
            senderName: currentUser.name,
            timestamp: serverTimestamp(),
          },
          unreadCount,
          updatedAt: serverTimestamp(),
        });
      }

      get().setTypingStatus(chatId, false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      set({ error: error.message });
    }
  },

  createChat: async (participantIds: string[], fallbackProfile?: any) => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const allParticipants = [currentUser.id, ...participantIds].filter((id, index, arr) => arr.indexOf(id) === index);

      // Build participantDetails
      const participantDetails: any = {};
      // Add current user
      participantDetails[currentUser.id] = {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar ?? "/default-avatar.png",
        role: currentUser.role?.toUpperCase() || "USER",
        isOnline: true,
        lastSeen: new Date(),
      };
      // Add other participants
      for (const id of participantIds) {
        if (id === currentUser.id) continue;
        let user = await fetchUserInfo(id);
        if (!user && fallbackProfile && fallbackProfile.id === id) {
          user = fallbackProfile;
        }
        participantDetails[id] = {
          id: user?.id || id,
          name: user?.name || "Unknown User",
          avatar: user?.avatar ?? "/default-avatar.png",
          role: user?.role?.toUpperCase() || "EXPERT",
          isOnline: false,
          lastSeen: new Date(),
        };
      }

      const chatData = {
        participants: allParticipants,
        participantDetails,
        unreadCount: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      };

      const chatRef = await addDoc(collection(db, "chats"), chatData);
      return chatRef.id;
    } catch (error: any) {
      console.error("Error creating chat:", error);
      set({ error: error.message });
      throw error;
    }
  },

  markMessageAsRead: async (chatId: string, messageId: string) => {
    try {
      const currentUser = useAuthStore.getState().user;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, {
        readBy: arrayUnion(currentUser.id),
      });

      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const unreadCount = { ...chatData.unreadCount };
        unreadCount[currentUser.id] = 0;
        
        await updateDoc(chatRef, {
          unreadCount,
        });
      }
    } catch (error: any) {
      console.error("Error marking message as read:", error);
      set({ error: error.message });
    }
  },

  setTypingStatus: async (chatId: string, isTyping: boolean) => {
    try {
      const currentUser = useAuthStore.getState().user;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const userStatusRef = doc(db, "userStatus", currentUser.id);
      
      if (isTyping) {
        await setDoc(userStatusRef, {
          userId: currentUser.id,
          isOnline: true,
          lastSeen: serverTimestamp(),
          isTyping: {
            [chatId]: true,
          },
        }, { merge: true });
      } else {
        const userStatusDoc = await getDoc(userStatusRef);
        if (userStatusDoc.exists()) {
          const data = userStatusDoc.data();
          const isTyping = { ...data.isTyping };
          delete isTyping[chatId];
          
          await updateDoc(userStatusRef, {
            isTyping,
          });
        }
      }
    } catch (error: any) {
      console.error("Error setting typing status:", error);
    }
  },

  setCurrentChat: (chat: Chat | null) => {
    set({ currentChat: chat });
  },

  clearMessages: () => {
    set({ messages: {} });
  },

  clearError: () => {
    set({ error: null });
  },

  deleteChat: async (chatId: string) => {
    try {
      set({ isLoading: true, error: null });
      // Delete all messages in the chat
      const messagesRef = collection(db, "chats", chatId, "messages");
      const messagesSnap = await getDocs(messagesRef);
      const batchDeletes: Promise<any>[] = [];
      messagesSnap.forEach((docSnap) => {
        batchDeletes.push(deleteDoc(docSnap.ref));
      });
      await Promise.all(batchDeletes);
      // Delete the chat document
      await deleteDoc(doc(db, "chats", chatId));
      // Remove from local state
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        messages: Object.fromEntries(Object.entries(state.messages).filter(([id]) => id !== chatId)),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Reaction Actions
  addReaction: async (chatId: string, messageId: string, reaction: string) => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      const messageSnap = await getDoc(messageRef);
      
      if (!messageSnap.exists()) {
        throw new Error("Message not found");
      }

      const messageData = messageSnap.data();
      const reactions = messageData.reactions || [];
      
      // Check if user already has this reaction
      const existingReactionIndex = reactions.findIndex((r: any) => 
        r.userId === currentUser.id && r.reaction === reaction
      );

      let updatedReactions: MessageReaction[];
      if (existingReactionIndex !== -1) {
        // Remove existing reaction (toggle behavior)
        updatedReactions = reactions.filter((_: any, index: number) => index !== existingReactionIndex);
      } else {
        // Add new reaction
        updatedReactions = [...reactions, {
          userId: currentUser.id,
          userName: currentUser.name,
          reaction,
          timestamp: new Date(),
        }];
      }

      // Optimistically update the UI immediately
      const { messages } = get();
      const updatedMessages = messages[chatId]?.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: updatedReactions,
          };
        }
        return msg;
      }) || [];
      
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
      }));

      // Then update the database
      await updateDoc(messageRef, {
        reactions: updatedReactions,
      });
      
    } catch (error: any) {
      console.error("Error adding reaction:", error);
      
      // Revert optimistic update on error
      const { messages } = get();
      const originalMessages = messages[chatId]?.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions || [],
          };
        }
        return msg;
      }) || [];
      
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: originalMessages,
        },
      }));
      
      set({ error: error.message });
    }
  },

  removeReaction: async (chatId: string, messageId: string, reaction: string) => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      const messageSnap = await getDoc(messageRef);
      
      if (!messageSnap.exists()) {
        throw new Error("Message not found");
      }

      const messageData = messageSnap.data();
      const reactions = messageData.reactions || [];
      
      // Remove user's reaction
      const updatedReactions = reactions.filter((r: any) => 
        !(r.userId === currentUser.id && r.reaction === reaction)
      );

      // Optimistically update the UI immediately
      const { messages } = get();
      const updatedMessages = messages[chatId]?.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: updatedReactions,
          };
        }
        return msg;
      }) || [];
      
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
      }));

      // Then update the database
      await updateDoc(messageRef, {
        reactions: updatedReactions,
      });
      
    } catch (error: any) {
      console.error("Error removing reaction:", error);
      
      // Revert optimistic update on error
      const { messages } = get();
      const originalMessages = messages[chatId]?.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions || [],
          };
        }
        return msg;
      }) || [];
      
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: originalMessages,
        },
      }));
      
      set({ error: error.message });
    }
  },
})); 