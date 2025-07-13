"use client";
import { useEffect, useRef } from "react";
import { ref, onValue, set, serverTimestamp, onDisconnect, DatabaseReference } from "firebase/database";
import { rtdb } from "@/lib/mainwebsite/firebase";
import { useAuthStore } from "@/lib/mainwebsite/auth-store";

export const usePresence = () => {
  const { user } = useAuthStore();
  const presenceRef = useRef<DatabaseReference | null>(null);

  useEffect(() => {
    if (!user) return;

    // Create a reference to this user's presence
    const userStatusRef = ref(rtdb, `/status/${user.id}`);
    presenceRef.current = userStatusRef;

    // Create a reference to the special '.info/connected' path in Realtime Database
    const connectedRef = ref(rtdb, '.info/connected');

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      // If we're not currently connected, don't do anything
      if (!snapshot.val()) return;

      // If we are currently connected, then use the onDisconnect() method
      // to set up a callback that will be triggered when this client disconnects
      onDisconnect(userStatusRef).set({
        online: false,
        lastSeen: serverTimestamp(),
      });

      // Set the user's online status to true
      set(userStatusRef, {
        online: true,
        lastSeen: serverTimestamp(),
        userId: user.id,
        name: user.name,
        avatar: user.avatar ?? null,
        role: user.role,
      });
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (presenceRef.current) {
        set(presenceRef.current, {
          online: false,
          lastSeen: serverTimestamp(),
          userId: user.id,
          name: user.name,
          avatar: user.avatar ?? null,
          role: user.role,
        });
      }
    };
  }, [user]);

  return null;
}; 