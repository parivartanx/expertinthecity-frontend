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
} from "react-icons/fa";
import { MdOutlineAttachFile } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/lib/mainwebsite/community-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { getUserCountry, formatCountryWithFlag, type CountryInfo } from "@/lib/utils";
import { useCountryDetection } from "@/hooks/use-country-detection";
import { toast } from "sonner";

const CommunityChat = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    fetchUserMemberships,
    subscribeToCommunityMessages,
    subscribeToCommunityMembers,
    clearMessages,
    clearError,
  } = useCommunityStore();

  // Use country detection hook
  const { getUserCountryInfo, isDetecting } = useCountryDetection();

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



  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Play notification sound and show toast for new messages from others
  useEffect(() => {
    if (!currentCommunity || !messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId !== currentUser?.id) {
      audioRef.current?.play();
      toast.info(`New message in ${currentCommunity.name}: ${lastMsg.senderName}: ${lastMsg.content}`);
    }
  }, [messages, currentCommunity, currentUser]);

  // Handle send message
  const handleSend = useCallback(async () => {
    if (!input.trim() || !currentCommunity) return;
    
    await sendMessage(currentCommunity.id, input);
    setInput("");
  }, [input, currentCommunity, sendMessage]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Handle join community
  const handleJoinCommunity = useCallback(async (community: any) => {
    await joinCommunity(community.id);
    setCurrentCommunity(community);
    toast.success(`Joined ${community.name}!`);
  }, [joinCommunity, setCurrentCommunity]);

  // Auto-select user's country community when available
  useEffect(() => {
    if (currentUser && communities.length > 0 && !currentCommunity && !isDetecting) {
      const userCountry = getUserCountryInfo();
      const userCountryCommunity = communities.find(
        community => community.countryCode === userCountry.code
      );

      if (userCountryCommunity) {
        const isMember = userMemberships.some(membership => 
          membership.communityId === userCountryCommunity.id && membership.isActive
        );

        if (isMember) {
          setCurrentCommunity(userCountryCommunity);
          fetchMessages(userCountryCommunity.id);
        } else {
          // Auto-join user's country community
          handleJoinCommunity(userCountryCommunity);
        }
      }
    }
  }, [currentUser, communities, currentCommunity, userMemberships, isDetecting, getUserCountryInfo, handleJoinCommunity, fetchMessages, setCurrentCommunity]);

  // Handle leave community
  const handleLeaveCommunity = async () => {
    if (!currentCommunity) return;
    
    await leaveCommunity(currentCommunity.id);
    setCurrentCommunity(null);
    clearMessages();
    toast.success(`Left ${currentCommunity.name}`);
  };

  // Handle edit message
  const handleEditMessage = async () => {
    if (!editingMessage || !editContent.trim() || !currentCommunity) return;
    
    await editMessage(currentCommunity.id, editingMessage, editContent);
    setEditingMessage(null);
    setEditContent("");
    toast.success("Message updated!");
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId: string) => {
    if (!currentCommunity) return;
    
    await deleteMessage(currentCommunity.id, messageId);
    toast.success("Message deleted!");
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
          if (isMember) {
            setCurrentCommunity(community);
            fetchMessages(community.id);
          } else {
            handleJoinCommunity(community);
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
            className="bg-green-600 text-white px-3 py-1 rounded-full text-xs hover:bg-green-700 transition-colors"
          >
            Join
          </button>
        )}
      </div>
    );
  };

  // Message component
  const MessageItem = ({ message }: { message: any }) => {
    const isOwnMessage = message.senderId === currentUser?.id;
    const isEditing = editingMessage === message.id;

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
            <div>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditMessage}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingMessage(null);
                        setEditContent("");
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
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
              )}
              <div
                className={`text-xs mt-1 ${
                  isOwnMessage
                    ? "text-right text-green-600"
                    : "text-[#BDBDBD]"
                }`}
              >
                {message.senderName} • {formatTimestamp(message.timestamp)}
                {isOwnMessage && !isEditing && (
                  <div className="flex gap-1 mt-1 justify-end">
                    <button
                      onClick={() => {
                        setEditingMessage(message.id);
                        setEditContent(message.content);
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                )}
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
    <div className="flex flex-col min-h-screen bg-[#F7F9FB] font-sans">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 left-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E6E6E6] shadow-sm w-full min-h-[56px] md:min-h-[64px]">
        <FaArrowLeft
          className="text-green-600 text-lg md:text-xl cursor-pointer hover:bg-green-50 rounded-full p-1 transition"
          onClick={() => router.push("/chats")}
        />
        <span className="text-base md:text-lg font-semibold text-green-600 whitespace-nowrap">
          Back to Chats
        </span>
      </div>
      
      <div className="flex flex-1 min-h-0 w-full pt-0">
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
          <div className="flex justify-center items-center h-full text-[#BDBDBD]">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <div className="text-lg font-semibold mb-2">
                {isDetecting ? "Detecting your location..." : "Select a community to start chatting"}
                </div>
              <div className="text-sm">
                {isDetecting 
                  ? "We're finding communities near you..." 
                  : "Join your country's community or explore others"
                }
              </div>
              {isDetecting && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
              )}
            </div>
          </div>
        ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-[#E6E6E6] bg-white">
                <div className="flex items-center gap-4">
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
                  <button
                    onClick={handleLeaveCommunity}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                  >
                    <FaSignOutAlt />
                    Leave
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-2 md:px-8 py-4 md:py-6 flex flex-col gap-4 min-h-0 w-full max-w-full">
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

              {/* Message Input */}
            <div className="flex items-center gap-2 md:gap-4 px-2 md:px-8 py-4 md:py-6 bg-white border-t border-[#E6E6E6] w-full">
              <MdOutlineAttachFile className="text-[#BDBDBD] text-xl md:text-2xl cursor-pointer" />
              <input
                type="text"
                placeholder="Type a message to the community..."
                className="flex-1 px-2 md:px-4 py-2 md:py-3 rounded-xl border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-sm md:text-base"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
              />
              <FaRegSmile className="text-[#BDBDBD] text-xl md:text-2xl cursor-pointer" />
                <FaPaperPlane
                  className={`text-xl md:text-2xl cursor-pointer transition-colors ${
                    input.trim() ? "text-green-600 hover:text-green-700" : "text-[#BDBDBD]"
                  }`}
                  onClick={handleSend}
                />
            </div>
            </>
          )}
        </div>
      </div>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </div>
  );
};

export default CommunityChat;
