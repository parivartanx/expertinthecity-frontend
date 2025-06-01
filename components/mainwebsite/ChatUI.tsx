"use client";
import React, { useState } from "react";
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

const chatList = [
  {
    id: 1,
    name: "Odama Studio",
    lastMessage: "Mas Happy Typing...",
    time: "05:11 PM",
    unread: 2,
    pinned: true,
    avatar:
      "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
    typing: true,
    selected: true,
  },
  {
    id: 2,
    name: "Hatypo Studio",
    lastMessage: "Momon : Lahh gas!",
    time: "16:01 PM",
    unread: 0,
    pinned: false,
    avatar:
      "https://plus.unsplash.com/premium_photo-1664203068007-52240d0ca48f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
    typing: false,
    selected: false,
    sent: true,
  },
  {
    id: 3,
    name: "Nolaaa",
    lastMessage: "Keren banget",
    time: "03:29 PM",
    unread: 4,
    pinned: false,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
    typing: false,
    selected: false,
  },
  {
    id: 4,
    name: "Mas Happy",
    lastMessage: "Typing...",
    time: "02:21 PM",
    unread: 0,
    pinned: false,
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZhY2V8ZW58MHx8MHx8fDA%3D",
    typing: true,
    selected: false,
  },
  {
    id: 5,
    name: "Mas Rohmad",
    lastMessage: "Zaa jo lali ngeshoft yaa",
    time: "01:12 PM",
    unread: 2,
    pinned: false,
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZhY2V8ZW58MHx8MHx8fDA%3D",
    typing: false,
    selected: false,
  },
  {
    id: 6,
    name: "Mas Listian",
    lastMessage: "Mantapp za",
    time: "12:10 AM",
    unread: 1,
    pinned: false,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZhY2V8ZW58MHx8MHx8fDA%3D",
    typing: false,
    selected: false,
  },
  {
    id: 7,
    name: "Rafi Rohmat",
    lastMessage: "Voice message",
    time: "Yesterday",
    unread: 0,
    pinned: false,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D",
    typing: false,
    selected: false,
    voice: true,
  },
  {
    id: 8,
    name: "Caca",
    lastMessage: "Oke suwun",
    time: "Yesterday",
    unread: 0,
    pinned: false,
    avatar:
      "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
    typing: false,
    selected: false,
    sent: true,
  },
  {
    id: 9,
    name: "Farhan",
    lastMessage: "Zaa udah tak update di figma",
    time: "Yesterday",
    unread: 0,
    pinned: false,
    avatar:
      "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
    typing: false,
    selected: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "Expert Dev",
    time: "05:00 PM",
    text: "Guys, next year we're planning a dev retreat in Japan! 🇯🇵💻",
    isMe: false,
  },
  {
    id: 2,
    sender: "Expert Dev",
    time: "05:00 PM",
    text: "Let's start assigning tasks for the upcoming project sprint as well, same style as usual.",
    isMe: false,
  },
  {
    id: 3,
    sender: "Aman",
    time: "05:02 PM",
    text: "Oyyy that's fireee!!! Count me in 🔥",
    isMe: true,
  },
  {
    id: 4,
    sender: "Senior Dev",
    time: "05:01 PM",
    text: "For real?? That's dope!",
    isMe: false,
  },
  {
    id: 5,
    sender: "Expert Dev",
    time: "05:11 PM",
    text: "@Aman @FrontendPro @UIQueen \nCan y'all check this new Figma draft?\nhttps://www.figma.com/file/devproject...",
    isMe: false,
    mention: true,
  },
  {
    id: 6,
    sender: "Aman",
    time: "05:12 PM",
    text: "All righty! Opening Figma rn 🔥 Let's gooo 🚀",
    isMe: true,
  },
];

const avatars = [
  "https://plus.unsplash.com/premium_photo-1687832254672-bf177d8819df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGZhY2V8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1587397845856-e6cf49176c70?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGZhY2V8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGZhY2V8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGZhY2V8ZW58MHx8MHx8fDA%3D",
];

