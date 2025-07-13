import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { ref, push, set, onValue, off } from "firebase/database";
import { db, rtdb } from "./firebase";
import { useAuthStore } from "./auth-store";

// Types
export interface MessageReaction {
  userId: string;
  userName: string;
  reaction: string;
  timestamp: Date;
}

export interface CommunityMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: "user" | "expert" | "admin";
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  reactions?: MessageReaction[];
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
  role: "user" | "expert" | "admin";
  joinedAt: Date;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Community {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  description: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  createdBy: string;
  members: string[]; // Array of user IDs
  memberDetails: {
    [userId: string]: CommunityMember;
  };
}

export interface UserCommunityMembership {
  id: string;
  communityId: string;
  userId: string;
  joinedAt: Date;
  isActive: boolean;
}

interface CommunityState {
  communities: Community[];
  currentCommunity: Community | null;
  messages: CommunityMessage[];
  userMemberships: UserCommunityMembership[];
  isLoading: boolean;
  error: string | null;
  
  // Community Actions
  fetchCommunities: () => Promise<void>;
  fetchCommunityById: (communityId: string) => Promise<Community | null>;
  createCommunity: (country: string, countryCode: string) => Promise<string | null>;
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  setCurrentCommunity: (community: Community | null) => void;
  
  // Message Actions
  fetchMessages: (communityId: string) => Promise<void>;
  sendMessage: (communityId: string, content: string) => Promise<void>;
  editMessage: (communityId: string, messageId: string, content: string) => Promise<void>;
  deleteMessage: (communityId: string, messageId: string) => Promise<void>;
  
  // Reaction Actions
  addReaction: (communityId: string, messageId: string, reaction: string) => Promise<void>;
  removeReaction: (communityId: string, messageId: string, reaction: string) => Promise<void>;
  
  // Membership Actions
  fetchUserMemberships: () => Promise<void>;
  getCommunityMembers: (communityId: string) => Promise<CommunityMember[]>;
  
  // Utility Actions
  clearMessages: () => void;
  clearError: () => void;
  subscribeToCommunityMessages: (communityId: string) => (() => void);
  subscribeToCommunityMembers: (communityId: string) => (() => void);
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      communities: [],
      currentCommunity: null,
      messages: [],
      userMemberships: [],
      isLoading: false,
      error: null,

