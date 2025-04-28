"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { mockUsers } from "@/lib/mock-data";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  lastActive: string;
  verified: boolean;
  profilePicture?: string;
  bio?: string;
  location?: string;
  profileVisitors: number;
  preferences: string[];
  chatHistory: {
    id: string;
    expertId: string;
    expertName: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
  }[];
}

interface UsersContextType {
  users: User[];
  updateUser: (user: User) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  return (
    <UsersContext.Provider value={{ users, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
} 