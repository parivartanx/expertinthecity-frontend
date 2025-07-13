"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/lib/mainwebsite/chat-store";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";
import { toast } from "sonner";

const GlobalChatNotifier = () => {
  const { user: currentUser } = useAuthStore();
  const { messages } = useChatStore();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    Object.entries(messages).forEach(([chatId, msgs]) => {
      if (!msgs || msgs.length === 0) return;
      const lastMsg = msgs[msgs.length - 1];
      // Only notify if not the sender, not already read, and not on the chat page
      const isOnChatPage = pathname.startsWith(`/chats/${chatId}`);
      if (
        lastMsg.senderId !== currentUser.id &&
        !isOnChatPage &&
        !lastMsg.readBy.includes(currentUser.id)
      ) {
        // Play notification sound
        if (audioRef.current) {
          audioRef.current.play();
        }
        // Show clickable toast
        toast(
          `New message from ${lastMsg.senderName || "User"}`,
          {
            action: {
              label: "Open Chat",
              onClick: () => {
                window.location.href = `/chats/${chatId}`;
              },
            },
          }
        );
      }
    });
  }, [messages, currentUser, pathname]);

  return <audio ref={audioRef} src="/notification.mp3" preload="auto" style={{ display: "none" }} />;
};

export default GlobalChatNotifier; 