      // Community Actions
      fetchCommunities: async () => {
        set({ isLoading: true, error: null });
        try {
          const communitiesRef = collection(db, "communities");
          const q = query(communitiesRef, where("isActive", "==", true));
          const snapshot = await getDocs(q);
          
          const communities: Community[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            communities.push({
              id: doc.id,
              name: data.name,
              country: data.country,
              countryCode: data.countryCode,
              description: data.description,
              memberCount: data.memberCount || 0,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              isActive: data.isActive,
              createdBy: data.createdBy,
              members: data.members || [],
              memberDetails: data.memberDetails || {},
            });
          });
          
          // Sort communities by creation date (newest first)
          communities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          set({ communities, isLoading: false });
        } catch (error) {
          console.error("Error fetching communities:", error);
          set({ error: "Failed to fetch communities", isLoading: false });
        }
      },

      fetchCommunityById: async (communityId: string) => {
        try {
          const communityRef = doc(db, "communities", communityId);
          const communitySnap = await getDoc(communityRef);
          
          if (communitySnap.exists()) {
            const data = communitySnap.data();
            const community: Community = {
              id: communitySnap.id,
              name: data.name,
              country: data.country,
              countryCode: data.countryCode,
              description: data.description,
              memberCount: data.memberCount || 0,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              isActive: data.isActive,
              createdBy: data.createdBy,
              members: data.members || [],
              memberDetails: data.memberDetails || {},
            };
            return community;
          }
          return null;
        } catch (error) {
          console.error("Error fetching community:", error);
          set({ error: "Failed to fetch community" });
          return null;
        }
      },

      createCommunity: async (country: string, countryCode: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return null;
        }

        // Check if community already exists
        const existingCommunities = get().communities;
        const existingCommunity = existingCommunities.find(
          community => community.countryCode === countryCode
        );
        
        if (existingCommunity) {
          console.log(`Community for ${country} already exists`);
          return existingCommunity.id;
        }

        try {
          // Check if community already exists in Firebase
          const communitiesRef = collection(db, "communities");
          const existingQuery = query(communitiesRef, where("countryCode", "==", countryCode), where("isActive", "==", true));
          const existingSnapshot = await getDocs(existingQuery);
          
          if (!existingSnapshot.empty) {
            const existingDoc = existingSnapshot.docs[0];
            console.log(`Community for ${country} already exists in Firebase`);
            return existingDoc.id;
          }

          const communityData = {
            name: `${country} Community`,
            country,
            countryCode,
            description: `Connect with fellow ${country} residents and share your experiences!`,
            memberCount: 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isActive: true,
            createdBy: user.id,
            members: [user.id],
            memberDetails: {
              [user.id]: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                joinedAt: new Date(),
                isOnline: true,
                lastSeen: new Date(),
              }
            }
          };

          const docRef = await addDoc(collection(db, "communities"), communityData);
          
          // Add user membership
          await addDoc(collection(db, "userCommunityMemberships"), {
            communityId: docRef.id,
            userId: user.id,
            joinedAt: serverTimestamp(),
            isActive: true,
          });

          // Don't refresh communities list here to avoid infinite loops
          // The new community will be picked up by the existing fetchCommunities call
          
          return docRef.id;
        } catch (error) {
          console.error("Error creating community:", error);
          set({ error: "Failed to create community" });
          return null;
        }
      },

      joinCommunity: async (communityId: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }

        try {
          const communityRef = doc(db, "communities", communityId);
          const communitySnap = await getDoc(communityRef);
          
          if (!communitySnap.exists()) {
            set({ error: "Community not found" });
            return;
          }

          const communityData = communitySnap.data();
          const members = communityData.members || [];
          
          if (members.includes(user.id)) {
            set({ error: "Already a member of this community" });
            return;
          }

          // Check if user has an inactive membership (left the community before)
          const membershipsRef = collection(db, "userCommunityMemberships");
          const membershipQuery = query(
            membershipsRef,
            where("communityId", "==", communityId),
            where("userId", "==", user.id)
          );
          const membershipSnap = await getDocs(membershipQuery);
          
          if (!membershipSnap.empty) {
            // Reactivate existing membership
            const membershipDoc = membershipSnap.docs[0];
            await updateDoc(doc(db, "userCommunityMemberships", membershipDoc.id), {
              isActive: true,
            });
          } else {
            // Create new membership
            await addDoc(collection(db, "userCommunityMemberships"), {
              communityId,
              userId: user.id,
              joinedAt: serverTimestamp(),
              isActive: true,
            });
          }

          // Update community
          await updateDoc(communityRef, {
            members: arrayUnion(user.id),
            memberCount: (communityData.memberCount || 0) + 1,
            memberDetails: {
              ...communityData.memberDetails,
              [user.id]: {
                id: user.id,
                name: user.name,
                ...(user.avatar ? { avatar: user.avatar } : {}),
                role: user.role,
                joinedAt: new Date(),
                isOnline: true,
                lastSeen: new Date(),
              }
            },
            updatedAt: serverTimestamp(),
          });

          // Refresh user memberships to update the UI
          await get().fetchUserMemberships();
          
        } catch (error) {
          console.error("Error joining community:", error);
          set({ error: "Failed to join community" });
        }
      },

      leaveCommunity: async (communityId: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }

        try {
          const communityRef = doc(db, "communities", communityId);
          const communitySnap = await getDoc(communityRef);
          
          if (!communitySnap.exists()) {
            set({ error: "Community not found" });
            return;
          }

          const communityData = communitySnap.data();
          const members = communityData.members || [];
          
          if (!members.includes(user.id)) {
            set({ error: "Not a member of this community" });
            return;
          }

          // Update community
          const updatedMemberDetails = { ...communityData.memberDetails };
          delete updatedMemberDetails[user.id];

          await updateDoc(communityRef, {
            members: arrayRemove(user.id),
            memberCount: Math.max(0, (communityData.memberCount || 0) - 1),
            memberDetails: updatedMemberDetails,
            updatedAt: serverTimestamp(),
          });

          // Update user membership
          const membershipsRef = collection(db, "userCommunityMemberships");
          const membershipQuery = query(
            membershipsRef,
            where("communityId", "==", communityId),
            where("userId", "==", user.id)
          );
          const membershipSnap = await getDocs(membershipQuery);
          
          if (!membershipSnap.empty) {
            const membershipDoc = membershipSnap.docs[0];
            await updateDoc(doc(db, "userCommunityMemberships", membershipDoc.id), {
              isActive: false,
            });
          }

          // Clear current community if it's the one being left
          const { currentCommunity } = get();
          if (currentCommunity?.id === communityId) {
            set({ currentCommunity: null, messages: [] });
          }

          // Refresh user memberships to update the UI
          await get().fetchUserMemberships();
          
        } catch (error) {
          console.error("Error leaving community:", error);
          set({ error: "Failed to leave community" });
        }
      },

      setCurrentCommunity: (community: Community | null) => {
        set({ currentCommunity: community });
      },

      // Message Actions
      fetchMessages: async (communityId: string) => {
        set({ isLoading: true, error: null });
        
        // Check if user is a member of the community before fetching messages
        const { userMemberships } = get();
        const isMember = userMemberships.some(membership => 
          membership.communityId === communityId && membership.isActive
        );

        if (!isMember) {
          set({ error: "You must join the community before viewing messages", isLoading: false });
          return;
        }
        
        try {
          const messagesRef = collection(db, "communities", communityId, "messages");
          const q = query(messagesRef, orderBy("timestamp", "asc"), limit(100));
          const snapshot = await getDocs(q);
          
          const messages: CommunityMessage[] = [];
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
              edited: data.edited || false,
              editedAt: data.editedAt?.toDate(),
            });
          });
          
          set({ messages, isLoading: false });
        } catch (error) {
          console.error("Error fetching messages:", error);
          set({ error: "Failed to fetch messages", isLoading: false });
        }
      },

      sendMessage: async (communityId: string, content: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }

        // Check if user is a member of the community
        const { userMemberships } = get();
        const isMember = userMemberships.some(membership => 
          membership.communityId === communityId && membership.isActive
        );

        if (!isMember) {
          set({ error: "You must join the community before sending messages" });
          return;
        }

        try {
          const messageData = {
            content,
            senderId: user.id,
            senderName: user.name,
            ...(user.avatar ? { senderAvatar: user.avatar } : {}),
            senderRole: user.role,
            timestamp: serverTimestamp(),
            edited: false,
          };

          await addDoc(collection(db, "communities", communityId, "messages"), messageData);
          
          // Update community's updatedAt
          await updateDoc(doc(db, "communities", communityId), {
            updatedAt: serverTimestamp(),
          });
          
        } catch (error) {
          console.error("Error sending message:", error);
          set({ error: "Failed to send message" });
        }
      },

      editMessage: async (communityId: string, messageId: string, content: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }

        // Check if user is a member of the community
        const { userMemberships } = get();
        const isMember = userMemberships.some(membership => 
          membership.communityId === communityId && membership.isActive
        );

        if (!isMember) {
          set({ error: "You must join the community before editing messages" });
          return;
        }

        try {
          const messageRef = doc(db, "communities", communityId, "messages", messageId);
          const messageSnap = await getDoc(messageRef);
          
          if (!messageSnap.exists()) {
            set({ error: "Message not found" });
            return;
          }

          const messageData = messageSnap.data();
          if (messageData.senderId !== user.id) {
            set({ error: "You can only edit your own messages" });
            return;
          }

          await updateDoc(messageRef, {
            content,
            edited: true,
            editedAt: serverTimestamp(),
          });
          
        } catch (error) {
          console.error("Error editing message:", error);
          set({ error: "Failed to edit message" });
        }
      },

      deleteMessage: async (communityId: string, messageId: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }

        // Check if user is a member of the community
        const { userMemberships } = get();
        const isMember = userMemberships.some(membership => 
          membership.communityId === communityId && membership.isActive
        );

        if (!isMember) {
          set({ error: "You must join the community before deleting messages" });
          return;
        }

        try {
          const messageRef = doc(db, "communities", communityId, "messages", messageId);
          const messageSnap = await getDoc(messageRef);
          
          if (!messageSnap.exists()) {
            set({ error: "Message not found" });
            return;
          }

          const messageData = messageSnap.data();
          if (messageData.senderId !== user.id && user.role !== "admin") {
            set({ error: "You can only delete your own messages" });
            return;
          }

          await deleteDoc(messageRef);
          
        } catch (error) {
          console.error("Error deleting message:", error);
          set({ error: "Failed to delete message" });
        }
      },

      // Membership Actions
      fetchUserMemberships: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        try {
          const membershipsRef = collection(db, "userCommunityMemberships");
          const q = query(
            membershipsRef,
            where("userId", "==", user.id)
            // Removed the isActive filter to get both active and inactive memberships
          );
          const snapshot = await getDocs(q);
          
          const memberships: UserCommunityMembership[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            memberships.push({
              id: doc.id,
              communityId: data.communityId,
              userId: data.userId,
              joinedAt: data.joinedAt?.toDate() || new Date(),
              isActive: data.isActive,
            });
          });
          
          set({ userMemberships: memberships });
        } catch (error) {
          console.error("Error fetching user memberships:", error);
          set({ error: "Failed to fetch user memberships" });
        }
      },

      getCommunityMembers: async (communityId: string) => {
        try {
          const community = await get().fetchCommunityById(communityId);
          if (!community) return [];
          
          return Object.values(community.memberDetails);
        } catch (error) {
          console.error("Error fetching community members:", error);
          return [];
        }
      },

      // Utility Actions
      clearMessages: () => {
        set({ messages: [] });
      },

      clearError: () => {
        set({ error: null });
      },

      subscribeToCommunityMessages: (communityId: string) => {
        // Check if user is a member of the community before subscribing
        const { userMemberships } = get();
        const isMember = userMemberships.some(membership => 
          membership.communityId === communityId && membership.isActive
        );

        if (!isMember) {
          console.warn(`User is not a member of community ${communityId}, skipping subscription`);
          return () => {}; // Return empty unsubscribe function
        }

        const messagesRef = collection(db, "communities", communityId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"), limit(100));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messages: CommunityMessage[] = [];
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
              edited: data.edited || false,
              editedAt: data.editedAt?.toDate(),
              reactions: data.reactions?.map((r: any) => ({
                userId: r.userId,
                userName: r.userName,
                reaction: r.reaction,
                timestamp: r.timestamp?.toDate() || new Date(),
              })) || [],
            });
          });
          
          set({ messages });
        }, (error) => {
          console.error("Error subscribing to messages:", error);
        });

        return unsubscribe;
      },

      subscribeToCommunityMembers: (communityId: string) => {
        const communityRef = doc(db, "communities", communityId);
        
        const unsubscribe = onSnapshot(communityRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            const community: Community = {
              id: doc.id,
              name: data.name,
              country: data.country,
              countryCode: data.countryCode,
              description: data.description,
              memberCount: data.memberCount || 0,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              isActive: data.isActive,
              createdBy: data.createdBy,
              members: data.members || [],
              memberDetails: data.memberDetails || {},
            };
            
            set({ currentCommunity: community });
          }
        }, (error) => {
          console.error("Error subscribing to community members:", error);
        });

        return unsubscribe;
      },

      // Reaction Actions
      addReaction: async (communityId: string, messageId: string, reaction: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }

        try {
          // Check if user is a member of the community
          const { userMemberships } = get();
          const isMember = userMemberships.some(membership => 
            membership.communityId === communityId && membership.isActive
          );

          if (!isMember) {
            set({ error: "You must join the community before reacting to messages" });
            return;
          }

          const messageRef = doc(db, "communities", communityId, "messages", messageId);
          const messageSnap = await getDoc(messageRef);
          
          if (!messageSnap.exists()) {
            set({ error: "Message not found" });
            return;
          }

          const messageData = messageSnap.data();
          const reactions = messageData.reactions || [];
          
          // Check if user already has this reaction
          const existingReactionIndex = reactions.findIndex((r: any) => 
            r.userId === user.id && r.reaction === reaction
          );

          let updatedReactions;
          if (existingReactionIndex !== -1) {
            // Remove existing reaction (toggle behavior)
            updatedReactions = reactions.filter((_: any, index: number) => index !== existingReactionIndex);
          } else {
            // Add new reaction
            updatedReactions = [...reactions, {
              userId: user.id,
              userName: user.name,
              reaction,
              timestamp: new Date(),
            }];
          }

          // Optimistically update the UI immediately
          const { messages } = get();
          const updatedMessages = messages.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                reactions: updatedReactions,
              };
            }
            return msg;
          });
          set({ messages: updatedMessages });

          // Then update the database
          await updateDoc(messageRef, {
            reactions: updatedReactions,
          });
          
          set({ error: null }); // Clear any previous errors
          
        } catch (error: any) {
          console.error("Error adding reaction:", error);
          
          // Revert optimistic update on error
          const { messages } = get();
          const originalMessages = messages.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                reactions: msg.reactions || [],
              };
            }
            return msg;
          });
          set({ messages: originalMessages });
          
          if (error.code === 'permission-denied') {
            set({ error: "Permission denied. You may not have access to this community." });
          } else if (error.code === 'not-found') {
            set({ error: "Message or community not found." });
          } else {
            set({ error: `Failed to add reaction: ${error.message || 'Unknown error'}` });
          }
        }
      },

      removeReaction: async (communityId: string, messageId: string, reaction: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }

        try {
          const messageRef = doc(db, "communities", communityId, "messages", messageId);
          const messageSnap = await getDoc(messageRef);
          
          if (!messageSnap.exists()) {
            set({ error: "Message not found" });
            return;
          }

          const messageData = messageSnap.data();
          const reactions = messageData.reactions || [];
          
          // Remove user's reaction
          const updatedReactions = reactions.filter((r: any) => 
            !(r.userId === user.id && r.reaction === reaction)
          );

          // Optimistically update the UI immediately
          const { messages } = get();
          const updatedMessages = messages.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                reactions: updatedReactions,
              };
            }
            return msg;
          });
          set({ messages: updatedMessages });

          // Then update the database
          await updateDoc(messageRef, {
            reactions: updatedReactions,
          });
          
        } catch (error) {
          console.error("Error removing reaction:", error);
          
          // Revert optimistic update on error
          const { messages } = get();
          const originalMessages = messages.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                reactions: msg.reactions || [],
              };
            }
            return msg;
          });
          set({ messages: originalMessages });
          
          set({ error: "Failed to remove reaction" });
        }
      },
    }),
    {
      name: "community-storage",
      partialize: (state) => ({
        communities: state.communities,
        currentCommunity: state.currentCommunity,
        userMemberships: state.userMemberships,
      }),
    }
  )
); 