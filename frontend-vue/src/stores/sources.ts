import { defineStore } from "pinia";
import { ref } from "vue";

interface Source {
  id: number;
  name: string;
}

export const useSourcesStore = defineStore("sources", () => {
  const sources = ref<Source[] | null>(null);

  const setSources = (newSources: Source[]) => {
    sources.value = newSources;
  };

  return {
    sources,
    setSources,
  };
});
