"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaUser, FaUserTie } from "react-icons/fa";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { useUserStore } from "@/lib/mainwebsite/user-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";

interface StartChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatStarted: (chatId: string) => void;
}

const StartChatModal: React.FC<StartChatModalProps> = ({
  isOpen,
  onClose,
  onChatStarted,
}) => {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user: currentUser } = useAuthStore();
  const { allUsers, fetchAllUsers } = useUserStore();
  const { createChat } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
    }
  }, [isOpen]);

  // Filter users based on search
  const filteredUsers = allUsers.filter(
    (user) =>
      user.id !== currentUser?.id &&
      (user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleStartChat = async () => {
    if (selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      const chatId = await createChat(selectedUsers);
      onChatStarted(chatId);
      onClose();
      setSelectedUsers([]);
      setSearch("");
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Start New Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users or experts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {search ? "No users found" : "No users available"}
            </div>
          ) : (
            <div className="p-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id)
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="relative">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      {user.role === "expert" ? (
                        <FaUserTie className="text-green-600 text-xs" />
                      ) : (
                        <FaUser className="text-blue-600 text-xs" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400 capitalize">
                      {user.role}
                    </div>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <FaTimes className="text-white text-xs" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <button
            onClick={handleStartChat}
            disabled={selectedUsers.length === 0 || isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Creating..." : "Start Chat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartChatModal; 