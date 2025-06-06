import { useQuery } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { ComputedRef } from "vue";

export const useSearchArticlesQuery = (searchParams: ComputedRef<string>) => {
  const auth = useAuthStore();

  return useQuery({
    queryKey: ["articles", "search", searchParams], // reactive queryKey
    queryFn: async () => {
      const params = JSON.parse(searchParams.value || "{}");

      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append("keyword", params.keyword);
      if (params.startDate) queryParams.append("start_date", params.startDate);
      if (params.endDate) queryParams.append("end_date", params.endDate);
      if (params.categoryIds?.length)
        queryParams.append("category", params.categoryIds.join(","));
      if (params.authorIds?.length)
        queryParams.append("author_ids", params.authorIds.join(","));
      if (params.sourceIds?.length)
        queryParams.append("source_ids", params.sourceIds.join(","));

      const url = `http://127.0.0.1:8000/api/news/articles/search?${queryParams.toString()}`;
      console.log("Fetching articles with URL:", url); // Debug log

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(auth.isLoggedIn ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Search API error:", error); // Debug log
        throw new Error(error.message || "Failed to search articles");
      }

      const data = await response.json();
      console.log("Search API response:", data); // Debug log
      return data;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
