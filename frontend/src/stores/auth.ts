import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  
  // State
  const token = ref<string | null>(localStorage.getItem('token'));
  const userProfile = ref<UserProfile | null>(null);

  // Computed
  const isLoggedIn = computed(() => !!token.value);

  // Actions
  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const setUserProfile = (profile: UserProfile | null) => {
    userProfile.value = profile;
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // TODO: Implement actual API call
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setToken(data.token);
      setUserProfile(data.user);

      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUserProfile(null);
    router.push('/signin');
  };

  const checkAuth = async () => {
    if (!token.value) return;

    try {
      // TODO: Implement actual API call
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      setUserProfile(data.user);
    } catch (error) {
      logout();
    }
  };

  return {
    // State
    token,
    userProfile,
    
    // Computed
    isLoggedIn,
    
    // Actions
    login,
    logout,
    checkAuth,
    setToken,
    setUserProfile,
  };
}); 