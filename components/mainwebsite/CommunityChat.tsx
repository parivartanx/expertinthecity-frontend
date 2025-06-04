"use client";
import React, { useState } from "react";
import {
  FaUsers,
  FaHashtag,
  FaPaperPlane,
  FaRegSmile,
  FaArrowLeft,
} from "react-icons/fa";
import { MdOutlineAttachFile } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";

const communityRooms = [
  {
    id: 1,
    name: "India",
    description: "Talk about anything!",
    active: true,
  },
];

const communityMessages = [
  {
    id: 1,
    user: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "09:00 AM",
    text: "Good morning everyone! 🌞",
    isMe: false,
  },
  {
    id: 2,
    user: "You",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "09:01 AM",
    text: "Morning Alice! How's it going?",
    isMe: true,
  },
  {
    id: 3,
    user: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    time: "09:02 AM",
    text: "Hey all, don't forget about the event tomorrow!",
    isMe: false,
  },
  {
    id: 4,
    user: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "09:03 AM",
    text: "Thanks for the reminder, Bob!",
    isMe: false,
  },
];

const CommunityChat = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  // Sidebar content as a function for reuse
  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <FaUsers className="text-green-600 text-2xl" />
        <h2 className="text-2xl font-bold text-green-600">Community</h2>
      </div>
      <div className="px-6 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full px-4 py-2 rounded-lg border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-sm"
          />
          <CiSearch className="absolute right-3 top-2.5 text-[#BDBDBD] text-lg" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {communityRooms.map((room) => (
          <div
            key={room.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer mb-1 transition-all duration-150 ${
              room.active
                ? "bg-green-50 border-l-4 border-green-600"
                : "hover:bg-[#F7F9FB]"
            }`}
          >
            <FaHashtag className="text-green-600 text-lg" />
            <div className="flex-1">
              <div className="font-semibold text-base text-[#222]">
                {room.name}
              </div>
              <div className="text-xs text-[#BDBDBD]">{room.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FB] font-sans">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 left-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E6E6E6] shadow-sm w-full min-h-[56px] md:min-h-[64px]">
        <FaArrowLeft
          className="text-green-600 text-lg md:text-xl cursor-pointer hover:bg-green-50 rounded-full p-1 transition"
          onClick={() => router.push("/home/chats")}
        />
        <span className="text-base md:text-lg font-semibold text-green-600 whitespace-nowrap">
          Back to Chats
        </span>
      </div>
      <div className="flex flex-1 min-h-0 w-full pt-0">
        {/* Sidebar for desktop/tablet */}
        <div
          className={`hidden md:flex w-[320px] bg-white border-r border-[#E6E6E6] flex-col min-h-0 ${
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
            aria-label="Open community sidebar"
          >
            <FaUsers />
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
            className={`w-64 bg-white h-full flex flex-col p-0 transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-[#E6E6E6]">
              <h2 className="text-xl font-bold text-green-600">Community</h2>
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
          {/* Overlay */}
          <div
            className={`flex-1 bg-black bg-opacity-40 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        {/* Main Community Chat Area */}
        <div className="flex-1 flex flex-col bg-[#F7F9FB] min-h-0 w-full max-w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#E6E6E6] bg-white ">
            <div className="flex items-center gap-4">
              <FaHashtag className="text-green-600 text-2xl" />
              <div>
                <div className="font-semibold text-lg text-[#222]">India</div>
                <div className="text-xs text-[#BDBDBD]">
                  Talk about anything!
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaUsers className="text-[#BDBDBD] text-lg" />
              <span className="text-xs text-[#BDBDBD]">128 members</span>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 md:px-8 py-4 md:py-6 flex flex-col gap-4 min-h-0 w-full max-w-full">
            {communityMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end gap-3 max-w-[70%] ${
                    msg.isMe ? "flex-row-reverse" : ""
                  }`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <div
                      className={`px-5 py-3 rounded-2xl ${
                        msg.isMe
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-white text-[#222] rounded-bl-none"
                      } shadow-sm`}
                    >
                      <span>{msg.text}</span>
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.isMe
                          ? "text-right text-green-600"
                          : "text-[#BDBDBD]"
                      }`}
                    >
                      {msg.user} • {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Message Input or Join Button */}
          {hasJoined ? (
            <div className="flex items-center gap-2 md:gap-4 px-2 md:px-8 py-4 md:py-6 bg-white border-t border-[#E6E6E6] w-full">
              <MdOutlineAttachFile className="text-[#BDBDBD] text-xl md:text-2xl cursor-pointer" />
              <input
                type="text"
                placeholder="Type a message to the community..."
                className="flex-1 px-2 md:px-4 py-2 md:py-3 rounded-xl border border-[#E6E6E6] bg-[#F7F9FB] focus:outline-none text-sm md:text-base"
              />
              <FaRegSmile className="text-[#BDBDBD] text-xl md:text-2xl cursor-pointer" />
              <FaPaperPlane className="text-green-600 text-xl md:text-2xl cursor-pointer" />
            </div>
          ) : (
            <div className="flex items-center justify-center px-2 md:px-8 py-4 md:py-6 bg-white border-t border-[#E6E6E6] w-full">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                onClick={() => setHasJoined(true)}
              >
                Join Community
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
