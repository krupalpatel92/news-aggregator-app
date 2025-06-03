import { useQuery } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { useCategoriesStore } from "@/stores/categories";

export const useCategoriesQuery = () => {
  const { setCategories } = useCategoriesStore();

  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/news/categories");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
      }
      const data = await response.json();
      // Set categories in the store
      setCategories(data);

      return data;
    },
  });
};
