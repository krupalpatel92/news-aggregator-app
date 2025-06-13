import { defineStore } from "pinia";
import { ref } from "vue";

interface Author {
  id: number;
  name: string;
}

export const useAuthorsStore = defineStore("authors", () => {
  const authors = ref<Author[] | null>(null);

  const setAuthors = (newAuthors: Author[]) => {
    authors.value = newAuthors;
  };

  return {
    authors,
    setAuthors,
  };
});
