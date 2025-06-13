import { useAuthStore } from "@/stores/auth";
import { usePrefrencesStore } from "@/stores/prefrences";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

interface QueryOptions {
  enabled?: boolean;
}

interface FeedPreference {
  feed?: string;
  notification?: string;
  email?: string;
  id?: number;
  userId?: number;
  created_at?: string;
  updated_at?: string;
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

export const useGetFeedPreference = () => {
  const authStore = useAuthStore();
  const { setPrefrences } = usePrefrencesStore();

  return useQuery<FeedPreference>({
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
              ...(authStore.isLoggedIn
                ? { Authorization: `Bearer ${authStore.token}` }
                : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPrefrences(data); // Store preferences in the Vuex store
        return data;
      } catch (error) {
        console.error("Error fetching preferences:", error);
        throw error; // Re-throw to let Vue Query handle the error state
      }
    },
    enabled: authStore.isLoggedIn,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};
