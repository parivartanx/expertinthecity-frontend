import { create } from "zustand";
import { axiosInstance } from "./axios";

interface Expert {
  id: string;
  name: string;
  title?: string;
  location: string;
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

interface AllExpertsState {
  experts: Expert[];
  isLoading: boolean;
  error: string | null;
  totalExperts: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  location: string;
  selectedServices: string[];
  selectedRatings: number[];
  filters: {
    category?: string;
    subcategory?: string;
    location?: string;
    rating?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    availability?: string;
  };
  
  // Actions
  fetchExpertsBySubcategory: (subcategory: string, page?: number, limit?: number) => Promise<void>;
  fetchExpertsByCategory: (category: string, page?: number, limit?: number) => Promise<void>;
  fetchAllExperts: (page?: number, limit?: number) => Promise<void>;
  fetchExperts: () => Promise<void>;
  searchExperts: (query: string, page?: number, limit?: number) => Promise<void>;
  filterExperts: (filters: Partial<AllExpertsState['filters']>, page?: number, limit?: number) => Promise<void>;
  clearExperts: () => void;
  clearError: () => void;
  setFilters: (filters: Partial<AllExpertsState['filters']>) => void;
  resetFilters: () => void;
  
  // Search and filter actions
  setSearchQuery: (query: string) => void;
  setLocation: (location: string) => void;
  toggleService: (service: string) => void;
  toggleRating: (rating: number) => void;
}

export const useExpertStore = create<AllExpertsState>()((set, get) => ({
  experts: [],
  isLoading: false,
  error: null,
  totalExperts: 0,
  currentPage: 1,
  totalPages: 1,
  searchQuery: "",
  location: "",
  selectedServices: [],
  selectedRatings: [],
  filters: {},

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setLocation: (location: string) => set({ location }),

  toggleService: (service: string) => {
    const { selectedServices } = get();
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    set({ selectedServices: newServices });
  },

  toggleRating: (rating: number) => {
    const { selectedRatings } = get();
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    set({ selectedRatings: newRatings });
  },

  fetchExperts: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { searchQuery, location, selectedServices, selectedRatings } = get();
      
      // Build query parameters
      const params: any = {
        page: 1,
        limit: 12
      };

      if (searchQuery) {
        params.q = searchQuery;
      }

      if (location) {
        params.location = location;
      }

      if (selectedServices.length > 0) {
        params.services = selectedServices.join(',');
      }

      if (selectedRatings.length > 0) {
        params.minRating = Math.min(...selectedRatings);
      }

      const response = await axiosInstance.get("/experts", { params });

      if (response.data.status === "success") {
        const { experts, totalExperts, currentPage, totalPages } = response.data.data;
        set({
          experts,
          totalExperts,
          currentPage,
          totalPages,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch experts");
      }
    } catch (error: any) {
      console.error("Error fetching experts:", error);
      set({
        error: error.response?.data?.message || error.message || "Failed to fetch experts",
        isLoading: false,
        experts: []
      });
    }
  },

  fetchExpertsBySubcategory: async (subcategory: string, page = 1, limit = 12) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get(`/experts/subcategory/${subcategory}`, {
        params: {
          page,
          limit,
          ...get().filters
        }
      });

      if (response.data.status === "success") {
        const { experts, totalExperts, currentPage, totalPages } = response.data.data;
        set({
          experts,
          totalExperts,
          currentPage,
          totalPages,
          isLoading: false,
          filters: { ...get().filters, subcategory }
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch experts");
      }
    } catch (error: any) {
      console.error("Error fetching experts by subcategory:", error);
      set({
        error: error.response?.data?.message || error.message || "Failed to fetch experts",
        isLoading: false,
        experts: []
      });
    }
  },

  fetchExpertsByCategory: async (category: string, page = 1, limit = 12) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get(`/experts/category/${category}`, {
        params: {
          page,
          limit,
          ...get().filters
        }
      });

      if (response.data.status === "success") {
        const { experts, totalExperts, currentPage, totalPages } = response.data.data;
        set({
          experts,
          totalExperts,
          currentPage,
          totalPages,
          isLoading: false,
          filters: { ...get().filters, category }
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch experts");
      }
    } catch (error: any) {
      console.error("Error fetching experts by category:", error);
      set({
        error: error.response?.data?.message || error.message || "Failed to fetch experts",
        isLoading: false,
        experts: []
      });
    }
  },

  fetchAllExperts: async (page = 1, limit = 12) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get("/experts", {
        params: {
          page,
          limit,
          ...get().filters
        }
      });

      if (response.data.status === "success") {
        const { experts, totalExperts, currentPage, totalPages } = response.data.data;
        set({
          experts,
          totalExperts,
          currentPage,
          totalPages,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch experts");
      }
    } catch (error: any) {
      console.error("Error fetching all experts:", error);
      set({
        error: error.response?.data?.message || error.message || "Failed to fetch experts",
        isLoading: false,
        experts: []
      });
    }
  },

  searchExperts: async (query: string, page = 1, limit = 12) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get("/experts/search", {
        params: {
          q: query,
          page,
          limit,
          ...get().filters
        }
      });

      if (response.data.status === "success") {
        const { experts, totalExperts, currentPage, totalPages } = response.data.data;
        set({
          experts,
          totalExperts,
          currentPage,
          totalPages,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Failed to search experts");
      }
    } catch (error: any) {
      console.error("Error searching experts:", error);
      set({
        error: error.response?.data?.message || error.message || "Failed to search experts",
        isLoading: false,
        experts: []
      });
    }
  },

  filterExperts: async (filters: Partial<AllExpertsState['filters']>, page = 1, limit = 12) => {
    try {
      set({ isLoading: true, error: null });
      
      const newFilters = { ...get().filters, ...filters };
      set({ filters: newFilters });
      
      const response = await axiosInstance.get("/experts/filter", {
        params: {
          page,
          limit,
          ...newFilters
        }
      });

      if (response.data.status === "success") {
        const { experts, totalExperts, currentPage, totalPages } = response.data.data;
        set({
          experts,
          totalExperts,
          currentPage,
          totalPages,
          isLoading: false
        });
      } else {
        throw new Error(response.data.message || "Failed to filter experts");
      }
    } catch (error: any) {
      console.error("Error filtering experts:", error);
      set({
        error: error.response?.data?.message || error.message || "Failed to filter experts",
        isLoading: false,
        experts: []
      });
    }
  },

  clearExperts: () => set({
    experts: [],
    totalExperts: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null
  }),

  clearError: () => set({ error: null }),

  setFilters: (filters: Partial<AllExpertsState['filters']>) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  resetFilters: () => set({ filters: {} }),
})); 