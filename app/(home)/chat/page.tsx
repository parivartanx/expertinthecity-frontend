"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react"

// Placeholder for expert data - replace with actual data fetching based on expert ID
const expert = {
  name: "John Smith",
  specialty: "Expert Plumber",
  rating: 4.9,
  reviews: 120,
  location: "London, UK",
  image:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmVzc2lvbmFsfGVufDB8fDB8fHww", // Replace with dynamic image source
};

// Placeholder for messages - replace with actual data fetching
const initialMessages = [
  {
    id: 1,
    text: "Hello! How can I help you today?",
    sender: "expert", // or expert.id
  },
  {
    id: 2,
    text: "I need help fixing a leak.",
    sender: "user", // or user.id
  },
  {
    id: 3,
    text: "Sure! Let's schedule an appointment.",
    sender: "expert", // or expert.id
  },
];

// Placeholder for available times - replace with actual data fetching
const availableTimes = ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

export default function ExpertPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [date, setDate] = useState<Date | undefined>(new Date()); // Use Date | undefined for selected date
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");
  const [messages, setMessages] = useState(initialMessages); // State for messages
  const [newMessageText, setNewMessageText] = useState(""); // State for new message input

  // Placeholder function for sending a message - replace with actual API call
  const handleSendMessage = () => {
    if (newMessageText.trim() === "") return; // Prevent sending empty messages

    const newMessage = {
      id: messages.length + 1, // Basic ID generation
      text: newMessageText,
      sender: "user", // Assuming user is sending
    };

    setMessages([...messages, newMessage]);
    setNewMessageText(""); // Clear input after sending
    // TODO: Implement actual API call to send message to the expert
    console.log("Sending message:", newMessageText);
  };

  // Placeholder function for scheduling an appointment - replace with actual API call
  const handleScheduleAppointment = () => {
    if (!date || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }
    // TODO: Implement actual API call to schedule appointment with the expert
    console.log(
      `Scheduling appointment for ${date.toDateString()} at ${selectedTime}. Notes: ${note}`
    );
    // Optionally show a success message and clear the form
    alert("Appointment request sent!");
    setDate(new Date());
    setSelectedTime("");
    setNote("");
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Expert Profile Header - make dynamic */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={expert.image}
          alt={expert.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{expert.name}</h2>
          <p className="text-sm text-muted-foreground">{expert.specialty}</p>
          <p className="text-yellow-500 font-medium">
            ★ {expert.rating} ({expert.reviews} reviews)
          </p>
          <p className="text-sm text-gray-500">{expert.location}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("chat")}
          className={`pb-2 border-b-2 ${
            activeTab === "chat"
              ? "border-black font-semibold"
              : "border-transparent"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-2 border-b-2 ${
            activeTab === "schedule"
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
          {/* Display Messages - make dynamic */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`self-${
                message.sender === "user"
                  ? "end bg-green-200"
                  : "start bg-gray-200"
              } px-3 py-2 rounded-xl max-w-xs`}
            >
              {message.text}
            </div>
          ))}

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
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      )}

      {/* Schedule Tab Content */}
      {activeTab === "schedule" && (
        <div className="bg-white border rounded-lg p-4">
          {/* Schedule Form - make dynamic */}
          <h3 className="text-lg font-semibold mb-4">
            Schedule an Appointment with {expert.name}
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
            {
              availableTimes.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))
              // Add a disabled default option if needed
            }
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
