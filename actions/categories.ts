import { queryClient } from "@/lib";
import { axiosInstance } from "@/lib/axios";
import { useSnackbar } from "@/provider/snackbar";
import { Category, CreateCategoryBody, UpdateCategoryBody } from "@/types";

import { useMutation, useQuery } from "@tanstack/react-query";

const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/api/categories");
    return response.data.data;
  },
  getCategory: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(`/api/categories/${id}`);
    return response.data.data;
  },

  updateCategory: async (
    id: string,
    body: UpdateCategoryBody,
  ): Promise<Category> => {
    const response = await axiosInstance.patch(`/api/categories/${id}`, body);
    return response.data.data;
  },

  createCategory: async (body: CreateCategoryBody): Promise<Category> => {
    const response = await axiosInstance.post("/api/categories", body);
    return response.data.data;
  },
  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
};

export const useUpdateCategory = (id: string) => {
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: (body: UpdateCategoryBody) =>
      categoryApi.updateCategory(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      snackbar({ message: "Category updated successfully", type: "success" });
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to update category";
      snackbar({ message: errorMessage, type: "error" });
    },
  });
};

export const useCreateCategory = () => {
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: (body: CreateCategoryBody) => categoryApi.createCategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      snackbar({ message: "Category created successfully", type: "success" });
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to create category";
      snackbar({ message: errorMessage, type: "error" });
    },
  });
};

export const useDeleteCategory = (id: string) => {
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: () => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      snackbar({ message: "Category deleted successfully", type: "success" });
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to delete category";
      snackbar({ message: errorMessage, type: "error" });
    },
  });
};
