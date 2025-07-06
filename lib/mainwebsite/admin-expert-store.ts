import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

export interface AdminExpert {
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
  rating: number;
  profileVisitors: number;
  expertDetails?: {
    category?: string;
    experience?: string;
    skills?: string[];
    profileCompletion?: number;
    featured?: boolean;
  };
  stats?: {
    followers?: number;
    rating?: number;
    profileVisitors?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminExpertPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface AdminExpertState {
  experts: AdminExpert[];
  pagination: AdminExpertPagination | null;
  selectedExpert: AdminExpert | null;
  isLoading: boolean;
  error: string | null;
  fetchExperts: (params?: { page?: number; limit?: number; search?: string; category?: string; status?: string; sortBy?: string; sortOrder?: string; startDate?: string; endDate?: string }) => Promise<void>;
  fetchExpertById: (id: string) => Promise<void>;
  updateExpert: (id: string, data: Partial<AdminExpert>) => Promise<void>;
  deleteExpert: (id: string) => Promise<void>;
  activateExpert: (id: string) => Promise<void>;
  deactivateExpert: (id: string) => Promise<void>;
  verifyExpert: (id: string) => Promise<void>;
  featureExpert: (id: string, featured: boolean) => Promise<void>;
  clearError: () => void;
}

// Helper function to refresh admin token
const refreshAdminToken = async () => {
  try {
    const adminRefreshToken = localStorage.getItem("adminRefreshToken");
    if (!adminRefreshToken) {
      throw new Error("No admin refresh token available");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
    const response = await fetch(`${baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: adminRefreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh admin token");
    }

    const data = await response.json();
    
    if (data.status === "success") {
      const { accessToken, refreshToken } = data;
      localStorage.setItem("adminAccessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("adminRefreshToken", refreshToken);
      }
      return accessToken;
    } else {
      throw new Error("Invalid refresh token response");
    }
  } catch (error) {
    // Clear admin tokens on refresh failure
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    throw error;
  }
};

// Helper function to make authenticated admin API calls
const makeAdminApiCall = async (url: string, options: RequestInit = {}) => {
  const adminToken = localStorage.getItem("adminAccessToken");
  
  if (!adminToken) {
    throw new Error("No admin access token available");
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Try to refresh token
      const newToken = await refreshAdminToken();
      
      // Retry with new token
      const retryConfig = {
        ...config,
        headers: {
          ...config.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      };
      
      const retryResponse = await fetch(url, retryConfig);
      
      if (!retryResponse.ok) {
        throw new Error(`API call failed: ${retryResponse.status}`);
      }
      
      return retryResponse;
    }
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("No admin access token available")) {
      // Redirect to admin login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    throw error;
  }
};

export const useAdminExpertStore = create<AdminExpertState>()(
  persist(
    (set, get) => ({
      experts: [],
      pagination: null,
      selectedExpert: null,
      isLoading: false,
      error: null,

      fetchExperts: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const queryParams = new URLSearchParams();
          
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
          
          const url = `${baseURL}/admin/experts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          const response = await makeAdminApiCall(url);
          const data = await response.json();
          
          if (data.status === "success" && data.data) {
            const { experts, pagination } = data.data;
            set({
              experts: experts.map((expert: any) => ({
                id: expert.user?.id || expert.id,
                name: expert.user?.name || expert.name || "",
                email: expert.user?.email || expert.email || "",
                category: expert.expertise?.[0] || expert.headline || "",
                status: expert.user?.role === "EXPERT" ? "active" : "inactive",
                profileCompletion: expert.profileCompletion || 0,
                followers: expert.user?._count?.followers || 0,
                joinedAt: expert.user?.createdAt || expert.createdAt || "",
                lastActive: expert.user?.updatedAt || expert.updatedAt || "",
                verified: expert.verified ?? false,
                experience: expert.experience || expert.summary || "",
                skills: expert.expertise || [],
                featured: expert.featured || false,
                rating: expert.user?.ratings?.[0]?.rating || 0,
                profileVisitors: expert.user?._count?.followers || 0,
                expertDetails: expert,
                stats: expert.user?._count,
                createdAt: expert.user?.createdAt || expert.createdAt,
                updatedAt: expert.user?.updatedAt || expert.updatedAt,
              })),
              pagination,
              isLoading: false,
            });
          } else {
            throw new Error("Invalid experts response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch experts";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchExpertById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/experts/${id}`;
          const response = await makeAdminApiCall(url);
          const data = await response.json();
          
          if (data.status === "success" && data.data && data.data.expert) {
            const expert = data.data.expert;
            set({
              selectedExpert: {
                id: expert.id,
                name: expert.name,
                email: expert.email,
                category: expert.expertDetails?.category || "",
                status: expert.status || "active",
                profileCompletion: expert.expertDetails?.profileCompletion || 0,
                followers: expert.stats?.followers || 0,
                joinedAt: expert.createdAt || "",
                lastActive: expert.updatedAt || "",
                verified: expert.verified ?? false,
                experience: expert.expertDetails?.experience || "",
                skills: expert.expertDetails?.skills || [],
                featured: expert.expertDetails?.featured || false,
                rating: expert.stats?.rating || 0,
                profileVisitors: expert.stats?.profileVisitors || 0,
                expertDetails: expert.expertDetails,
                stats: expert.stats,
                createdAt: expert.createdAt,
                updatedAt: expert.updatedAt,
              },
              isLoading: false,
            });
          } else {
            throw new Error("Invalid expert response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to fetch expert";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      updateExpert: async (id: string, data: Partial<AdminExpert>) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/experts/${id}`;
          const response = await makeAdminApiCall(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
          });
          const responseData = await response.json();
          
          if (responseData.status === "success" && responseData.data && responseData.data.expert) {
            const updatedExpert = responseData.data.expert;
            const mappedExpert = {
              id: updatedExpert.id,
              name: updatedExpert.name,
              email: updatedExpert.email,
              category: updatedExpert.expertDetails?.category || "",
              status: updatedExpert.status || "active",
              profileCompletion: updatedExpert.expertDetails?.profileCompletion || 0,
              followers: updatedExpert.stats?.followers || 0,
              joinedAt: updatedExpert.createdAt || "",
              lastActive: updatedExpert.updatedAt || "",
              verified: updatedExpert.verified ?? false,
              experience: updatedExpert.expertDetails?.experience || "",
              skills: updatedExpert.expertDetails?.skills || [],
              featured: updatedExpert.expertDetails?.featured || false,
              rating: updatedExpert.stats?.rating || 0,
              profileVisitors: updatedExpert.stats?.profileVisitors || 0,
              expertDetails: updatedExpert.expertDetails,
              stats: updatedExpert.stats,
              createdAt: updatedExpert.createdAt,
              updatedAt: updatedExpert.updatedAt,
            };
            
            set((state) => ({
              experts: state.experts.map((e) => e.id === id ? mappedExpert : e),
              selectedExpert: mappedExpert,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid update expert response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to update expert";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteExpert: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/experts/${id}`;
          await makeAdminApiCall(url, {
            method: 'DELETE',
          });
          
          set((state) => ({
            experts: state.experts.filter((e) => e.id !== id),
            selectedExpert: state.selectedExpert && state.selectedExpert.id === id ? null : state.selectedExpert,
            isLoading: false,
          }));
        } catch (error: any) {
          let errorMessage = "Failed to delete expert";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      activateExpert: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/experts/${id}/activate`;
          const response = await makeAdminApiCall(url, {
            method: 'PATCH',
          });
          const responseData = await response.json();
          
          if (responseData.status === "success" && responseData.data && responseData.data.expert) {
            const updatedExpert = responseData.data.expert;
            const mappedExpert = {
              id: updatedExpert.id,
              name: updatedExpert.name,
              email: updatedExpert.email,
              category: updatedExpert.expertDetails?.category || "",
              status: "active",
              profileCompletion: updatedExpert.expertDetails?.profileCompletion || 0,
              followers: updatedExpert.stats?.followers || 0,
              joinedAt: updatedExpert.createdAt || "",
              lastActive: updatedExpert.updatedAt || "",
              verified: updatedExpert.verified ?? false,
              experience: updatedExpert.expertDetails?.experience || "",
              skills: updatedExpert.expertDetails?.skills || [],
              featured: updatedExpert.expertDetails?.featured || false,
              rating: updatedExpert.stats?.rating || 0,
              profileVisitors: updatedExpert.stats?.profileVisitors || 0,
              expertDetails: updatedExpert.expertDetails,
              stats: updatedExpert.stats,
              createdAt: updatedExpert.createdAt,
              updatedAt: updatedExpert.updatedAt,
            };
            
            set((state) => ({
              experts: state.experts.map((e) => e.id === id ? mappedExpert : e),
              selectedExpert: mappedExpert,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid activate expert response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to activate expert";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      deactivateExpert: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/experts/${id}/deactivate`;
          const response = await makeAdminApiCall(url, {
            method: 'PATCH',
          });
          const responseData = await response.json();
          
          if (responseData.status === "success" && responseData.data && responseData.data.expert) {
            const updatedExpert = responseData.data.expert;
            const mappedExpert = {
              id: updatedExpert.id,
              name: updatedExpert.name,
              email: updatedExpert.email,
              category: updatedExpert.expertDetails?.category || "",
              status: "inactive",
              profileCompletion: updatedExpert.expertDetails?.profileCompletion || 0,
              followers: updatedExpert.stats?.followers || 0,
              joinedAt: updatedExpert.createdAt || "",
              lastActive: updatedExpert.updatedAt || "",
              verified: updatedExpert.verified ?? false,
              experience: updatedExpert.expertDetails?.experience || "",
              skills: updatedExpert.expertDetails?.skills || [],
              featured: updatedExpert.expertDetails?.featured || false,
              rating: updatedExpert.stats?.rating || 0,
              profileVisitors: updatedExpert.stats?.profileVisitors || 0,
              expertDetails: updatedExpert.expertDetails,
              stats: updatedExpert.stats,
              createdAt: updatedExpert.createdAt,
              updatedAt: updatedExpert.updatedAt,
            };
            
            set((state) => ({
              experts: state.experts.map((e) => e.id === id ? mappedExpert : e),
              selectedExpert: mappedExpert,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid deactivate expert response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to deactivate expert";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      verifyExpert: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/experts/${id}/verify`;
          const response = await makeAdminApiCall(url, {
            method: 'PATCH',
          });
          const responseData = await response.json();
          
          if (responseData.status === "success" && responseData.data && responseData.data.expert) {
            const updatedExpert = responseData.data.expert;
            const mappedExpert = {
              id: updatedExpert.id,
              name: updatedExpert.name,
              email: updatedExpert.email,
              category: updatedExpert.expertDetails?.category || "",
              status: updatedExpert.status || "active",
              profileCompletion: updatedExpert.expertDetails?.profileCompletion || 0,
              followers: updatedExpert.stats?.followers || 0,
              joinedAt: updatedExpert.createdAt || "",
              lastActive: updatedExpert.updatedAt || "",
              verified: true,
              experience: updatedExpert.expertDetails?.experience || "",
              skills: updatedExpert.expertDetails?.skills || [],
              featured: updatedExpert.expertDetails?.featured || false,
              rating: updatedExpert.stats?.rating || 0,
              profileVisitors: updatedExpert.stats?.profileVisitors || 0,
              expertDetails: updatedExpert.expertDetails,
              stats: updatedExpert.stats,
              createdAt: updatedExpert.createdAt,
              updatedAt: updatedExpert.updatedAt,
            };
            
            set((state) => ({
              experts: state.experts.map((e) => e.id === id ? mappedExpert : e),
              selectedExpert: mappedExpert,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid verify expert response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to verify expert";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      featureExpert: async (id: string, featured: boolean) => {
        try {
          set({ isLoading: true, error: null });
          
          const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://experts-in-the-city-backend.vercel.app/api";
          const url = `${baseURL}/admin/experts/${id}/feature`;
          const response = await makeAdminApiCall(url, {
            method: 'PATCH',
            body: JSON.stringify({ featured }),
          });
          const responseData = await response.json();
          
          if (responseData.status === "success" && responseData.data && responseData.data.expert) {
            const updatedExpert = responseData.data.expert;
            const mappedExpert = {
              id: updatedExpert.id,
              name: updatedExpert.name,
              email: updatedExpert.email,
              category: updatedExpert.expertDetails?.category || "",
              status: updatedExpert.status || "active",
              profileCompletion: updatedExpert.expertDetails?.profileCompletion || 0,
              followers: updatedExpert.stats?.followers || 0,
              joinedAt: updatedExpert.createdAt || "",
              lastActive: updatedExpert.updatedAt || "",
              verified: updatedExpert.verified ?? false,
              experience: updatedExpert.expertDetails?.experience || "",
              skills: updatedExpert.expertDetails?.skills || [],
              featured: featured,
              rating: updatedExpert.stats?.rating || 0,
              profileVisitors: updatedExpert.stats?.profileVisitors || 0,
              expertDetails: updatedExpert.expertDetails,
              stats: updatedExpert.stats,
              createdAt: updatedExpert.createdAt,
              updatedAt: updatedExpert.updatedAt,
            };
            
            set((state) => ({
              experts: state.experts.map((e) => e.id === id ? mappedExpert : e),
              selectedExpert: mappedExpert,
              isLoading: false,
            }));
          } else {
            throw new Error("Invalid feature expert response format");
          }
        } catch (error: any) {
          let errorMessage = "Failed to feature expert";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-expert-storage",
      partialize: (state) => ({
        experts: state.experts,
        pagination: state.pagination,
        selectedExpert: state.selectedExpert,
      }),
    }
  )
); 