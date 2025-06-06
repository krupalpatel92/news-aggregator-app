import { useAuthStore } from "@/stores/auth";
import { usePrefrencesStore } from "@/stores/prefrences";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

interface QueryOptions {
  enabled?: boolean;
}

export const useUpdateFeedPreference = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn, token } = useAuthStore();
  return useMutation({
    mutationKey: ["update-feed-preference"],
    mutationFn: async (data: any) => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/me/preferences/feed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(isLoggedIn ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-preference"] });
    },
  });
};
export const useGetFeedPreference = (options: QueryOptions = {}) => {
  const { isLoggedIn, token } = useAuthStore();
  const { setPrefrences } = usePrefrencesStore();

  return useQuery({
    queryKey: ["feed-preference"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/me/preferences",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(isLoggedIn ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("API Response data:", data);
        
        if (data) {
          setPrefrences(data);
        }
        
        return data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching preferences:", error.message);
        } else {
          console.error("Unknown error fetching preferences");
        }
        throw error;
      }
    },
    enabled: isLoggedIn && options.enabled !== false,
  });
};
