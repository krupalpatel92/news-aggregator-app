<template>
  <ContentWrapper>
    <div class="settings-container">
      <h1 class="mb-5">News Feed Preferences</h1>
      <form @submit.prevent="handleSubmit">
        <div class="mb-5">
          <label class="d-block mb-1">
            <strong>Categories</strong>
            <span class="counting"
              >(Selected {{ form.categories.length }} /
              {{ categories.length }})</span
            >
          </label>
          <div class="d-flex flex-wrap">
            <CategorySelector v-model="form.categories" />
          </div>
        </div>

        <div class="mb-5">
          <label class="d-block mb-1">
            <strong>Sources</strong>
            <span class="counting"
              >(Selected {{ form.sources.length }} / {{ sources.length }})</span
            >
          </label>
          <div class="d-flex flex-wrap">
            <SourceSelector v-model="form.sources" />
          </div>
        </div>

        <div class="mb-5">
          <label class="d-block mb-1">
            <strong>Authors</strong>
            <span class="counting"
              >(Selected {{ form.authors.length }} / {{ authors.length }})</span
            >
          </label>
          <div class="d-flex flex-wrap">
            <AuthorSelector v-model="form.authors" />
          </div>
        </div>

        <a-button
          type="primary"
          html-type="submit"
          :loading="isSaving"
          class="submit-button"
        >
          {{
            isSaving ? "Saving Feed Preferences..." : "Save Feed Preferences"
          }}
        </a-button>
      </form>
    </div>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import CategorySelector from "@/components/functional/CategorySelector/CategorySelector.vue";
import AuthorSelector from "@/components/functional/AuthorSelector/AuthorSelector.vue";
import SourceSelector from "@/components/functional/SourceSelector/SourceSelector.vue";
import { useCategoriesStore } from "@/stores/categories";
import { useAuthorsStore } from "@/stores/authors";
import { useSourcesStore } from "@/stores/sources";
// import { useUserPreferencesStore } from "@/stores/userPreferences";

interface FormData {
  categories: number[];
  authors: number[];
  sources: number[];
}

const categoriesStore = useCategoriesStore();
const authorsStore = useAuthorsStore();
const sourcesStore = useSourcesStore();
// const preferencesStore = useUserPreferencesStore();

const isSaving = ref(false);
const form = ref<FormData>({
  categories: [],
  authors: [],
  sources: [],
});

const categories = computed(() => categoriesStore.categories || []);
const authors = computed(() => authorsStore.authors || []);
const sources = computed(() => sourcesStore.sources || []);

// const initializeForm = () => {
//   if (preferencesStore.feedPreferences) {
//     const prefs = preferencesStore.feedPreferences;
//     form.value = {
//       categories: prefs.categoryIds ? prefs.categoryIds.split(',').map(Number).filter(Boolean) : [],
//       authors: prefs.authorIds ? prefs.authorIds.split(',').map(Number).filter(Boolean) : [],
//       sources: prefs.sourceIds ? prefs.sourceIds.split(',').map(Number).filter(Boolean) : [],
//     };
//   }
// };

const handleSubmit = async () => {
  try {
    isSaving.value = true;
    // await preferencesStore.updateFeedPreferences({
    //   categoryIds: form.value.categories,
    //   authorIds: form.value.authors,
    //   sourceIds: form.value.sources,
    // });
  } catch (error) {
    console.error("Error updating preferences:", error);
  } finally {
    isSaving.value = false;
  }
};

// onMounted(async () => {
//   // Ensure we have all the necessary data
//   if (!categoriesStore.categories) {
//     await categoriesStore.fetchCategories();
//   }
//   if (!authorsStore.authors) {
//     await authorsStore.fetchAuthors();
//   }
//   if (!sourcesStore.sources) {
//     await sourcesStore.fetchSources();
//   }
//   if (!preferencesStore.feedPreferences) {
//     await preferencesStore.fetchPreferences();
//   }
//   initializeForm();
// });
</script>

<style lang="scss" scoped>
.settings-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.counting {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}

.mb-5 {
  margin-bottom: 2rem;
}

.mb-1 {
  margin-bottom: 0.5rem;
}

.d-block {
  display: block;
}

.d-flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.submit-button {
  min-width: 200px;
  height: 40px;
  font-size: 16px;
}
</style>
