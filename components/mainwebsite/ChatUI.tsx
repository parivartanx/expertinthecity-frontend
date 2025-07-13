"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaSearch,
  FaCheck,
  FaPaperPlane,
  FaEllipsisH,
  FaArrowLeft,
  FaCircle,
  FaUserPlus,
  FaUsers,
  FaRegSmile,
  FaHeart,
  FaThumbsUp,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineAttachFile } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useUserStore } from "@/lib/mainwebsite/user-store";
import { useCommunityStore } from "@/lib/mainwebsite/community-store";
import StartChatModal from "./StartChatModal";
import { useFollowStore } from "@/lib/mainwebsite/follow-store";
import { toast } from "sonner";

// Types
interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: "USER" | "EXPERT";
  isOnline: boolean;
  lastSeen: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: "USER" | "EXPERT";
  timestamp: Date;
  readBy: string[];
  reactions?: {
    userId: string;
    userName: string;
    reaction: string;
    timestamp: Date;
  }[];
}

interface Chat {
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

const ChatUI = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showStartChatModal, setShowStartChatModal] = useState(false);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [reactionPickerOpen, setReactionPickerOpen] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { user: currentUser } = useAuthStore();
  const { fetchUserProfile } = useUserStore();
  
  const {
    chats,
    messages,
    fetchChats,
    fetchMessages,
    sendMessage,
    createChat,
    markMessageAsRead,
    setTypingStatus,
    addReaction,
    isLoading,
    currentChat,
    setCurrentChat,
    clearMessages,
    onlineUsers,
    typingUsers,
  } =   useChatStore();

  const { getFollowing, following, getFollowers, followers, isLoading: isFollowLoading } = useFollowStore();
  const { 
    communities, 
    userMemberships, 
    messages: communityMessages,
    fetchUserMemberships, 
    isLoading: isCommunityLoading 
  } = useCommunityStore();
  
  // Get the community the user has joined
  const userJoinedCommunity = React.useMemo(() => {
    if (!currentUser || !userMemberships.length) return null;
    
    const activeMembership = userMemberships.find(membership => membership.isActive);
    if (!activeMembership) return null;
    
    return communities.find(community => community.id === activeMembership.communityId);
  }, [currentUser, userMemberships, communities]);

  // Track unread community messages
  const [lastCommunityVisit, setLastCommunityVisit] = React.useState<Date | null>(null);
  const [unreadCommunityCount, setUnreadCommunityCount] = React.useState(0);

  // Calculate unread community messages
  React.useEffect(() => {
    if (!userJoinedCommunity || !communityMessages.length || !lastCommunityVisit) {
      setUnreadCommunityCount(0);
      return;
    }

    const unreadMessages = communityMessages.filter(message => 
      message.timestamp > lastCommunityVisit && message.senderId !== currentUser?.id
    );
    
    setUnreadCommunityCount(unreadMessages.length);
  }, [userJoinedCommunity, communityMessages, lastCommunityVisit, currentUser]);

  // Load last visit time from localStorage
  React.useEffect(() => {
    if (userJoinedCommunity) {
      const stored = localStorage.getItem(`community_visit_${userJoinedCommunity.id}`);
      if (stored) {
        setLastCommunityVisit(new Date(stored));
      } else {
        // If no stored visit time, set to 24 hours ago to show recent messages
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        setLastCommunityVisit(yesterday);
      }
    }
  }, [userJoinedCommunity]);

  // Update visit time when user clicks on community button
  const handleCommunityClick = () => {
    if (userJoinedCommunity) {
      const now = new Date();
      setLastCommunityVisit(now);
      localStorage.setItem(`community_visit_${userJoinedCommunity.id}`, now.toISOString());
      setUnreadCommunityCount(0);
    }
    router.push("/community");
  };

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch chats and user profile on mount
  useEffect(() => {
    if (currentUser) {
      fetchChats();
      fetchUserProfile();
      fetchUserMemberships();
    }
    
    // Cleanup messages listener on unmount
    return () => {
      clearMessages();
    };
  }, [currentUser, fetchChats, fetchUserProfile, fetchUserMemberships, clearMessages]);

  // Subscribe to community messages when user has joined a community
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    // Only subscribe if user has actually joined the community (has active membership)
    if (userJoinedCommunity && userMemberships.some(membership => 
      membership.communityId === userJoinedCommunity.id && membership.isActive
    )) {
      const { subscribeToCommunityMessages } = useCommunityStore.getState();
      unsubscribe = subscribeToCommunityMessages(userJoinedCommunity.id);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userJoinedCommunity, userMemberships]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
      const chat = chats.find((c: Chat) => c.id === selectedChatId) || null;
      setCurrentChat(chat);
    }
  }, [selectedChatId, chats, fetchMessages, setCurrentChat]);

  // Handle typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping && selectedChatId) {
      setTypingStatus(selectedChatId, true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingStatus(selectedChatId, false);
      }, 3000);
    } else if (!isTyping && selectedChatId) {
      setTypingStatus(selectedChatId, false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, selectedChatId, setTypingStatus]);

  // Fetch followings and followers when modal opens
  useEffect(() => {
    if (showFollowingsModal) {
      getFollowing(1, 100); // Fetch up to 100 followings
      getFollowers(1, 100); // Fetch up to 100 followers
    }
  }, [showFollowingsModal, getFollowing, getFollowers]);

  // Combine and deduplicate users (by id)
  const allPossibleUsers = React.useMemo(() => {
    const users = [...following, ...followers];
    const seen = new Set();
    return users.filter(user => {
      if (seen.has(user.id)) return false;
      seen.add(user.id);
      return true;
    });
  }, [following, followers]);

  // Filter by search
  const filteredUsers = allPossibleUsers.filter(user =>
    user.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filtered chats for search
  const filteredChats = chats.filter((chat: Chat) => {
    if (!chat.participantDetails) return false;
    
    const participantMatch = Object.values(chat.participantDetails).some(
      (participant: ChatParticipant) =>
        participant.name?.toLowerCase().includes(search.toLowerCase())
    );
    
    const messageMatch = chat.lastMessage?.content?.toLowerCase().includes(search.toLowerCase()) || false;
    
    return participantMatch || messageMatch;
  });

  // DEBUG: Log chats array to diagnose sidebar issue
  console.log("Sidebar chats:", chats);

  // Get other participant in chat
  const getOtherParticipant = useCallback((chat: Chat): ChatParticipant | null => {
    if (!currentUser || !chat.participantDetails) return null;
    return Object.values(chat.participantDetails).find(
      (participant: ChatParticipant) => participant.id !== currentUser.id
    ) || null;
  }, [currentUser]);

  // Handle send message
  const handleSend = useCallback(async () => {
    if (!input.trim() || !selectedChatId || !currentUser) return;
    
    await sendMessage(selectedChatId, input);
    setInput("");
    setIsTyping(false);
  }, [input, selectedChatId, currentUser, sendMessage]);

  // Handle input change for typing indicator
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  }, [isTyping]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Close reaction picker if clicking outside
      if (reactionPickerOpen && !target.closest('.reaction-picker')) {
        setReactionPickerOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reactionPickerOpen]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (selectedChatId && messages[selectedChatId] && currentUser) {
      const unreadMessages = messages[selectedChatId].filter(
        (msg: ChatMessage) => !msg.readBy.includes(currentUser.id)
      );
      
      unreadMessages.forEach((msg: ChatMessage) => {
        markMessageAsRead(selectedChatId, msg.id);
      });
    }
  }, [selectedChatId, messages, currentUser, markMessageAsRead]);

  // Available reactions
  const reactions = [
    { emoji: "👍", icon: FaThumbsUp, name: "thumbs_up" },
    { emoji: "❤️", icon: FaHeart, name: "heart" },
    { emoji: "😂", icon: FaLaugh, name: "laugh" },
    { emoji: "😮", icon: FaSurprise, name: "surprise" },
    { emoji: "😢", icon: FaSadTear, name: "sad" },
    { emoji: "😠", icon: FaAngry, name: "angry" },
  ];

  // Handle reaction
  const handleReaction = async (messageId: string, reaction: string) => {
    if (!selectedChatId) return;
    
    try {
      await addReaction(selectedChatId, messageId, reaction);
      setReactionPickerOpen(null);
    } catch (error) {
      console.error("Error in handleReaction:", error);
      toast.error("Failed to add reaction");
    }
  };

  // Get user's reaction for a message
  const getUserReaction = (message: ChatMessage) => {
    if (!currentUser || !message.reactions) return null;
    return message.reactions.find((r) => r.userId === currentUser.id);
  };

  // Get reaction count for a specific reaction
  const getReactionCount = (message: ChatMessage, reaction: string) => {
    if (!message.reactions) return 0;
    return message.reactions.filter((r) => r.reaction === reaction).length;
  };

  // Format timestamp
  const formatTimestamp = useCallback((timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Chat list item component
  const ChatListItem = ({ chat, isPinned = false }: { chat: Chat; isPinned?: boolean }) => {
    const otherParticipant = getOtherParticipant(chat);
    const isSelected = selectedChatId === chat.id;
    const unreadCount = currentUser ? chat.unreadCount[currentUser.id] || 0 : 0;

    return (
      <div
        className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl cursor-pointer transition-colors ${
          isSelected ? "bg-[#F7F9FB]" : "hover:bg-[#F7F9FB]"
        }`}
        onClick={() => {
          setSelectedChatId(chat.id);
          setSidebarOpen(false);
        }}
      >
        <div className="relative">
          <img
            src={otherParticipant?.avatar || "/default-avatar.png"}
            alt={otherParticipant?.name || "User"}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          {otherParticipant && onlineUsers.has(otherParticipant.id) && (
            <FaCircle className="absolute -bottom-1 -right-1 text-green-500 text-xs bg-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm md:text-base text-[#222] truncate">
              {otherParticipant?.name || "Unknown User"}
            </span>
            {isPinned && <BsPinAngleFill className="text-green-600 text-xs flex-shrink-0" />}
            {otherParticipant?.role && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                {otherParticipant.role}
              </span>
            )}
          </div>
          <div className="text-xs text-[#BDBDBD] truncate">
            {chat.lastMessage?.content || "No messages yet"}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-[#BDBDBD]">
            {chat.lastMessage?.timestamp ? formatTimestamp(chat.lastMessage.timestamp) : ""}
          </span>
          {unreadCount > 0 && (
            <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Message component
  const MessageItem = ({ message }: { message: ChatMessage }) => {
    const isOwnMessage = message.senderId === currentUser?.id;
    const isRead = message.readBy.length > 1;
    const isReactionPickerOpen = reactionPickerOpen === message.id;
    const userReaction = getUserReaction(message);

    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        <div className="flex flex-col max-w-[85vw] md:max-w-[60%]">
          <div className="relative group">
            <div
              className={`px-3 md:px-5 py-2 md:py-3 rounded-2xl ${
                isOwnMessage
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white text-[#222] rounded-bl-none"
              } shadow-sm text-sm md:text-base`}
            >
              <span>{message.content}</span>
            </div>
            
            {/* Reaction button - appears on hover */}
            <div className={`absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              isOwnMessage ? 'right-2' : 'left-2'
            }`}>
              <button
                onClick={() => setReactionPickerOpen(isReactionPickerOpen ? null : message.id)}
                className="reaction-picker bg-white rounded-full p-1 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <FaRegSmile className="text-gray-600 text-sm" />
              </button>
              
              {/* Reaction picker */}
              {isReactionPickerOpen && (
                <div 
                  className={`reaction-picker absolute bottom-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-1 z-20 ${
                    isOwnMessage ? 'right-0' : 'left-0'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-1">
                    {reactions.map((reaction) => (
                      <button
                        key={reaction.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(message.id, reaction.name);
                        }}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title={reaction.name}
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Reactions display */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              {reactions.map((reaction) => {
                const count = getReactionCount(message, reaction.name);
                const hasUserReaction = userReaction?.reaction === reaction.name;
                
                if (count === 0) return null;
                
                return (
                  <button
                    key={reaction.name}
                    onClick={() => handleReaction(message.id, reaction.name)}
                    className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors ${
                      hasUserReaction 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          )}
          
          <div className={`flex items-center gap-1 mt-1 text-xs text-[#BDBDBD] ${
            isOwnMessage ? "justify-end" : "justify-start"
          }`}>
            <span>{formatTimestamp(message.timestamp)}</span>
            {isOwnMessage && (
              <div className="flex items-center gap-1">
                {isRead ? (
                  <FaCheck className="text-blue-500" />
                ) : (
                  <FiCheck className="text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Sidebar content
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-6">
        <h2 className="text-xl md:text-2xl font-bold text-green-600">Chats</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFollowingsModal(true)}
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
            title="Start chat with following expert"
          >
            <FaUserPlus className="text-sm" />
          </button>
          <button
            onClick={() => setShowStartChatModal(true)}
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
            title="Start new chat"
          >
            <FaSearch className="text-sm" />
          </button>
          <IoIosNotificationsOutline
            onClick={() => router.push("/notifications")}
            className="text-[#BDBDBD] text-xl md:text-2xl cursor-pointer hover:text-gray-600 transition-colors"
          />
        </div>
      </div>
      {/* Search Bar */}
      <div className="px-4 md:px-6 pb-2 pt-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full px-3 md:px-4 py-2 rounded-lg border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-sm"
          />
          <FaSearch className="absolute right-3 top-2.5 text-[#BDBDBD] text-lg" />
        </div>
      </div>
      {/* All Messages */}
      <div className="px-4 md:px-6 pt-4 pb-2 text-xs text-[#BDBDBD] font-semibold">
        All Messages
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 px-2 pb-4">
        {filteredChats
          .filter((chat: Chat) => chat.isActive)
          .map((chat: Chat) => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
      </div>
      {/* Sticky Join Community Button */}
      <div className="sticky bottom-0 left-0 w-full flex justify-center bg-white py-3 z-10 border-t border-[#E6E6E6]">
        {isCommunityLoading ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-full text-sm md:text-base">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span>Loading...</span>
          </div>
        ) : userJoinedCommunity ? (
          <button
            onClick={handleCommunityClick}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm md:text-base"
          >
            <HiOutlineUserGroup className="text-xl md:text-2xl" />
            <span>{userJoinedCommunity.name}</span>
            {unreadCommunityCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {unreadCommunityCount}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => router.push("/community")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full shadow-md hover:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm md:text-base"
          >
            <HiOutlineUserGroup className="text-xl md:text-2xl" />
            <span>Join Our Community</span>
          </button>
        )}
      </div>
    </>
  );

  // Get current chat participant
  const currentChatParticipant = currentChat ? getOtherParticipant(currentChat) : null;
  const isCurrentParticipantOnline = currentChatParticipant && onlineUsers.has(currentChatParticipant.id);
  const isCurrentParticipantTyping = selectedChatId && 
    currentChatParticipant && 
    typingUsers[selectedChatId]?.has(currentChatParticipant.id);

  // Modal for selecting any user (following or follower)
  const FollowingsModal = () => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${showFollowingsModal ? "" : "hidden"}`}
      onClick={() => setShowFollowingsModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowFollowingsModal(false)}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4">Start Chat with User You Follow or Follows You</h3>
        <input
          type="text"
          className="w-full mb-3 px-3 py-2 border rounded"
          placeholder="Search users..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
        />
        {isFollowLoading ? (
          <div>Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
            {filteredUsers.map(user => (
              <li
                key={user.id}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-green-50 px-2 rounded"
                onClick={async () => {
                  setShowFollowingsModal(false);
                  // Check if chat already exists
                  let chat = chats.find((c) => c.participants.includes(user.id));
                  let chatId;
                  if (!chat) {
                    chatId = await createChat([user.id]);
                    if (!chatId) return;
                    chat = { id: chatId } as any;
                  } else {
                    chatId = chat.id;
                  }
                  setSelectedChatId(chatId);
                }}
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#F7F9FB] font-sans pt-[60px]">
      {/* Sidebar (Left) */}
      <div className="hidden md:flex flex-col w-[360px] h-full bg-white border-r border-[#E6E6E6] shadow-md">
        {/* Sidebar Header */}
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b border-[#E6E6E6] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-600">Chats</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFollowingsModal(true)}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                title="Start chat with following expert"
              >
                <FaUserPlus className="text-sm" />
              </button>
              <button
                onClick={() => setShowStartChatModal(true)}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                title="Start new chat"
              >
                <FaSearch className="text-sm" />
              </button>
            </div>
            </div>
          {/* Future: Tabs/Filters (All, Unread, etc.) */}
          {/* <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">All</button>
            <button className="px-3 py-1 rounded-full text-[#BDBDBD] font-semibold text-xs">Unread</button>
          </div> */}
          {/* Search Bar */}
          <div className="relative mt-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full px-4 py-2 rounded-lg border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-sm"
            />
            <FaSearch className="absolute right-3 top-2.5 text-[#BDBDBD] text-lg" />
          </div>
        </div>
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">
          <div className="text-xs text-[#BDBDBD] font-semibold px-2 mb-2">All Messages</div>
          {filteredChats
            .filter((chat: Chat) => chat.isActive)
            .map((chat: Chat) => (
              <ChatListItem key={chat.id} chat={chat} />
            ))}
        </div>
        {/* Sticky Join Community Button */}
        <div className="sticky bottom-0 left-0 w-full flex justify-center bg-white py-3 z-10 border-t border-[#E6E6E6]">
          {isCommunityLoading ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-full text-sm md:text-base">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              <span>Loading...</span>
            </div>
          ) : userJoinedCommunity ? (
            <button
              onClick={handleCommunityClick}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm md:text-base"
            >
              <HiOutlineUserGroup className="text-xl md:text-2xl" />
              <span>{userJoinedCommunity.name}</span>
              {unreadCommunityCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {unreadCommunityCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => router.push("/community")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full shadow-md hover:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm md:text-base"
            >
              <HiOutlineUserGroup className="text-xl md:text-2xl" />
              <span>Join Our Community</span>
            </button>
          )}
        </div>
        </div>

      {/* Main Chat Area (Right) */}
      <div className="flex-1 flex flex-col h-full bg-[#F7F9FB]">
        {selectedChatId && (
          <div className="sticky top-0 z-20 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6] bg-white">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={currentChatParticipant?.avatar || "/default-avatar.png"}
                    alt={currentChatParticipant?.name || "Chat"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isCurrentParticipantOnline && (
                    <FaCircle className="absolute -bottom-1 -right-1 text-green-500 text-sm bg-white rounded-full" />
                  )}
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <span className="font-semibold text-lg text-[#222]">
                    {currentChatParticipant?.name || "Select a chat"}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCurrentParticipantOnline ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <FaCircle className="text-green-500 text-xs" />
                        Online
                      </span>
                    ) : (
                      <span className="text-xs text-[#BDBDBD]">
                        {currentChatParticipant?.lastSeen
                          ? `Last seen ${new Date(currentChatParticipant.lastSeen).toLocaleString()}`
                          : "Offline"}
                      </span>
                    )}
                    {currentChatParticipant?.role && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {currentChatParticipant.role}
                      </span>
                    )}
                  </div>
                  {/* Typing indicator */}
                  {isCurrentParticipantTyping && (
                    <span className="text-xs text-[#BDBDBD] italic">typing...</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaEllipsisH className="text-[#BDBDBD] text-lg cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 min-h-0 max-h-full overflow-y-auto px-8 py-6 flex flex-col gap-4 w-full max-w-full">
            {!selectedChatId ? (
              <div className="flex justify-center items-center h-full text-[#222] bg-gradient-to-br from-green-50 to-blue-50">
                <div className="text-center max-w-lg mx-auto px-6 py-12 rounded-3xl shadow-lg bg-white/80 border border-green-100">
                  <div className="flex justify-center mb-6">
                    <span className="inline-block bg-green-100 rounded-full p-6 shadow-md">
                      <FaUsers className="text-green-600 text-5xl" />
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold mb-2">
                    {currentUser?.role === "EXPERT"
                      ? "Connect with Users Seeking Your Expertise!"
                      : "Start a Conversation with Top Experts!"}
                  </h2>
                  <p className="text-lg text-[#555] mb-6">
                    {currentUser?.role === "EXPERT"
                      ? "Share your knowledge, answer questions, and grow your network."
                      : "Get advice, learn new things, and connect with real experts from around the world."}
                  </p>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl text-lg shadow transition-colors mb-4"
                    onClick={() => {
                      if (currentUser?.role === "EXPERT") {
                        setShowStartChatModal(true); // For experts, open start chat modal
                      } else {
                        router.push("/experts"); // For users, go to experts page
                      }
                    }}
                  >
                    {currentUser?.role === "EXPERT" ? "See User Questions" : "Find an Expert"}
                  </button>
                  <div className="mt-6 text-sm text-[#888] italic">
                    {currentUser?.role === "EXPERT"
                      ? "Over 10,000 questions answered by our experts!"
                      : "Experts from 20+ countries are here to help you."}
                  </div>
                </div>
              </div>
            ) : messages[selectedChatId]?.length === 0 ? (
              <div className="flex justify-center text-[#BDBDBD]">No messages yet. Start the conversation!</div>
            ) : (
              messages[selectedChatId]?.map((message: ChatMessage) => (
                <MessageItem key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        {selectedChatId && (
          <div className="sticky bottom-0 left-0 w-full z-20 bg-white shadow-md">
            <div className="flex items-center gap-4 px-8 py-6 bg-white border-t border-[#E6E6E6] w-full">
              <MdOutlineAttachFile className="text-[#BDBDBD] text-2xl cursor-pointer hover:text-gray-600 transition-colors" />
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 px-4 py-3 rounded-xl border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-base"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                disabled={!selectedChatId}
              />
              <FaPaperPlane
                className={`text-2xl cursor-pointer transition-colors ${
                  input.trim() && selectedChatId ? "text-green-600 hover:text-green-700" : "text-[#BDBDBD]"
                }`}
                onClick={handleSend}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Drawer */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-[70px] right-2 z-30 bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open chat sidebar"
        >
          <FaSearch />
        </button>
      )}
      <div
        className={`fixed inset-0 z-40 flex transition-all duration-300 ${
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ visibility: sidebarOpen ? "visible" : "hidden" }}
      >
        <div
          className={`w-72 bg-white h-full flex flex-col p-0 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#E6E6E6]">
            <h2 className="text-xl font-bold text-green-600">Chats</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-green-600 text-2xl"
              aria-label="Close chat sidebar"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <SidebarContent />
          </div>
        </div>
        <div
          className={`flex-1 bg-black bg-opacity-40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Start Chat Modal */}
      <StartChatModal
        isOpen={showStartChatModal}
        onClose={() => setShowStartChatModal(false)}
        onChatStarted={(chatId) => {
          setSelectedChatId(chatId);
          setShowStartChatModal(false);
        }}
      />
      {/* Followings Modal */}
      <FollowingsModal />
    </div>
  );
};

export default ChatUI;
