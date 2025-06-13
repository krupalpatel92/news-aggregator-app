import { defineStore } from "pinia";
import { ref } from "vue";

interface Preferences {
  feed?: string;
  notification?: string;
  email?: "everyday" | "twice-a-week" | "biweekly";
  id?: number;
  userId?: number;
  created_at?: string;
  updated_at?: string;
}

export const usePrefrencesStore = defineStore("prefrences", () => {
  const prefrences = ref<Preferences | null>(null);

  const setPrefrences = (newPrefrences: Preferences) => {
    prefrences.value = newPrefrences;
  };

  const clearPreferences = () => {
    prefrences.value = null;
  };

  return {
    prefrences,
    setPrefrences,
    clearPreferences,
  };
});
