import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export const useSignUpMutation = () => {
  const auth = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: SignUpPayload) => {
      const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      const result = await response.json();

      // Set login data after successful signup
      auth.setLogin({
        accessToken: result.accessToken,
        expireAt: result.expireAt,
        user: result.user,
      });

      // Redirect to feed settings after successful signup
      router.push("/feed-settings");

      return result;
    },
  });
};
