"use client";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { useParams } from "next/navigation";

export default function ChatByIdPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  // Zustand store
  const {
    currentChat,
    messages,
    chats,
    fetchChats,
    fetchMessages,
    sendMessage,
    setCurrentChat,
    isLoading,
    error,
  } = useChatStore();

  // Auth store
  const { user } = useAuthStore();
  const senderId = user?.id;

  // UI state
  const [activeTab, setActiveTab] = useState("chat");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");
  const [newMessageText, setNewMessageText] = useState("");

  // Placeholder for available times - replace with actual data fetching
  const availableTimes = ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

  // Fetch chat and messages on mount or when chatId changes
  useEffect(() => {
    if (chatId) {
      fetchChats();
      fetchMessages(chatId);
      // Set current chat from chats array
      const chat = chats.find(c => c.id === chatId);
      setCurrentChat(chat || null);
    }
  }, [chatId, fetchChats, fetchMessages, chats, setCurrentChat]);

  // Send message handler
  const handleSendMessage = async () => {
    if (!chatId || newMessageText.trim() === "") return;
    await sendMessage(chatId, newMessageText);
    setNewMessageText("");
  };

  // Schedule appointment handler (static for now)
  const handleScheduleAppointment = () => {
    if (!date || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }
    // TODO: Implement actual API call to schedule appointment with the expert
    console.log(
      `Scheduling appointment for ${date.toDateString()} at ${selectedTime}. Notes: ${note}`
    );
    alert("Appointment request sent!");
    setDate(new Date());
    setSelectedTime("");
    setNote("");
  };

  // Get expert info from currentChat participants (show first non-user as expert)
  const expert = currentChat ? Object.values(currentChat.participantDetails).find((p: any) => p.role === "EXPERT") || Object.values(currentChat.participantDetails)[0] : null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Expert Profile Header */}
      {isLoading ? (
        <div className="mb-6">Loading...</div>
      ) : error ? (
        <div className="mb-6 text-red-500">{error}</div>
      ) : currentChat && expert ? (
        <div className="flex items-center gap-4 mb-6">
          <img
            src={expert.avatar || "/default-avatar.png"}
            alt={expert.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{expert.name}</h2>
            <p className="text-sm text-muted-foreground">{expert.role}</p>
            {/* Optionally add rating, reviews, location if available */}
          </div>
        </div>
      ) : (
        <div className="mb-6">No chat selected.</div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("chat")}
          className={`pb-2 border-b-2 ${activeTab === "chat"
            ? "border-black font-semibold"
            : "border-transparent"
            }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-2 border-b-2 ${activeTab === "schedule"
            ? "border-black font-semibold"
            : "border-transparent"
            }`}
        >
          Schedule
        </button>
      </div>

      {/* Chat Tab Content */}
      {activeTab === "chat" && (
        <div className="bg-white border rounded-lg p-4 h-96 overflow-y-auto flex flex-col gap-3">
          {/* Display Messages */}
          {isLoading ? (
            <div>Loading messages...</div>
          ) : (
            (messages[chatId || ''] || []).map((message: any) => (
              <div
                key={message.id}
                className={`self-${message.senderId === expert?.id
                  ? "start bg-gray-200"
                  : "end bg-green-200"
                  } px-3 py-2 rounded-xl max-w-xs`}
              >
                {message.content}
              </div>
            ))
          )}

          {/* Message Input */}
          <div className="mt-auto flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Type your message..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              disabled={isLoading || !chatId}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !chatId}>Send</Button>
          </div>
        </div>
      )}

      {/* Schedule Tab Content */}
      {activeTab === "schedule" && (
        <div className="bg-white border rounded-lg p-4">
          {/* Schedule Form - make dynamic */}
          <h3 className="text-lg font-semibold mb-4">
            Schedule an Appointment{expert ? ` with ${expert.name}` : ""}
          </h3>

          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mb-4 border rounded-md p-2"
          />

          <select
            className="w-full border rounded-md p-2 mb-4"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Select a time slot</option>
            {availableTimes.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>

          <Textarea
            placeholder="Additional Notes (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4"
          />

          <Button className="w-full" onClick={handleScheduleAppointment}>
            Schedule Appointment
          </Button>
        </div>
      )}
    </div>
  );
} 