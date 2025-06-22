import { create } from "zustand";
import { axiosInstance } from "./axios";

// Nested types for expert details
interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  skills?: string[];
}

interface Award {
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  grade?: string;
  activities?: string;
}

interface Location {
  pincode?: string;
  address?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface ExpertDetails {
  headline?: string;
  summary?: string;
  expertise?: string[];
  experience?: number;
  hourlyRate?: number;
  about?: string;
  availability?: string;
  languages?: string[];
  certifications?: Certification[];
  verified?: boolean;
  experiences?: Experience[];
  awards?: Award[];
  education?: Education[];
  badges?: string[];
  progressLevel?: string;
  progressShow?: boolean;
  ratings?: number;
}

export interface ExpertProfile {
  id?: string;
  name: string;
  email: string;
  password?: string;
  bio?: string;
  avatar?: string;
  interests?: string[];
  tags?: string[];
  location?: Location;
  expertDetails?: ExpertDetails;
  createdAt?: string;
  updatedAt?: string;
}

interface ExpertState {
  expert: ExpertProfile | null;
  isLoading: boolean;
  error: string | null;
  createExpertProfile: (data: Partial<ExpertProfile>) => Promise<void>;
  fetchExpertProfile: (id: string) => Promise<void>;
  updateExpertProfile: (data: Partial<ExpertProfile>) => Promise<void>;
  clearExpert: () => void;
  clearError: () => void;
}

export const useExpertStore = create<ExpertState>()((set) => ({
  expert: null,
  isLoading: false,
  error: null,

  createExpertProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/become-expert", data);
      if (response.data.status === "success") {
        set({ expert: response.data.data, isLoading: false });
      } else {
        throw new Error(response.data.message || "Failed to create expert profile");
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to create expert profile", isLoading: false });
    }
  },

  fetchExpertProfile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/experts/${id}`);
      if (response.data.status === "success") {
        set({ expert: response.data.data, isLoading: false });
      } else {
        throw new Error(response.data.message || "Failed to fetch expert profile");
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch expert profile", isLoading: false });
    }
  },

  updateExpertProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch("/experts/profile", data);
      if (response.data.status === "success") {
        set({ expert: response.data.data, isLoading: false });
      } else {
        throw new Error(response.data.message || "Failed to update expert profile");
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to update expert profile", isLoading: false });
    }
  },

  clearExpert: () => set({ expert: null, isLoading: false, error: null }),
  clearError: () => set({ error: null }),
})); 