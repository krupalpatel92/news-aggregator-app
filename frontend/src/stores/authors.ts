import { defineStore } from "pinia";
import { ref } from "vue";

interface Author {
  id: number;
  name: string;
}

export const useAuthorsStore = defineStore("authors", () => {
  const authors = ref<Author[] | null>(null);

  // const fetchAuthors = async () => {
  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/api/authors');
  //     if (!response.ok) throw new Error('Failed to fetch authors');
  //     authors.value = await response.json();
  //   } catch (error) {
  //     console.error('Error fetching authors:', error);
  //     authors.value = [];
  //   }
  // };

  // return {
  //   authors,
  //   fetchAuthors,
  // };
});
