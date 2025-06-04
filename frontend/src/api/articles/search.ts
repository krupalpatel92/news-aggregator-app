import { useQuery } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";

interface SearchParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  categoryIds?: number[];
  authorIds?: number[];
  sourceIds?: number[];
}

export const useSearchArticlesQuery = (searchParams: string) => {
  const auth = useAuthStore();
  const params = JSON.parse(searchParams || "{}");

  // Build query string
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

  return useQuery({
    queryKey: ["articles", "search", searchParams],
    queryFn: async () => {
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
    staleTime: 0, // Disable stale time to ensure fresh data on parameter changes
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
