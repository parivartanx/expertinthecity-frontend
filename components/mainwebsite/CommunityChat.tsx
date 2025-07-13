"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaUsers,
  FaHashtag,
  FaPaperPlane,
  FaRegSmile,
  FaArrowLeft,
  FaSearch,
  FaGlobe,
  FaFlag,
  FaUserPlus,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaHeart,
  FaThumbsUp,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import { MdOutlineAttachFile } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/lib/mainwebsite/community-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { getUserCountry, formatCountryWithFlag, type CountryInfo } from "@/lib/utils";
import { useCountryDetection } from "@/hooks/use-country-detection";
import { toast } from "sonner";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/mainwebsite/firebase";

const CommunityChat = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  const [reactionPickerOpen, setReactionPickerOpen] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isRealtimeMember, setIsRealtimeMember] = useState<boolean | null>(null);

  const { user: currentUser } = useAuthStore();
  const {
    communities,
    currentCommunity,
    messages,
    userMemberships,
    isLoading,
    error,
    fetchCommunities,
    fetchCommunityById,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    setCurrentCommunity,
    fetchMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    fetchUserMemberships,
    subscribeToCommunityMessages,
    subscribeToCommunityMembers,
    clearMessages,
    clearError,
  } = useCommunityStore();

  // Use country detection hook
  const { getUserCountryInfo, isDetecting } = useCountryDetection();

  // Available reactions
  const reactions = [
    { emoji: "👍", icon: FaThumbsUp, name: "thumbs_up" },
    { emoji: "❤️", icon: FaHeart, name: "heart" },
    { emoji: "😂", icon: FaLaugh, name: "laugh" },
    { emoji: "😮", icon: FaSurprise, name: "surprise" },
    { emoji: "😢", icon: FaSadTear, name: "sad" },
    { emoji: "😠", icon: FaAngry, name: "angry" },
  ];

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch communities and user memberships on mount
  useEffect(() => {
    if (currentUser) {
      fetchCommunities();
      fetchUserMemberships();
    }
  }, [currentUser, fetchCommunities, fetchUserMemberships]);

  // Auto-create community for user's country if it doesn't exist
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);
  
  useEffect(() => {
    if (currentUser && !isDetecting && communities.length >= 0 && !isCreatingCommunity) {
      const userCountry = getUserCountryInfo();
      const existingCommunity = communities.find(
        community => community.countryCode === userCountry.code
      );

      if (!existingCommunity) {
        // Auto-create community for user's country
        setIsCreatingCommunity(true);
        createCommunity(userCountry.name, userCountry.code).finally(() => {
          setIsCreatingCommunity(false);
        });
      }
    }
  }, [currentUser, communities.length, createCommunity, getUserCountryInfo, isDetecting, isCreatingCommunity]);

  // Subscribe to messages and members when community is selected
  useEffect(() => {
    let unsubscribeMessages: (() => void) | null = null;
    let unsubscribeMembers: (() => void) | null = null;

    if (currentCommunity?.id) {
      unsubscribeMessages = subscribeToCommunityMessages(currentCommunity.id);
      unsubscribeMembers = subscribeToCommunityMembers(currentCommunity.id);
    }

    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeMembers) unsubscribeMembers();
    };
  }, [currentCommunity?.id]);

  // Real-time membership listener
  useEffect(() => {
    if (!currentUser || !currentCommunity) {
      setIsRealtimeMember(null);
      return;
    }
    const membershipsRef = collection(db, "userCommunityMemberships");
    const q = query(
      membershipsRef,
      where("userId", "==", currentUser.id),
      where("communityId", "==", currentCommunity.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setIsRealtimeMember(!!doc.data().isActive);
      } else {
        setIsRealtimeMember(false);
      }
    });
    return () => unsubscribe();
  }, [currentUser, currentCommunity]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Close message menu and reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Close message menu if clicking outside
      if (messageMenuOpen && !target.closest('.message-menu')) {
        setMessageMenuOpen(null);
      }
      // Close reaction picker if clicking outside
      if (reactionPickerOpen && !target.closest('.reaction-picker')) {
        setReactionPickerOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [messageMenuOpen, reactionPickerOpen]);

  // Play notification sound and show toast for new messages from others
  useEffect(() => {
    if (!currentCommunity || !messages.length) return;
    
    // Only show notifications if user is a member of the community
    const isMember = userMemberships.some(membership => 
      membership.communityId === currentCommunity.id && membership.isActive
    );
    
    if (!isMember) return;
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId !== currentUser?.id) {
      audioRef.current?.play();
      toast.info(`New message in ${currentCommunity.name}: ${lastMsg.senderName}: ${lastMsg.content}`);
    }
  }, [messages, currentCommunity, currentUser, userMemberships]);

  // Handle send message
  const handleSend = useCallback(async () => {
    if (!input.trim() || !currentCommunity) return;
    
    if (editingMessage) {
      // Update existing message
      await editMessage(currentCommunity.id, editingMessage, input);
      setEditingMessage(null);
      setInput("");
      toast.success("Message updated!");
    } else {
      // Send new message
      await sendMessage(currentCommunity.id, input);
      setInput("");
    }
  }, [input, currentCommunity, sendMessage, editingMessage, editMessage]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Escape" && editingMessage) {
      e.preventDefault();
      setEditingMessage(null);
      setInput("");
    }
  }, [handleSend, editingMessage]);

  // Handle join community
  const handleJoinCommunity = useCallback(async (community: any) => {
    await joinCommunity(community.id);
    setCurrentCommunity(community);
    fetchMessages(community.id);
    toast.success(`Joined ${community.name}!`);
    // Removed fetchCommunities() and fetchCommunityById() to avoid overwriting real-time state
  }, [joinCommunity, setCurrentCommunity, fetchMessages]);

  // Handle leave community
  const handleLeaveCommunity = async () => {
    if (!currentCommunity) return;
    
    // Show confirmation dialog
    setShowLeaveConfirmation(true);
  };

  // Handle leave community confirmation
  const handleLeaveCommunityConfirm = async () => {
    if (!currentCommunity) return;
    try {
      await leaveCommunity(currentCommunity.id);
      clearMessages();
      await fetchUserMemberships();
      // Removed fetchCommunities() and fetchCommunityById() to avoid overwriting real-time state
      setShowLeaveConfirmation(false);
      toast.success(`Left ${currentCommunity.name}`);
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error("Failed to leave community");
    }
  };



  // Handle delete message
  const handleDeleteMessage = async (messageId: string) => {
    if (!currentCommunity) return;
    
    await deleteMessage(currentCommunity.id, messageId);
    toast.success("Message deleted!");
  };

  // Handle reaction
  const handleReaction = async (messageId: string, reaction: string) => {
    if (!currentCommunity) {
      console.error("No current community selected");
      return;
    }
    
    if (!currentUser) {
      console.error("No current user");
      toast.error("Please log in to react to messages");
      return;
    }
    
    // Check membership status
    const isMember = userMemberships.some(membership => 
      membership.communityId === currentCommunity.id && membership.isActive
    );
    
    if (!isMember && isRealtimeMember !== true) {
      console.error("User is not a member of the community");
      toast.error("You must be a member to react to messages");
      return;
    }
    
    try {
      await addReaction(currentCommunity.id, messageId, reaction);
      setReactionPickerOpen(null);
    } catch (error) {
      console.error("Error in handleReaction:", error);
      toast.error("Failed to add reaction");
    }
  };

  // Get user's reaction for a message
  const getUserReaction = (message: any) => {
    if (!currentUser || !message.reactions) return null;
    return message.reactions.find((r: any) => r.userId === currentUser.id);
  };

  // Get reaction count for a specific reaction
  const getReactionCount = (message: any, reaction: string) => {
    if (!message.reactions) return 0;
    return message.reactions.filter((r: any) => r.reaction === reaction).length;
  };

  // Filter communities by search
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(search.toLowerCase()) ||
    community.country.toLowerCase().includes(search.toLowerCase())
  );

  // Check if user is member of a community
  const isMemberOfCommunity = (communityId: string) => {
    return userMemberships.some(membership => 
      membership.communityId === communityId && membership.isActive
    );
  };

  // Check if user has left a community (has inactive membership)
  const hasLeftCommunity = (communityId: string) => {
    return userMemberships.some(membership => 
      membership.communityId === communityId && !membership.isActive
    );
  };

  // Get user's country info
  const userCountryInfo = getUserCountryInfo();

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Community list item component
  const CommunityListItem = ({ community }: { community: any }) => {
    const isMember = isMemberOfCommunity(community.id);
    const hasLeft = hasLeftCommunity(community.id);
    const isSelected = currentCommunity?.id === community.id;
    const isUserCountry = userCountryInfo.code === community.countryCode;

    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer mb-2 transition-all duration-150 max-w-[90vw] md:max-w-[40vw] ${
          isSelected
            ? "bg-green-50 border-l-4 border-green-600"
            : "hover:bg-[#F7F9FB]"
        }`}
        style={{ wordBreak: "break-word" }}
        onClick={() => {
          setCurrentCommunity(community);
          if (isMember) {
            fetchMessages(community.id);
          }
        }}
      >
        <div className="flex items-center gap-2">
          <FaHashtag className="text-green-600 text-lg" />
          {isUserCountry && (
            <FaFlag className="text-blue-500 text-sm" title="Your country" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-[#222] flex items-center gap-2 min-w-0 whitespace-nowrap overflow-hidden">
            <span className="truncate">{community.name}</span>
            {isUserCountry && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                Your Country
              </span>
            )}
            {hasLeft && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                Left
              </span>
            )}
          </div>
          <div className="text-xs text-[#BDBDBD] break-words">{community.description}</div>
          <div className="text-xs text-[#BDBDBD] flex items-center gap-2 mt-1">
            <FaUsers className="text-xs" />
            {community.memberCount} members
          </div>
        </div>
        {!isMember && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleJoinCommunity(community);
            }}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              hasLeft 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {hasLeft ? "Rejoin" : "Join"}
          </button>
        )}
      </div>
    );
  };

  // Message component
  const MessageItem = ({ message }: { message: any }) => {
    const isOwnMessage = message.senderId === currentUser?.id;
    const isEditing = editingMessage === message.id;
    const isMenuOpen = messageMenuOpen === message.id;
    const isReactionPickerOpen = reactionPickerOpen === message.id;
    const userReaction = getUserReaction(message);

    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        <div className="flex flex-col max-w-[95vw] md:max-w-[60vw]">
          <div
            className={`flex items-end gap-3 max-w-[90vw] md:max-w-[40vw] ${
              isOwnMessage ? "flex-row-reverse" : ""
            }`}
          >
            <img
              src={message.senderAvatar || "/default-avatar.png"}
              alt={message.senderName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
            <div className="relative">
              <div className={`relative group ${isEditing ? 'bg-yellow-50 rounded-lg p-2' : ''}`}>
                <div
                  className={`px-5 py-3 rounded-2xl break-words ${
                    isOwnMessage
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-white text-[#222] rounded-bl-none"
                  } shadow-sm`}
                  style={{ wordBreak: "break-word" }}
                >
                  <span>{message.content}</span>
                  {message.edited && (
                    <span className="text-xs opacity-70 ml-2">(edited)</span>
                  )}
                </div>
                
                {/* Reaction button - appears on hover */}
                <div className="absolute -bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => setReactionPickerOpen(isReactionPickerOpen ? null : message.id)}
                    className="reaction-picker bg-white rounded-full p-1 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <FaRegSmile className="text-gray-600 text-sm" />
                  </button>
                  
                  {/* Reaction picker */}
                  {isReactionPickerOpen && (
                    <div 
                      className="reaction-picker absolute bottom-8 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-1 z-20"
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
                
                {/* WhatsApp-style dropdown arrow - only for own messages */}
                {isOwnMessage && !isEditing && (
                  <div className="message-menu absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setMessageMenuOpen(isMenuOpen ? null : message.id)}
                      className={`p-1 rounded-full transition-colors ${
                        isOwnMessage 
                          ? "text-white hover:bg-green-700" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaChevronDown className={`text-xs transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown menu */}
                    {isMenuOpen && (
                      <div 
                        className="message-menu absolute top-8 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setEditingMessage(message.id);
                            setInput(message.content);
                            setMessageMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FaEdit className="text-xs" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteMessage(message.id);
                            setMessageMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
              
              <div
                className={`text-xs mt-1 ${
                  isOwnMessage
                    ? "text-right text-green-600"
                    : "text-[#BDBDBD]"
                }`}
              >
                {message.senderName} • {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar content
  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <FaUsers className="text-green-600 text-2xl" />
        <h2 className="text-2xl font-bold text-green-600">Communities</h2>
      </div>
      <div className="px-6 pb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full px-4 py-2 rounded-lg border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-sm"
          />
          <CiSearch className="absolute right-3 top-2.5 text-[#BDBDBD] text-lg" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {isLoading ? (
          <div className="text-center py-4 text-[#BDBDBD]">Loading communities...</div>
        ) : filteredCommunities.length === 0 ? (
          <div className="text-center py-4 text-[#BDBDBD]">No communities found</div>
        ) : (
          filteredCommunities.map((community) => (
            <CommunityListItem key={community.id} community={community} />
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-[#F7F9FB] font-sans pt-[60px]">
      {/* Sidebar for desktop/tablet */}
      <div className="hidden md:flex w-[320px] bg-white border-r border-[#E6E6E6] flex-col min-h-0">
        <SidebarContent />
      </div>

      {/* Sidebar Drawer Button for mobile */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-[70px] right-2 z-30 bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open community sidebar"
        >
          <FaUsers />
        </button>
      )}

      {/* Sidebar Drawer for mobile */}
      <div
        className={`fixed inset-0 z-40 flex transition-all duration-300 ${
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ visibility: sidebarOpen ? "visible" : "hidden" }}
      >
        <div
          className={`w-64 bg-white h-full flex flex-col p-0 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#E6E6E6]">
            <h2 className="text-xl font-bold text-green-600">Communities</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-green-600 text-2xl"
              aria-label="Close community sidebar"
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

      {/* Main Community Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F7F9FB] min-h-0 w-full max-w-full">
        {!currentCommunity ? (
          <div className="flex justify-center items-center h-full text-[#222] bg-gradient-to-br from-green-50 to-blue-50">
            <div className="text-center max-w-lg mx-auto px-6 py-12 rounded-3xl shadow-lg bg-white/80 border border-green-100">
              <div className="flex justify-center mb-6">
                <span className="inline-block bg-green-100 rounded-full p-6 shadow-md">
                  <FaUsers className="text-green-600 text-5xl" />
                </span>
              </div>
              <h2 className="text-3xl font-extrabold mb-2">
                {currentUser?.role === "expert"
                  ? "Connect with Users Seeking Your Expertise!"
                  : "Start a Conversation with Top Experts!"}
              </h2>
              <p className="text-lg text-[#555] mb-6">
                {currentUser?.role === "expert"
                  ? "Share your knowledge, answer questions, and grow your network."
                  : "Get advice, learn new things, and connect with real experts from around the world."}
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl text-lg shadow transition-colors mb-4"
                onClick={() => {
                  if (currentUser?.role === "expert") {
                    router.push("/app/(home)/chats"); // Or a page for user questions
                  } else {
                    router.push("/app/(home)/experts"); // Or a page to find experts
                  }
                }}
              >
                {currentUser?.role === "expert" ? "See User Questions" : "Find an Expert"}
              </button>
              <div className="mt-6 text-sm text-[#888] italic">
                {currentUser?.role === "expert"
                  ? "Over 10,000 questions answered by our experts!"
                  : "Experts from 20+ countries are here to help you."}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6] bg-white">
                <div className="flex items-center gap-4">
                  <FaArrowLeft
                    className="text-green-600 text-lg cursor-pointer hover:bg-green-50 rounded-full p-1 transition"
                    onClick={() => router.push("/chats")}
                  />
                  <FaHashtag className="text-green-600 text-2xl" />
                  <div>
                    <div className="font-semibold text-lg text-[#222] flex items-center gap-2">
                      {currentCommunity.name}
                      {userCountryInfo.code === currentCommunity.countryCode && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Your Country
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#BDBDBD]">{currentCommunity.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaUsers className="text-[#BDBDBD] text-lg" />
                  <span className="text-xs text-[#BDBDBD]">{currentCommunity.memberCount} members</span>
                  {isRealtimeMember === true && (
                    <button
                      onClick={handleLeaveCommunity}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      <FaSignOutAlt />
                      Leave
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Check if user is a member of the current community */}
            {isRealtimeMember === true ? (
              // Show chat interface if user is a member
              <>
                {/* Scrollable messages area with its own scrollbar */}
                <div className="flex-1 min-h-0 max-h-full overflow-y-auto px-8 py-6 flex flex-col gap-4 w-full max-w-full">
                  {messages.length === 0 ? (
                    <div className="flex justify-center text-[#BDBDBD]">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <MessageItem key={message.id} message={message} />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Sticky message input at the bottom */}
                <div className="sticky bottom-0 left-0 w-full z-20 bg-white shadow-md">
                  <div className="flex items-center gap-4 px-8 py-6 bg-white border-t border-[#E6E6E6] w-full">
                    {editingMessage ? (
                      <>
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                          <FaEdit className="text-xs" />
                          <span>Editing message</span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingMessage(null);
                            setInput("");
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <MdOutlineAttachFile className="text-[#BDBDBD] text-2xl cursor-pointer hover:text-gray-600 transition-colors" />
                    )}
                    <input
                      type="text"
                      placeholder={editingMessage ? "Edit your message..." : "Type a message to the community..."}
                      className="flex-1 px-4 py-3 rounded-xl border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-base"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    {!editingMessage && (
                      <FaRegSmile className="text-[#BDBDBD] text-2xl cursor-pointer hover:text-gray-600 transition-colors" />
                    )}
                    <FaPaperPlane
                      className={`text-2xl cursor-pointer transition-colors ${
                        input.trim() ? "text-green-600 hover:text-green-700" : "text-[#BDBDBD]"
                      }`}
                      onClick={handleSend}
                    />
                  </div>
                </div>
              </>
            ) : isRealtimeMember === false ? (
              // Show join/rejoin community button if not a member
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                  <div className="text-6xl mb-6">
                    {hasLeftCommunity(currentCommunity.id) ? "👋" : "👋"}
                  </div>
                  <h2 className="text-2xl font-bold text-[#222] mb-4">
                    {hasLeftCommunity(currentCommunity.id) 
                      ? `Rejoin ${currentCommunity.name}` 
                      : `Join ${currentCommunity.name}`
                    }
                  </h2>
                  <p className="text-[#BDBDBD] mb-8">
                    {hasLeftCommunity(currentCommunity.id)
                      ? `Welcome back! Reconnect with ${currentCommunity.memberCount} members from ${currentCommunity.country} and continue sharing your experiences!`
                      : `Connect with ${currentCommunity.memberCount} members from ${currentCommunity.country} and start sharing your experiences!`
                    }
                  </p>
                  <button
                    onClick={() => handleJoinCommunity(currentCommunity)}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <FaUserPlus />
                    {hasLeftCommunity(currentCommunity.id) ? "Rejoin Community" : "Join Community"}
                  </button>
                </div>
              </div>
            ) : (
              // Loading state while checking membership
              <div className="flex-1 flex items-center justify-center text-[#BDBDBD]">
                Checking membership status...
              </div>
            )}
          </>
        )}
      </div>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* Leave Community Confirmation Dialog */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-[#222] mb-2">
                Leave Community?
              </h3>
              <p className="text-[#BDBDBD] mb-6">
                Are you sure you want to leave <strong>{currentCommunity?.name}</strong>? 
                You won't be able to send messages until you join again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLeaveConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveCommunityConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Leave Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityChat;
