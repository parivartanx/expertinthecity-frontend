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

// Interface for form data that matches the API expectations
export interface ExpertRegistrationData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  city?: string;
  bio?: string;
  avatar?: string | File;
  interests?: string[];
  tags?: string[];
  location?: {
    address?: string;
    country?: string;
    pincode?: string;
  };
  expertDetails?: {
    headline?: string;
    summary?: string;
    expertise?: string[];
    experience?: number;
    about?: string;
    availability?: string;
    hourlyRate?: number;
    certifications?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
    pricing?: string;
  };
  portfolioFiles?: File[];
  portfolioMedia?: File[];
}

// New interfaces for statistics
interface PlatformStats {
  totalExperts: number;
  totalUsers: number;
  totalPosts: number;
  activeClients: number;
  averageEarnings: number;
  topCategories: Array<{
    name: string;
    experts: number;
    users: number;
  }>;
  engagementMetrics: {
    averageDailyActiveUsers: number;
    averageSessionDuration: string;
    averageActionsPerSession: number;
    chatCompletionRate: number;
  };
}

interface ExpertEarningsData {
  baseEarnings: number;
  experienceMultiplier: number;
  categoryMultipliers: Record<string, number>;
  successStories: Array<{
    name: string;
    category: string;
    earnings: number;
    experience: number;
  }>;
}

interface ExpertState {
  expert: ExpertProfile | null;
  isLoading: boolean;
  error: string | null;
  platformStats: PlatformStats | null;
  earningsData: ExpertEarningsData | null;
  statsLoading: boolean;
  statsError: string | null;
  createExpertProfile: (data: ExpertRegistrationData) => Promise<void>;
  fetchExpertProfile: (id: string) => Promise<void>;
  updateExpertProfile: (data: Partial<ExpertProfile>) => Promise<void>;
  fetchPlatformStats: () => Promise<void>;
  fetchEarningsData: () => Promise<void>;
  clearExpert: () => void;
  clearError: () => void;
  clearStatsError: () => void;
}

