"use client";
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaCheck,
  FaMicrophone,
  FaPaperPlane,
  FaPhoneAlt,
  FaVideo,
  FaEllipsisH,
  FaArrowLeft,
} from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";
import {
  IoIosNotificationsOutline,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineAttachFile } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/mainwebsite/chat-store";

const ChatUI = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const {
    chats,
    messages,
    fetchChats,
    fetchMessages,
    sendMessage,
    isLoading,
    currentChat,
    setCurrentChat,
    clearMessages,
  } = useChatStore();

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
    // Cleanup messages listener on unmount
    return () => {
      clearMessages();
    };
    // eslint-disable-next-line
  }, []);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
      const chat = chats.find((c) => c.id === selectedChatId) || null;
      setCurrentChat(chat);
    }
  }, [selectedChatId]);

  // Filtered chats for search
  const filteredChats = chats.filter(
    (chat) =>
      chat.name?.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage?.content?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle send message
  const [input, setInput] = useState("");
  const handleSend = async () => {
    if (!input.trim() || !selectedChatId) return;
    // TODO: Replace 'senderId' with actual user id from auth
    await sendMessage(selectedChatId, "demo-user-id", input);
    setInput("");
  };

  // Sidebar content as a function for reuse
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-6">
        <h2 className="text-xl md:text-2xl font-bold text-green-600">Chats</h2>
        <div className="flex gap-4">
          <IoIosNotificationsOutline
            onClick={() => {
              router.push("/notifications");
            }}
            className="text-[#BDBDBD] text-xl md:text-2xl cursor-pointer"
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
      <div className="px-4 md:px-6 pb-2 text-xs text-[#BDBDBD] font-semibold">
        Pinned Message
      </div>
      <div className="flex flex-col gap-1 px-2">
        {filteredChats
          .filter((c) => c.isActive)
          .map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl cursor-pointer ${selectedChatId === chat.id ? "bg-[#F7F9FB]" : "hover:bg-[#F7F9FB]"
                }`}
              onClick={() => {
                setSelectedChatId(chat.id);
                setSidebarOpen(false);
              }}
            >
              <img
                src={chat.avatar || "/default-avatar.png"}
                alt={chat.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm md:text-base text-[#222]">
                    {chat.name}
                  </span>
                  <BsPinAngleFill className="text-green-600 text-xs" />
                </div>
                <div className="text-xs text-[#BDBDBD] flex items-center gap-1">
                  {chat.lastMessage?.content}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-[#BDBDBD]">{chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                {chat.unreadCount > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="px-4 md:px-6 pt-4 pb-2 text-xs text-[#BDBDBD] font-semibold">
        All Message
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 px-2 pb-4">
        {filteredChats
          .filter((c) => c.isActive)
          .map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl cursor-pointer ${selectedChatId === chat.id ? "bg-[#F7F9FB]" : "hover:bg-[#F7F9FB]"
                }`}
              onClick={() => {
                setSelectedChatId(chat.id);
                setSidebarOpen(false);
              }}
            >
              <img
                src={chat.avatar || "/default-avatar.png"}
                alt={chat.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm md:text-base text-[#222]">
                  {chat.name}
                </div>
                <div className="text-xs text-[#BDBDBD] flex items-center gap-1">
                  {chat.lastMessage?.content}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-[#BDBDBD]">{chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                {chat.unreadCount > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* Sticky Join Community Button */}
      <div className="sticky bottom-0 left-0 w-full flex justify-center bg-white py-3 z-10 border-t border-[#E6E6E6]">
        <button
          onClick={() => router.push("/community")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full shadow-md hover:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm md:text-base"
        >
          <HiOutlineUserGroup className="text-xl md:text-2xl" />
          <span>Join Our Community</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FB] font-sans">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 left-0 z-30 flex items-center justify-between p-2 bg-white border-b border-[#E6E6E6] shadow-sm w-full min-h-[56px] md:min-h-[64px]">
        <div className="flex items-center gap-2 md:gap-3">
          <FaArrowLeft
            className="text-green-600 text-lg md:text-xl cursor-pointer hover:bg-green-50 rounded-full p-1 transition"
            onClick={() => router.push("/")}
          />
          <span className="text-base md:text-lg font-semibold text-green-600 whitespace-nowrap">
            Back to Home
          </span>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 w-full pt-0">
        {/* Sidebar for desktop/tablet */}
        <div
          className={`hidden md:flex w-[350px] bg-white border-r border-[#E6E6E6] flex-col min-h-0 ${sidebarOpen ? "md:hidden" : ""
            }`}
        >
          <SidebarContent />
        </div>
        {/* Sidebar Drawer Button for mobile (only if sidebar is closed) */}
        {!sidebarOpen && (
          <button
            className="md:hidden fixed top-[70px] right-2 z-30 bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open chat sidebar"
          >
            <FaSearch />
          </button>
        )}
        {/* Sidebar Drawer for mobile with transition (from left) */}
        <div
          className={`fixed inset-0 z-40 flex transition-all duration-300 ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          style={{ visibility: sidebarOpen ? "visible" : "hidden" }}
        >
          {/* Drawer (slides in from left) */}
          <div
            className={`w-72 bg-white h-full flex flex-col p-0 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          {/* Overlay */}
          <div
            className={`flex-1 bg-black bg-opacity-40 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"
              }`}
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[#F7F9FB] min-h-0 w-full max-w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-[#E6E6E6] bg-white">
            <div className="flex items-center gap-3 md:gap-4">
              <img
                src={currentChat?.avatar || "/default-avatar.png"}
                alt={currentChat?.name || "Chat"}
                className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1 justify-center">
                <span className="font-semibold text-base md:text-lg text-[#222]">
                  {currentChat?.name || "Select a chat"}
                </span>
                {/* Optionally show typing status or last seen */}
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <FaEllipsisH className="text-[#BDBDBD] text-lg cursor-pointer" />
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 md:px-8 py-4 md:py-6 flex flex-col gap-3 md:gap-4 min-h-0 w-full max-w-full">
            {messages.length === 0 && (
              <div className="flex justify-center text-[#BDBDBD]">No messages yet.</div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === "demo-user-id" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85vw] md:max-w-[60%] px-3 md:px-5 py-2 md:py-3 rounded-2xl ${msg.senderId === "demo-user-id"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white text-[#222] rounded-bl-none"
                    } shadow-sm text-sm md:text-base`}
                >
                  <span>{msg.content}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Message Input */}
          <div className="flex items-center gap-2 md:gap-4 px-2 md:px-8 py-4 md:py-6 bg-white border-t border-[#E6E6E6] w-full">
            <MdOutlineAttachFile className="text-[#BDBDBD] text-xl md:text-2xl cursor-pointer" />
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 px-2 md:px-4 py-2 md:py-3 rounded-xl border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-sm md:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={!selectedChatId}
            />
            <FaPaperPlane
              className="text-green-600 text-xl md:text-2xl cursor-pointer"
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
