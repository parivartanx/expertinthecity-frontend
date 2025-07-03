"use client";

import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAllExpertsStore } from "@/lib/mainwebsite/all-experts-store";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { toast } from "sonner";

interface Expert {
  id: string;
  name: string;
  title?: string;
  location: string | { address?: string; country?: string };
  rating: number;
  reviews: number;
  categories?: string[];
  tags?: string[];
  image: string;
  status?: string;
  bio?: string;
  description?: string;
  hourlyRate?: number;
  verified?: boolean;
  expertise?: string[];
  experience?: number;
  availability?: string;
  languages?: string[];
}

// Client Component for Filter Section
const FilterSection = () => {
  const {
    location,
    setLocation,
    selectedServices,
    toggleService,
    selectedRatings,
    toggleRating,
    fetchExperts } = useAllExpertsStore();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button
        className="md:hidden w-full bg-green-600 hover:bg-green-700 text-white mb-2"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <aside
        className={`${isVisible ? 'block' : 'hidden'} md:block w-full md:w-1/4 md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:overflow-y-auto bg-card rounded-lg p-3 sm:p-4 shadow-sm`}
      >
        <Input placeholder="Your Location" value={location} onChange={(e) => setLocation(e.target.value)} className="mb-3 sm:mb-4 text-sm sm:text-base" />
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="font-medium mb-2 text-foreground text-sm sm:text-base">Services</p>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-0">
              {[
                "Plumbing",
                "Electrical",
                "Cleaning",
                "Gardening",
                "Painting",
                "Carpentry",
                "Roofing",
                "HVAC",
                "Pest Control",
                "Flooring",
              ].map((service) => (
                <div key={service} className="flex items-center space-x-2 py-1">
                  <input type="checkbox" checked={selectedServices.includes(service)} onChange={() => toggleService(service)} className="rounded border-input w-3 h-3 sm:w-4 sm:h-4" />
                  <label className="text-xs sm:text-sm text-muted-foreground">
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium mb-2 text-foreground text-sm sm:text-base">Rating</p>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-0">
              {[5, 4, 3, 2].map((r) => (
                <div key={r} className="flex items-center space-x-2 py-1">
                  <input type="checkbox" checked={selectedRatings.includes(r)}
                    onChange={() => toggleRating(r)} className="rounded border-input w-3 h-3 sm:w-4 sm:h-4" />
                  <label className="text-xs sm:text-sm text-muted-foreground">
                    {r}★ & up
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={fetchExperts} className="w-full mt-3 sm:mt-4 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base">
            Apply Filters
          </Button>
        </div>
      </aside>
    </>
  );
};

export default function AllExperts() {
  const {
    experts,
    isLoading,
    error,
    fetchExperts,
    searchQuery,
    setSearchQuery,
    location,
    selectedRatings,
    selectedServices,
    getExpertById,
    sendMessageToExpert
  } = useAllExpertsStore();
  const router = useRouter();
  const { createChat, chats } = useChatStore();
  const [messageLoading, setMessageLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    // Debounce search and filter changes
    const timeoutId = setTimeout(() => {
      fetchExperts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [location, selectedRatings, selectedServices, searchQuery]);

  const handleViewProfile = async (expert: Expert) => {
    try {
      // Navigate to expert profile page
      router.push(`/experts/${expert.id}`);
    } catch (error) {
      console.error("Error navigating to expert profile:", error);
      toast.error("Failed to open expert profile");
    }
  };

  const handleMessage = async (expert: Expert) => {
    try {
      setMessageLoading(expert.id);

      // Try to find an existing chat with this expert
      let chat = chats.find(
        (c) =>
          c.type === "expert" &&
          c.participants.some((p) => p.id === expert.id)
      );

      if (!chat) {
        // Create a new chat if not found
        await createChat({
          type: "expert",
          participants: [{ id: expert.id, name: expert.name, avatar: expert.image, role: "expert", isOnline: false }],
          name: expert.name,
          avatar: expert.image,
        });

        // Refetch chats to get the new chatId
        chat = chats.find(
          (c) =>
            c.type === "expert" &&
            c.participants.some((p) => p.id === expert.id)
        );
      }

      if (chat) {
        // Send initial message to expert
        const messageSent = await sendMessageToExpert(expert.id, "Hello! I'm interested in your services.");

        if (messageSent) {
          toast.success("Message sent successfully!");
          router.push(`/chat?chatId=${chat.id}`);
        } else {
          toast.error("Failed to send message");
        }
      } else {
        toast.error("Failed to create chat");
      }
    } catch (error) {
      console.error("Error handling message:", error);
      toast.error("Failed to send message");
    } finally {
      setMessageLoading(null);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-8 bg-background">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">ALL Experts</h1>
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        <FilterSection />

        <main className="w-full md:w-3/4">
          <Input placeholder="Search Experts..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="mb-3 sm:mb-4 text-sm sm:text-base" />

          {/* adding loading */}
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading experts...</p>
          )}

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Empty State */}
          {!isLoading && experts.length === 0 && (
            <p className="text-sm text-muted-foreground">No experts found. Try changing filters.</p>
          )}

          <div className="space-y-4 sm:space-y-6">
            {experts.map((expert: Expert, index: number) => (
              <div
                key={expert.id || index}
                className="flex flex-col md:flex-row md:items-center border border-border bg-card p-3 sm:p-4 rounded-xl gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 sm:gap-4 md:block">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
                  />
                  <div className="md:hidden">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                      {expert.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      📍 {typeof expert.location === 'string'
                        ? expert.location
                        : [expert.location?.address, expert.location?.country].filter(Boolean).join(', ')}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      <FaStar className="text-sm" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">
                        {expert.rating} ({expert.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="hidden md:block">
                    <h2 className="text-xl font-semibold text-foreground">
                      {expert.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      📍 {typeof expert.location === 'string'
                        ? expert.location
                        : [expert.location?.address, expert.location?.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
                    {expert.description}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {(expert.tags || []).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-800 text-xs px-2 py-0.5 sm:py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between min-w-fit gap-2 sm:gap-0">
                  <div className="hidden md:flex items-center gap-1 text-yellow-500">
                    <FaStar />
                    <span className="font-medium text-foreground">
                      {expert.rating} ({expert.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm"
                      onClick={() => handleViewProfile(expert)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 text-sm"
                      onClick={() => handleMessage(expert)}
                      disabled={messageLoading === expert.id}
                    >
                      {messageLoading === expert.id ? "Sending..." : "Message"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
