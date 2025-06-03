import { defineStore } from "pinia";
import { ref } from "vue";

interface Source {
  id: number;
  name: string;
}

export const useSourcesStore = defineStore("sources", () => {
  const sources = ref<Source[] | null>(null);

  // const fetchSources = async () => {
  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/api/sources');
  //     if (!response.ok) throw new Error('Failed to fetch sources');
  //     sources.value = await response.json();
  //   } catch (error) {
  //     console.error('Error fetching sources:', error);
  //     sources.value = [];
  //   }
  // };

  // return {
  //   sources,
  //   fetchSources,
  // };
});