export const useExpertStore = create<ExpertState>()((set) => ({
  expert: null,
  isLoading: false,
  error: null,
  platformStats: null,
  earningsData: null,
  statsLoading: false,
  statsError: null,

  createExpertProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Prepare the data for API submission
      const formData = new FormData();
      
      // Add basic user information
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (data.password) formData.append('password', data.password);
      if (data.phone) formData.append('phone', data.phone);
      if (data.city) formData.append('city', data.city);
      if (data.bio) formData.append('bio', data.bio);
      
      // Add location data
      if (data.location) {
        if (data.location.address) formData.append('location[address]', data.location.address);
        if (data.location.country) formData.append('location[country]', data.location.country);
        if (data.location.pincode) formData.append('location[pincode]', data.location.pincode);
      }
      
      // Add interests and tags
      if (data.interests && data.interests.length > 0) {
        data.interests.forEach((interest, index) => {
          formData.append(`interests[${index}]`, interest);
        });
      }
      
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
      
      // Add expert details
      if (data.expertDetails) {
        if (data.expertDetails.headline) formData.append('expertDetails[headline]', data.expertDetails.headline);
        if (data.expertDetails.summary) formData.append('expertDetails[summary]', data.expertDetails.summary);
        if (data.expertDetails.about) formData.append('expertDetails[about]', data.expertDetails.about);
        if (data.expertDetails.availability) formData.append('expertDetails[availability]', data.expertDetails.availability);
        if (data.expertDetails.hourlyRate) formData.append('expertDetails[hourlyRate]', data.expertDetails.hourlyRate.toString());
        if (data.expertDetails.certifications) formData.append('expertDetails[certifications]', data.expertDetails.certifications);
        if (data.expertDetails.linkedin) formData.append('expertDetails[linkedin]', data.expertDetails.linkedin);
        if (data.expertDetails.website) formData.append('expertDetails[website]', data.expertDetails.website);
        if (data.expertDetails.instagram) formData.append('expertDetails[instagram]', data.expertDetails.instagram);
        if (data.expertDetails.pricing) formData.append('expertDetails[pricing]', data.expertDetails.pricing);
        
        if (data.expertDetails.expertise && data.expertDetails.expertise.length > 0) {
          data.expertDetails.expertise.forEach((expertise, index) => {
            formData.append(`expertDetails[expertise][${index}]`, expertise);
          });
        }
        
        if (data.expertDetails.experience) formData.append('expertDetails[experience]', data.expertDetails.experience.toString());
      }
      
      // Add files
      if (data.portfolioFiles && data.portfolioFiles.length > 0) {
        data.portfolioFiles.forEach((file, index) => {
          formData.append(`portfolioFiles`, file);
        });
      }
      
      if (data.portfolioMedia && data.portfolioMedia.length > 0) {
        data.portfolioMedia.forEach((file, index) => {
          formData.append(`portfolioMedia`, file);
        });
      }
      
      // Add avatar if it's a file
      if (data.avatar) {
        if (typeof data.avatar === 'string') {
          formData.append('avatar', data.avatar);
        } else if (data.avatar instanceof File) {
          formData.append('avatar', data.avatar);
        }
      }

      const response = await axiosInstance.post("/become-expert", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status === "success") {
        set({ expert: response.data.data, isLoading: false });
      } else {
        throw new Error(response.data.message || "Failed to create expert profile");
      }
    } catch (error: any) {
      console.error("Expert profile creation error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create expert profile";
      set({ error: errorMessage, isLoading: false });
      throw error;
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

  fetchPlatformStats: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      const response = await axiosInstance.get("/platform/stats");
      if (response.data.status === "success") {
        set({ platformStats: response.data.data, statsLoading: false });
      } else {
        throw new Error(response.data.message || "Failed to fetch platform statistics");
      }
    } catch (error: any) {
      // Fallback to mock data if API fails
      const mockStats: PlatformStats = {
        totalExperts: 178,
        totalUsers: 1720,
        totalPosts: 3450,
        activeClients: 5000,
        averageEarnings: 25000,
        topCategories: [
          { name: 'Health & Wellness', experts: 42, users: 3200 },
          { name: 'Technology', experts: 35, users: 2800 },
          { name: 'Financial Planning', experts: 28, users: 2450 },
          { name: 'Education', experts: 25, users: 2100 },
          { name: 'Fitness', experts: 24, users: 1950 },
        ],
        engagementMetrics: {
          averageDailyActiveUsers: 820,
          averageSessionDuration: '9m 45s',
          averageActionsPerSession: 12.3,
          chatCompletionRate: 87.5,
        },
      };
      set({ platformStats: mockStats, statsLoading: false });
    }
  },

  fetchEarningsData: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      const response = await axiosInstance.get("/experts/earnings-data");
      if (response.data.status === "success") {
        set({ earningsData: response.data.data, statsLoading: false });
      } else {
        throw new Error(response.data.message || "Failed to fetch earnings data");
      }
    } catch (error: any) {
      // Fallback to mock data if API fails
      const mockEarningsData: ExpertEarningsData = {
        baseEarnings: 20000,
        experienceMultiplier: 1.2,
        categoryMultipliers: {
          'Technology': 1.3,
          'Financial Planning': 1.4,
          'Health & Wellness': 1.2,
          'Education': 1.1,
          'Fitness': 1.0,
        },
        successStories: [
          { name: "Sarah Johnson", category: "Technology", earnings: 45000, experience: 3 },
          { name: "Michael Chen", category: "Financial Planning", earnings: 52000, experience: 5 },
          { name: "Dr. Emily Rodriguez", category: "Health & Wellness", earnings: 38000, experience: 2 },
        ],
      };
      set({ earningsData: mockEarningsData, statsLoading: false });
    }
  },

  clearExpert: () => set({ expert: null, isLoading: false, error: null }),
  clearError: () => set({ error: null }),
  clearStatsError: () => set({ statsError: null }),
})); 