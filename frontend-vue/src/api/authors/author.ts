import { useQuery } from "@tanstack/vue-query";
import { useAuthorsStore } from "@/stores/authors";

interface QueryOptions {
  enabled?: boolean;
}

export const useAuthorsQuery = (options: QueryOptions = {}) => {
  const { setAuthors } = useAuthorsStore();

  return useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/news/authors");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
      }
      const data = await response.json();
      // Set categories in the store
      setAuthors(data);

      return data;
    },
    enabled: options.enabled !== false,
  });
};
