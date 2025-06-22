import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

interface Follower {
  id: string;
  follower: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

interface Following {
  id: string;
  following: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  grade?: string;
  activities?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpertDetails {
  id: string;
  headline?: string;
  summary?: string;
  expertise?: string[];
  experience?: string;
  hourlyRate?: number;
  about?: string;
  availability?: string;
  languages?: string[];
  verified?: boolean;
  badges?: string[];
  progressLevel?: string;
  progressShow?: boolean;
  ratings?: number;
  createdAt: string;
  updatedAt: string;
  certifications?: Certification[];
  experiences?: Experience[];
  awards?: Award[];
  education?: Education[];
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  interests?: string[];
  tags?: string[];
  location?: string;
  createdAt: string;
  updatedAt: string;
  posts: Post[];
  followers: Follower[];
  following: Following[];
  _count: {
    posts: number;
    followers: number;
    following: number;
    comments: number;
    likes: number;
  };
  expertDetails?: ExpertDetails;
  address?: {
    pincode?: string;
    address?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isProfileLoaded: boolean;
  
  // Actions
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      isProfileLoaded: false,

      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/users/profile");
          
          if (response.data.status === "success") {
            // Handle nested user data structure
            const userData = response.data.data.user || response.data.data;
            
            // Transform the API response to match our UserProfile interface
            const profile: UserProfile = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              avatar: userData.avatar,
              bio: userData.bio,
              interests: userData.interests || [],
              location: userData.location,
              address: userData.location,
              followers: userData._count?.followers || userData.followers?.length || 0,
              tags: userData.tags || [],
              following: userData.following || [],
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
              posts: userData.posts || [],
              _count: {
                posts: userData._count?.posts || userData.posts?.length || 0,
                followers: userData._count?.followers || userData.followers?.length || 0,
                following: userData._count?.following || userData.following?.length || 0,
                comments: userData._count?.comments || userData.comments?.length || 0,
                likes: userData._count?.likes || userData.likes?.length || 0,
              },
              expertDetails: userData.expertDetails,
            };
            
            set({
              profile,
              isLoading: false,
              isProfileLoaded: true,
            });
          } else {
            throw new Error(response.data.message || "Failed to fetch profile");
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          
          let errorMessage = "Failed to fetch profile";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Profile not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            isProfileLoaded: false,
          });
        }
      },

      updateUserProfile: async (profileData: Partial<UserProfile>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.patch("/users/profile", profileData);
          
          if (response.data.status === "success") {
            // Handle nested user data structure
            const userData = response.data.data.user || response.data.data;
            
            // Transform the API response to match our UserProfile interface
            const updatedProfile: UserProfile = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              avatar: userData.avatar,
              bio: userData.bio,
              interests: userData.interests || [],
              location: userData.location,
              address: userData.location,
              followers: userData._count?.followers || userData.followers?.length || 0,
              tags: userData.tags || [],
              following: userData.following || [],
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
              posts: userData.posts || [],
              _count: {
                posts: userData._count?.posts || userData.posts?.length || 0,
                followers: userData._count?.followers || userData.followers?.length || 0,
                following: userData._count?.following || userData.following?.length || 0,
                comments: userData._count?.comments || userData.comments?.length || 0,
                likes: userData._count?.likes || userData.likes?.length || 0,
              },
              expertDetails: userData.expertDetails,
            };
            
            set({
              profile: updatedProfile,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.message || "Failed to update profile");
          }
        } catch (error: any) {
          console.error("Error updating user profile:", error);
          
          let errorMessage = "Failed to update profile";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = "Invalid profile data";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      clearProfile: () => {
        set({
          profile: null,
          isLoading: false,
          error: null,
          isProfileLoaded: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "user-profile-storage",
      partialize: (state) => ({
        profile: state.profile,
        isProfileLoaded: state.isProfileLoaded,
      }),
    }
  )
); 