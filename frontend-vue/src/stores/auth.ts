import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const USER_TOKEN_COOKIE_KEY = "newsAppUserToken";
const USER_PROFILE_COOKIE_KEY = "newsAppUserProfile";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}
interface LoginAction {
  accessToken: string;
  expireAt: string;
  user: UserProfile;
}

const cookieOptions = (expireAt: string) => {
  return {
    expires: new Date(expireAt),
    sameSite: "strict",
    path: "/",
  };
};

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // State
  const token = ref<string | undefined>(Cookies.get(USER_TOKEN_COOKIE_KEY));
  const userProfile = ref<UserProfile | null>(
    JSON.parse(Cookies.get(USER_PROFILE_COOKIE_KEY) || "null")
  );

  // Computed
  const isLoggedIn = computed(() => !!token.value);

  // Actions
  const setLogin = (params: LoginAction) => {
    token.value = params.accessToken;
    userProfile.value = params.user;

    Cookies.set(
      USER_TOKEN_COOKIE_KEY,
      params.accessToken,
      cookieOptions(params.expireAt)
    );
    Cookies.set(
      USER_PROFILE_COOKIE_KEY,
      JSON.stringify(params.user),
      cookieOptions(params.expireAt)
    );
  };

  const logout = () => {
    token.value = undefined;
    userProfile.value = null;
    Cookies.remove(USER_TOKEN_COOKIE_KEY);
    Cookies.remove(USER_PROFILE_COOKIE_KEY);
    router.push("/signin");
  };

  const checkAuth = async () => {
    if (!token.value) return;

    try {
      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();
      userProfile.value = data.user;
    } catch (error) {
      logout();
    }
  };

  // Check token expiration periodically
  const checkTokenExpiration = () => {
    const tokenCookie = Cookies.get(USER_TOKEN_COOKIE_KEY);
    if (!tokenCookie && isLoggedIn.value) {
      logout();
    }
  };

  // Set up periodic token check
  setInterval(checkTokenExpiration, 3000);

  return {
    // State
    token,
    userProfile,

    // Computed
    isLoggedIn,

    // Actions
    setLogin,
    logout,
    checkAuth,
  };
});
