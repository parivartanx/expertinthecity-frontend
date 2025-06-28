import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "./axios";

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

interface CategoriesState {
  categories: Category[];
  subcategories: Subcategory[];
  currentCategory: Category | null;
  currentSubcategory: Subcategory | null;
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  
  // Category Actions
  fetchAllCategories: () => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
  createCategory: (categoryData: { name: string }) => Promise<void>;
  updateCategory: (id: string, categoryData: { name: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Subcategory Actions
  fetchAllSubcategories: (categoryId?: string) => Promise<void>;
  fetchSubcategoryById: (id: string) => Promise<void>;
  createSubcategory: (subcategoryData: { name: string; categoryId: string }) => Promise<void>;
  updateSubcategory: (id: string, subcategoryData: { name: string; categoryId: string }) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;
  
  // Utility Actions
  clearCategories: () => void;
  clearSubcategories: () => void;
  clearError: () => void;
  setCurrentCategory: (category: Category | null) => void;
  setCurrentSubcategory: (subcategory: Subcategory | null) => void;
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: [],
      subcategories: [],
      currentCategory: null,
      currentSubcategory: null,
      isLoading: false,
      error: null,
      isLoaded: false,

      // Category Actions
      fetchAllCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get("/categories");
          
          if (response.data.success) {
            const categories = response.data.data || [];
            set({
              categories,
              isLoading: false,
              isLoaded: true,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch categories");
          }
        } catch (error: any) {
          console.error("Error fetching categories:", error);
          
          let errorMessage = "Failed to fetch categories";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Categories not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            isLoaded: false,
          });
        }
      },

      fetchCategoryById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/categories/${id}`);
          
          if (response.data.success) {
            const category = response.data.data;
            set({
              currentCategory: category,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch category");
          }
        } catch (error: any) {
          console.error("Error fetching category:", error);
          
          let errorMessage = "Failed to fetch category";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Category not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      createCategory: async (categoryData: { name: string }) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/categories", categoryData);
          
          if (response.data.success) {
            const newCategory = response.data.data;
            const { categories } = get();
            
            set({
              categories: [...categories, newCategory],
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to create category");
          }
        } catch (error: any) {
          console.error("Error creating category:", error);
          
          let errorMessage = "Failed to create category";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid category data";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updateCategory: async (id: string, categoryData: { name: string }) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/categories/${id}`, categoryData);
          
          if (response.data.success) {
            const updatedCategory = response.data.data;
            const { categories } = get();
            
            const updatedCategories = categories.map(cat => 
              cat.id === id ? updatedCategory : cat
            );
            
            set({
              categories: updatedCategories,
              currentCategory: get().currentCategory?.id === id ? updatedCategory : get().currentCategory,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update category");
          }
        } catch (error: any) {
          console.error("Error updating category:", error);
          
          let errorMessage = "Failed to update category";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid category data";
          } else if (error.response?.status === 404) {
            errorMessage = "Category not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteCategory: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/categories/${id}`);
          
          if (response.data.success) {
            const { categories } = get();
            
            const updatedCategories = categories.filter(cat => cat.id !== id);
            
            set({
              categories: updatedCategories,
              currentCategory: get().currentCategory?.id === id ? null : get().currentCategory,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete category");
          }
        } catch (error: any) {
          console.error("Error deleting category:", error);
          
          let errorMessage = "Failed to delete category";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Cannot delete category with existing subcategories";
          } else if (error.response?.status === 404) {
            errorMessage = "Category not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Subcategory Actions
      fetchAllSubcategories: async (categoryId?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const params = categoryId ? { categoryId } : {};
          const response = await axiosInstance.get("/subcategories", { params });
          
          if (response.data.success) {
            const subcategories = response.data.data || [];
            set({
              subcategories,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch subcategories");
          }
        } catch (error: any) {
          console.error("Error fetching subcategories:", error);
          
          let errorMessage = "Failed to fetch subcategories";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Subcategories not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      fetchSubcategoryById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.get(`/subcategories/${id}`);
          
          if (response.data.success) {
            const subcategory = response.data.data;
            set({
              currentSubcategory: subcategory,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to fetch subcategory");
          }
        } catch (error: any) {
          console.error("Error fetching subcategory:", error);
          
          let errorMessage = "Failed to fetch subcategory";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Subcategory not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      createSubcategory: async (subcategoryData: { name: string; categoryId: string }) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post("/subcategories", subcategoryData);
          
          if (response.data.success) {
            const newSubcategory = response.data.data;
            const { subcategories } = get();
            
            set({
              subcategories: [...subcategories, newSubcategory],
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to create subcategory");
          }
        } catch (error: any) {
          console.error("Error creating subcategory:", error);
          
          let errorMessage = "Failed to create subcategory";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid subcategory data";
          } else if (error.response?.status === 404) {
            errorMessage = "Category not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updateSubcategory: async (id: string, subcategoryData: { name: string; categoryId: string }) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(`/subcategories/${id}`, subcategoryData);
          
          if (response.data.success) {
            const updatedSubcategory = response.data.data;
            const { subcategories } = get();
            
            const updatedSubcategories = subcategories.map(sub => 
              sub.id === id ? updatedSubcategory : sub
            );
            
            set({
              subcategories: updatedSubcategories,
              currentSubcategory: get().currentSubcategory?.id === id ? updatedSubcategory : get().currentSubcategory,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to update subcategory");
          }
        } catch (error: any) {
          console.error("Error updating subcategory:", error);
          
          let errorMessage = "Failed to update subcategory";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid subcategory data";
          } else if (error.response?.status === 404) {
            errorMessage = "Subcategory or category not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      deleteSubcategory: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(`/subcategories/${id}`);
          
          if (response.data.success) {
            const { subcategories } = get();
            
            const updatedSubcategories = subcategories.filter(sub => sub.id !== id);
            
            set({
              subcategories: updatedSubcategories,
              currentSubcategory: get().currentSubcategory?.id === id ? null : get().currentSubcategory,
              isLoading: false,
            });
          } else {
            throw new Error(response.data.error || "Failed to delete subcategory");
          }
        } catch (error: any) {
          console.error("Error deleting subcategory:", error);
          
          let errorMessage = "Failed to delete subcategory";
          
          if (error.response?.status === 401) {
            errorMessage = "Unauthorized. Please login again.";
          } else if (error.response?.status === 404) {
            errorMessage = "Subcategory not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      // Utility Actions
      clearCategories: () => {
        set({
          categories: [],
          currentCategory: null,
          isLoading: false,
          error: null,
          isLoaded: false,
        });
      },

      clearSubcategories: () => {
        set({
          subcategories: [],
          currentSubcategory: null,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setCurrentCategory: (category: Category | null) => {
        set({ currentCategory: category });
      },

      setCurrentSubcategory: (subcategory: Subcategory | null) => {
        set({ currentSubcategory: subcategory });
      },
    }),
    {
      name: "categories-storage",
      partialize: (state) => ({
        categories: state.categories,
        subcategories: state.subcategories,
        isLoaded: state.isLoaded,
      }),
    }
  )
); 