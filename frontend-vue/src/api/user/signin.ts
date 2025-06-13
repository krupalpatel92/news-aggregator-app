import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";

interface SignInPayload {
  email: string;
  password: string;
}

export const useSignInMutation = () => {
  const auth = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  return useMutation({
    mutationKey: ["signin"],
    mutationFn: async (data: SignInPayload) => {
      const response = await fetch("http://127.0.0.1:8000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Sign in failed");
      }

      const result = await response.json();
      
      // Set login data after successful signin
      auth.setLogin({
        accessToken: result.accessToken,
        expireAt: result.expireAt,
        user: result.user,
      });

      // Redirect to the intended destination or home
      const redirectPath = route.query.redirect as string || "/";
      router.push(redirectPath);

      return result;
    },
  });
};
