import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

// Helper function to get category icon
const getCategoryIcon = (category: string): string => {
  const categoryIcons: { [key: string]: string } = {
    "Career Coaching": "HiAcademicCap",
    Technology: "HiCode",
    "Business Strategy": "HiChartBar",
    Marketing: "HiPresentationChartLine",
    Finance: "HiCurrencyDollar",
    "Health & Wellness": "HiHeart",
    Education: "HiAcademicCap",
    Design: "HiPencil",
    Sales: "HiTrendingUp",
    Leadership: "HiUserGroup",
    Consulting: "HiBriefcase",
    Coaching: "HiAcademicCap",
  };

  return categoryIcons[category] || "HiAcademicCap";
};

interface Expert {
  id: string;
  name: string;
  title?: string;
  location: string | { address?: string; country?: string };
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
  fetchExpertsBySubcategory: (
    subcategory: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  fetchExpertsByCategory: (
    category: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  fetchAllExperts: (page?: number, limit?: number) => Promise<void>;
  fetchExperts: () => Promise<void>;
  searchExperts: (
    query: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  filterExperts: (
    filters: Partial<AllExpertsState["filters"]>,
    page?: number,
    limit?: number
  ) => Promise<void>;
  clearExperts: () => void;
  clearSearchState: () => void;
  clearAllState: () => void;
  clearError: () => void;
  setFilters: (filters: Partial<AllExpertsState["filters"]>) => void;
  resetFilters: () => void;

  // Search and filter actions
  setSearchQuery: (query: string) => void;
  setLocation: (location: string) => void;
  toggleService: (service: string) => void;
  toggleRating: (rating: number) => void;

  // New actions for expert details and messaging
  getExpertById: (expertId: string) => Promise<Expert | null>;
  sendMessageToExpert: (expertId: string, message: string) => Promise<boolean>;

  // Search suggestions for header
  searchSuggestions: (query: string) => Promise<{
    experts: Expert[];
    categories: { id: string; name: string; icon: string }[];
  }>;
}

export const useAllExpertsStore = create<AllExpertsState>()(
  persist(
    (set, get) => ({
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
          ? selectedServices.filter((s) => s !== service)
          : [...selectedServices, service];
        set({ selectedServices: newServices });
      },

      toggleRating: (rating: number) => {
        const { selectedRatings } = get();
        const newRatings = selectedRatings.includes(rating)
          ? selectedRatings.filter((r) => r !== rating)
          : [...selectedRatings, rating];
        set({ selectedRatings: newRatings });
      },

      fetchExperts: async () => {
        try {
          set({ isLoading: true, error: null });

          const { searchQuery, location, selectedServices, selectedRatings } =
            get();

          // Build query parameters
          const params: any = {
            page: 1,
            limit: 12,
          };

          // Combine searchQuery and location for the search param
          if (searchQuery && location) {
            params.search = `${searchQuery} ${location}`;
          } else if (searchQuery) {
            params.search = searchQuery;
          } else if (location) {
            params.search = location;
          }

          if (selectedServices.length > 0) {
            params.expertise = selectedServices.join(",");
          }

          if (selectedRatings && selectedRatings.length > 0) {
            params.minRating = Math.min(...selectedRatings);
          }

          const response = await axiosInstance.get("/experts", { params });

          if (response.data.status === "success") {
            const { experts, totalExperts, currentPage, totalPages } =
              response.data.data;
            // Transform the backend expert data to match frontend interface
            const transformedExperts = experts.map((expert: any) => ({
              id: expert.id,
              name: expert.user?.name || expert.headline || "Expert",
              title: expert.headline,
              location:
                typeof expert.user?.location === "object"
                  ? [expert.user.location.address, expert.user.location.country]
                      .filter(Boolean)
                      .join(", ")
                  : expert.user?.location || "Remote",
              rating: expert.user?.ratings || 0,
              reviews: expert.user?.reviews || 0,
              categories: expert.expertise || [],
              tags: expert.user?.tags || [],
              image:
                expert.user?.avatar ||
                "https://randomuser.me/api/portraits/men/1.jpg",
              status: expert.user?.role === "EXPERT" ? "Verified" : undefined,
              bio: expert.user?.bio,
              description: expert.summary,
              hourlyRate: expert.hourlyRate,
              verified: expert.user?.role === "EXPERT",
              expertise: expert.expertise || [],
              experience: expert.experience,
              availability: expert.availability,
              languages: expert.languages || [],
            }));
            set({
              experts: transformedExperts,
              totalExperts,
              currentPage,
              totalPages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.message || "Failed to fetch experts");
          }
        } catch (error: any) {
          console.error("Error fetching experts:", error);

          let errorMessage = "Failed to fetch experts";

          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Experts not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
            experts: [],
          });
        }
      },

      fetchExpertsBySubcategory: async (
        subcategory: string,
        page = 1,
        limit = 12
      ) => {
        try {
          set({ isLoading: true, error: null });

          // Use the correct API endpoint for listing experts with subcategory filter
          const response = await axiosInstance.get(`/experts`, {
            params: {
              page,
              limit,
              subcategory,
              ...get().filters,
            },
          });

          if (response.data.status === "success") {
            const { experts, totalExperts, currentPage, totalPages } =
              response.data.data;

            // Transform the backend expert data to match frontend interface
            const transformedExperts = experts.map((expert: any) => ({
              id: expert.id,
              name: expert.user?.name || expert.headline || "Expert",
              title: expert.headline,
              location:
                typeof expert.user?.location === "object"
                  ? [expert.user.location.address, expert.user.location.country]
                      .filter(Boolean)
                      .join(", ")
                  : expert.user?.location || "Remote",
              rating: expert.user?.ratings || 0,
              reviews: expert.user?.reviews || 0,
              categories: expert.expertise || [],
              tags: expert.user?.tags || [],
              image:
                expert.user?.avatar ||
                "https://randomuser.me/api/portraits/men/1.jpg",
              status: expert.user?.role === "EXPERT" ? "Verified" : undefined,
              bio: expert.user?.bio,
              description: expert.summary,
              hourlyRate: expert.hourlyRate,
              verified: expert.user?.role === "EXPERT",
              expertise: expert.expertise || [],
              experience: expert.experience,
              availability: expert.availability,
              languages: expert.languages || [],
            }));

            set({
              experts: transformedExperts,
              totalExperts: totalExperts || experts.length,
              currentPage: currentPage || page,
              totalPages: totalPages || 1,
              isLoading: false,
              filters: { ...get().filters, subcategory },
            });
          } else {
            throw new Error(response.data.message || "Failed to fetch experts");
          }
        } catch (error: any) {
          console.error("Error fetching experts by subcategory:", error);

          let errorMessage = "Failed to fetch experts";

          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Experts not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
            experts: [],
          });
        }
      },

      fetchExpertsByCategory: async (
        category: string,
        page = 1,
        limit = 12
      ) => {
        try {
          set({ isLoading: true, error: null });
          // Use the correct API endpoint for listing experts with category filter (as a query param)
          const response = await axiosInstance.get(`/experts`, {
            params: {
              page,
              limit,
              expertise: category, // assuming 'expertise' is the category field in backend
              ...get().filters,
            },
          });

          if (response.data.status === "success") {
            const { experts, totalExperts, currentPage, totalPages } =
              response.data.data;
            // Transform the backend expert data to match frontend interface
            const transformedExperts = experts.map((expert: any) => ({
              id: expert.id,
              name: expert.user?.name || expert.headline || "Expert",
              title: expert.headline,
              location:
                typeof expert.user?.location === "object"
                  ? [expert.user.location.address, expert.user.location.country]
                      .filter(Boolean)
                      .join(", ")
                  : expert.user?.location || "Remote",
              rating: expert.user?.ratings || 0,
              reviews: expert.user?.reviews || 0,
              categories: expert.expertise || [],
              tags: expert.user?.tags || [],
              image:
                expert.user?.avatar ||
                "https://randomuser.me/api/portraits/men/1.jpg",
              status: expert.user?.role === "EXPERT" ? "Verified" : undefined,
              bio: expert.user?.bio,
              description: expert.summary,
              hourlyRate: expert.hourlyRate,
              verified: expert.user?.role === "EXPERT",
              expertise: expert.expertise || [],
              experience: expert.experience,
              availability: expert.availability,
              languages: expert.languages || [],
            }));
            set({
              experts: transformedExperts,
              totalExperts: totalExperts || experts.length,
              currentPage: currentPage || page,
              totalPages: totalPages || 1,
              isLoading: false,
              filters: { ...get().filters, category },
            });
          } else {
            throw new Error(response.data.message || "Failed to fetch experts");
          }
        } catch (error: any) {
          console.error("Error fetching experts by category:", error);
          let errorMessage = "Failed to fetch experts";
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Experts not found for this category";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          set({
            error: errorMessage,
            isLoading: false,
            experts: [],
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
              ...get().filters,
            },
          });

          if (response.data.status === "success") {
            const { experts, totalExperts, currentPage, totalPages } =
              response.data.data;
            set({
              experts,
              totalExperts,
              currentPage,
              totalPages,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.message || "Failed to fetch experts");
          }
        } catch (error: any) {
          console.error("Error fetching all experts:", error);

          let errorMessage = "Failed to fetch experts";

          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Experts not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
            experts: [],
          });
        }
      },

      searchExperts: async (query: string, page = 1, limit = 12) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axiosInstance.get("/experts", {
            params: {
              search: query,
              page,
              limit,
              ...get().filters,
            },
          });

          if (response.data.status === "success") {
            const { experts } = response.data.data;

            // Transform the backend expert data to match frontend interface
            const transformedExperts = experts.map((expert: any) => ({
              id: expert.id,
              name: expert.user?.name || expert.headline || "Expert",
              title: expert.headline,
              location:
                typeof expert.user?.location === "object"
                  ? [expert.user.location.address, expert.user.location.country]
                      .filter(Boolean)
                      .join(", ")
                  : expert.user?.location || "Remote",
              rating: expert.user?.ratings || 0,
              reviews: expert.user?.reviews || 0,
              categories: expert.expertise || [],
              tags: expert.user?.tags || [],
              image:
                expert.user?.avatar ||
                "https://randomuser.me/api/portraits/men/1.jpg",
              status: expert.user?.role === "EXPERT" ? "Verified" : undefined,
              bio: expert.user?.bio,
              description: expert.summary,
              hourlyRate: expert.hourlyRate,
              verified: expert.user?.role === "EXPERT",
              expertise: expert.expertise || [],
              experience: expert.experience,
              availability: expert.availability,
              languages: expert.languages || [],
            }));

            set({
              experts: transformedExperts,
              totalExperts: experts.length,
              currentPage: page,
              totalPages: 1,
              isLoading: false,
            });
          } else {
            throw new Error(
              response.data.message || "Failed to search experts"
            );
          }
        } catch (error: any) {
          console.error("Error searching experts:", error);

          let errorMessage = "Failed to search experts";

          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "No experts found for this search";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
            experts: [],
          });
        }
      },

      filterExperts: async (
        filters: Partial<AllExpertsState["filters"]>,
        page = 1,
        limit = 12
      ) => {
        try {
          set({ isLoading: true, error: null });

          const newFilters = { ...get().filters, ...filters };
          set({ filters: newFilters });

          // Build query parameters for filtering
          const params: any = {
            page,
            limit,
          };

          if (filters.subcategory) {
            params.subcategory = filters.subcategory;
          }

          if (filters.location) {
            params.availability = filters.location;
          }

          if (filters.rating) {
            // Note: Backend doesn't have rating filter yet, this would need to be implemented
            console.warn("Rating filter not implemented in backend yet");
          }

          if (filters.availability) {
            params.availability = filters.availability;
          }

          const response = await axiosInstance.get("/experts", { params });

          if (response.data.status === "success") {
            const { experts } = response.data.data;

            // Transform the backend expert data to match frontend interface
            const transformedExperts = experts.map((expert: any) => ({
              id: expert.id,
              name: expert.user?.name || expert.headline || "Expert",
              title: expert.headline,
              location:
                typeof expert.user?.location === "object"
                  ? [expert.user.location.address, expert.user.location.country]
                      .filter(Boolean)
                      .join(", ")
                  : expert.user?.location || "Remote",
              rating: expert.user?.ratings || 0,
              reviews: expert.user?.reviews || 0,
              categories: expert.expertise || [],
              tags: expert.user?.tags || [],
              image:
                expert.user?.avatar ||
                "https://randomuser.me/api/portraits/men/1.jpg",
              status: expert.user?.role === "EXPERT" ? "Verified" : undefined,
              bio: expert.user?.bio,
              description: expert.summary,
              hourlyRate: expert.hourlyRate,
              verified: expert.user?.role === "EXPERT",
              expertise: expert.expertise || [],
              experience: expert.experience,
              availability: expert.availability,
              languages: expert.languages || [],
            }));

            set({
              experts: transformedExperts,
              totalExperts: experts.length,
              currentPage: page,
              totalPages: 1,
              isLoading: false,
            });
          } else {
            throw new Error(
              response.data.message || "Failed to filter experts"
            );
          }
        } catch (error: any) {
          console.error("Error filtering experts:", error);

          let errorMessage = "Failed to filter experts";

          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "No experts found with these filters";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
            experts: [],
          });
        }
      },

      clearExperts: () =>
        set({
          experts: [],
          totalExperts: 0,
          currentPage: 1,
          totalPages: 1,
          isLoading: false,
          error: null,
        }),

      clearAllState: () =>
        set({
          experts: [],
          totalExperts: 0,
          currentPage: 1,
          totalPages: 1,
          isLoading: false,
          error: null,
          searchQuery: "",
          location: "",
          selectedServices: [],
          selectedRatings: [],
          filters: {},
        }),

      clearError: () => set({ error: null }),

      clearSearchState: () =>
        set({
          searchQuery: "",
          location: "",
          selectedServices: [],
          selectedRatings: [],
          filters: {},
        }),

      setFilters: (filters: Partial<AllExpertsState["filters"]>) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      resetFilters: () => set({ filters: {} }),

      getExpertById: async (expertId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axiosInstance.get(`/experts/${expertId}`);

          if (response.data.status === "success") {
            const expert = response.data.data;
            // Transform the backend expert data to match frontend interface
            const transformedExpert = {
              id: expert.id,
              name: expert.name || expert.headline || "Expert",
              title: expert.headline,
              location: expert.location || "Remote",
              rating: expert.ratings || 0,
              reviews: expert.reviews || 0,
              categories: expert.expertise || [],
              tags: expert.tags || [],
              image:
                expert.avatar ||
                "https://randomuser.me/api/portraits/men/1.jpg",
              status: expert.role === "EXPERT" ? "Verified" : undefined,
              bio: expert.bio,
              description: expert.summary,
              hourlyRate: expert.hourlyRate,
              verified: expert.verified || expert.role === "EXPERT",
              expertise: expert.expertise || [],
              experience: expert.experience,
              availability: expert.availability,
              languages: expert.languages || [],
              // Additional fields for the detailed expert page
              email: expert.email,
              role: expert.role,
              interests: expert.interests || [],
              createdAt: expert.createdAt,
              userId: expert.userId,
              about: expert.about,
              badges: expert.badges || [],
              progressLevel: expert.progressLevel,
              progressShow: expert.progressShow,
              updatedAt: expert.updatedAt,
              certifications: expert.certifications || [],
              experiences: expert.experiences || [],
              awards: expert.awards || [],
              education: expert.education || [],
              followersCount: expert.followersCount || 0,
              followingCount: expert.followingCount || 0,
            };
            set({ isLoading: false });
            return transformedExpert;
          } else {
            throw new Error(response.data.message || "Failed to fetch expert");
          }
        } catch (error: any) {
          console.error("Error fetching expert by ID:", error);

          let errorMessage = "Failed to fetch expert";

          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Expert not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
          });
          return null;
        }
      },

      sendMessageToExpert: async (expertId: string, message: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axiosInstance.post(
            `/experts/${expertId}/messages`,
            { message }
          );

          if (response.data.status === "success") {
            set({ isLoading: false });
            return true;
          } else {
            throw new Error(response.data.message || "Failed to send message");
          }
        } catch (error: any) {
          console.error("Error sending message to expert:", error);

          let errorMessage = "Failed to send message";

          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Expert not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      searchSuggestions: async (query: string) => {
        try {
          if (!query.trim()) {
            return {
              experts: [],
              categories: [],
            };
          }

          const response = await axiosInstance.get("/experts", {
            params: {
              search: query,
              page: 1,
              limit: 5, // Limit for suggestions
            },
          });

          if (response.data.status === "success") {
            const { experts } = response.data.data;

            // Transform the backend expert data to match frontend interface
            const transformedExperts = experts.map((expert: any) => ({
              id: expert.id,
              name: expert.user?.name || expert.headline || "Expert",
              title: expert.headline,
              location:
                typeof expert.user?.location === "object"
                  ? [expert.user.location.address, expert.user.location.country]
                      .filter(Boolean)
                      .join(", ")
                  : expert.user?.location || "Remote",
              rating: expert.user?.ratings || 0,
              reviews: expert.user?.reviews || 0,
              categories: expert.expertise || [],
              tags: expert.user?.tags || [],
              image:
                expert.user?.avatar ||
                "https://randomuser.me/api/portraits/men/1.jpg",
              status: expert.user?.role === "EXPERT" ? "Verified" : undefined,
              bio: expert.user?.bio,
              description: expert.summary,
              hourlyRate: expert.hourlyRate,
              verified: expert.user?.role === "EXPERT",
              expertise: expert.expertise || [],
              experience: expert.experience,
              availability: expert.availability,
              languages: expert.languages || [],
            }));

            // Extract unique categories from experts
            const categoryMap = new Map();
            transformedExperts.forEach((expert: Expert) => {
              expert.categories?.forEach((category: string) => {
                if (!categoryMap.has(category)) {
                  categoryMap.set(category, {
                    id: category.toLowerCase().replace(/\s+/g, "-"),
                    name: category,
                    icon: getCategoryIcon(category),
                  });
                }
              });
            });

            const categories = Array.from(categoryMap.values());

            return {
              experts: transformedExperts,
              categories,
            };
          } else {
            throw new Error(
              response.data.message || "Failed to fetch search suggestions"
            );
          }
        } catch (error: any) {
          console.error("Error fetching search suggestions:", error);
          return {
            experts: [],
            categories: [],
          };
        }
      },
    }),
    {
      name: "all-experts-storage",
      partialize: (state) => ({
        experts: state.experts,
        filters: state.filters,
        searchQuery: state.searchQuery,
        location: state.location,
        selectedServices: state.selectedServices,
        selectedRatings: state.selectedRatings,
      }),
    }
  )
);
