import { useQuery } from "@tanstack/vue-query";
import { useSourcesStore } from "@/stores/sources";

export const useSourcesQuery = () => {
  const { setSources } = useSourcesStore();

  return useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/news/sources");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
      }
      const data = await response.json();
      // Set categories in the store
      setSources(data);

      return data;
    },
  });
};