const ChatUI = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filteredChats = chatList.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );
  // Sidebar content as a function for reuse
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-6">
        <h2 className="text-xl md:text-2xl font-bold text-green-600">Chats</h2>
        <div className="flex gap-4">
          <IoIosNotificationsOutline
            onClick={() => {
              router.push("/home/notifications");
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
          .filter((c) => c.pinned)
          .map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl cursor-pointer ${
                chat.selected ? "bg-[#F7F9FB]" : "hover:bg-[#F7F9FB]"
              }`}
            >
              <img
                src={chat.avatar}
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
                  {chat.lastMessage}
                  {chat.typing && (
                    <span className="ml-1 animate-pulse">...</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-[#BDBDBD]">{chat.time}</span>
                {chat.unread > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                    {chat.unread}
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
          .filter((c) => !c.pinned)
          .map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl cursor-pointer ${
                chat.selected ? "bg-[#F7F9FB]" : "hover:bg-[#F7F9FB]"
              }`}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm md:text-base text-[#222]">
                  {chat.name}
                </div>
                <div className="text-xs text-[#BDBDBD] flex items-center gap-1">
                  {chat.lastMessage}
                  {chat.typing && (
                    <span className="ml-1 animate-pulse">...</span>
                  )}
                  {chat.voice && (
                    <FaMicrophone className="inline ml-1 text-[#BDBDBD] text-xs" />
                  )}
                  {chat.sent && (
                    <FiCheck className="inline ml-1 text-[#4ADE80] text-xs" />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-[#BDBDBD]">{chat.time}</span>
                {chat.unread > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* Sticky Join Community Button */}
      <div className="sticky bottom-0 left-0 w-full flex justify-center bg-white py-3 z-10 border-t border-[#E6E6E6]">
        <button
          onClick={() => router.push("/home/community")}
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
            onClick={() => router.push("/home")}
          />
          <span className="text-base md:text-lg font-semibold text-green-600 whitespace-nowrap">
            Back to Home
          </span>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 w-full pt-0">
        {/* Sidebar for desktop/tablet */}
        <div
          className={`hidden md:flex w-[350px] bg-white border-r border-[#E6E6E6] flex-col min-h-0 ${
            sidebarOpen ? "md:hidden" : ""
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
          className={`fixed inset-0 z-40 flex transition-all duration-300 ${
            sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ visibility: sidebarOpen ? "visible" : "hidden" }}
        >
          {/* Drawer (slides in from left) */}
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
          {/* Overlay */}
          <div
            className={`flex-1 bg-black bg-opacity-40 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
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
                src="https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGZhY2V8ZW58MHx8MHx8fDA%3D"
                alt="Odama Studio"
                className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1 justify-center">
                <span className="font-semibold text-base md:text-lg text-[#222]">
                  Odama Studio
                </span>
                <span className="text-xs text-[#BDBDBD]">Typing...</span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <FaEllipsisH className="text-[#BDBDBD] text-lg cursor-pointer" />
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 md:px-8 py-4 md:py-6 flex flex-col gap-3 md:gap-4 min-h-0 w-full max-w-full">
            <div className="flex justify-center mb-2">
              <span className="bg-[#F7F9FB] text-[#BDBDBD] text-xs px-3 md:px-4 py-1 rounded-full border border-[#E6E6E6]">
                Today, Jan 30
              </span>
            </div>
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85vw] md:max-w-[60%] px-3 md:px-5 py-2 md:py-3 rounded-2xl ${
                    msg.isMe
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-white text-[#222] rounded-bl-none"
                  } shadow-sm text-sm md:text-base`}
                >
                  {msg.mention ? (
                    <>
                      <span className="text-[#2563EB] font-semibold">
                        @Aman @FrontendPro @UIKing
                      </span>
                      <br />
                      <span>Can y'all check this new Figma draft?</span>
                      <br />
                      <a
                        href="https://www.figma.com/file/adcopy..."
                        className="text-[#2563EB] underline"
                      >
                        https://www.figma.com/file/adcopy...
                      </a>
                    </>
                  ) : (
                    <span>{msg.text}</span>
                  )}
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
            />
            <FaPaperPlane className="text-green-600 text-xl md:text-2xl cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
