"use client";
import { usePresence } from "@/hooks/use-presence";

interface PresenceProviderProps {
  children: React.ReactNode;
}

const PresenceProvider: React.FC<PresenceProviderProps> = ({ children }) => {
  usePresence();
  return <>{children}</>;
};

export default PresenceProvider; 