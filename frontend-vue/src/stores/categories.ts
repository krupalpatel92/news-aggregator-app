import { defineStore } from "pinia";
import { ref } from "vue";

interface Category {
  id: number;
  name: string;
}

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[] | null>(null);

  const setCategories = (newCategories: Category[]) => {
    categories.value = newCategories;
  };

  return {
    categories,
    setCategories,
  };
});
