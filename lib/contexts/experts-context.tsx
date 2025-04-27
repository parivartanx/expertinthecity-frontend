"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { mockExperts } from "@/lib/mock-data";

interface Expert {
  id: string;
  name: string;
  email: string;
  category: string;
  status: string;
  profileCompletion: number;
  followers: number;
  joinedAt: string;
  lastActive: string;
  verified: boolean;
  experience: string;
  skills: string[];
  featured: boolean;
}

interface ExpertsContextType {
  experts: Expert[];
  updateExpert: (expert: Expert) => void;
}

const ExpertsContext = createContext<ExpertsContextType | undefined>(undefined);

export function ExpertsProvider({ children }: { children: ReactNode }) {
  const [experts, setExperts] = useState<Expert[]>(mockExperts);

  const updateExpert = (updatedExpert: Expert) => {
    setExperts(prevExperts =>
      prevExperts.map(expert =>
        expert.id === updatedExpert.id ? updatedExpert : expert
      )
    );
  };

  return (
    <ExpertsContext.Provider value={{ experts, updateExpert }}>
      {children}
    </ExpertsContext.Provider>
  );
}

export function useExperts() {
  const context = useContext(ExpertsContext);
  if (context === undefined) {
    throw new Error("useExperts must be used within an ExpertsProvider");
  }
  return context;
} 