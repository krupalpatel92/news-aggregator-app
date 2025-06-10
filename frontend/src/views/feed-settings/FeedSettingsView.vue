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
import { ref, computed, onMounted, watch } from "vue";
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import CategorySelector from "@/components/functional/CategorySelector/CategorySelector.vue";
import AuthorSelector from "@/components/functional/AuthorSelector/AuthorSelector.vue";
import SourceSelector from "@/components/functional/SourceSelector/SourceSelector.vue";
import { useCategoriesStore } from "@/stores/categories";
import { useAuthorsStore } from "@/stores/authors";
import { useSourcesStore } from "@/stores/sources";
import {
  useGetFeedPreference,
  useUpdateFeedPreference,
} from "@/api/user/feedpreference";
import { useAuthStore } from "@/stores/auth";
import { useCategoriesQuery } from "@/api/category/category";
import { useAuthorsQuery } from "@/api/authors/author";
import { useSourcesQuery } from "@/api/sources/source";
import { toast } from "@/utils/notification";

interface FormData {
  categories: number[];
  authors: number[];
  sources: number[];
}

// Initialize stores
const { mutate: updateFeed } = useUpdateFeedPreference();
const categoriesStore = useCategoriesStore();
const authorsStore = useAuthorsStore();
const sourcesStore = useSourcesStore();
const { userProfile } = useAuthStore();

// Form state
const isSaving = ref(false);
const form = ref<FormData>({
  categories: [],
  authors: [],
  sources: [],
});

// Fetch data using Vue Query
const { data: categoriesData } = useCategoriesQuery({
  enabled: !categoriesStore.categories,
});

const { data: authorsData } = useAuthorsQuery({
  enabled: !authorsStore.authors,
});

const { data: sourcesData } = useSourcesQuery({
  enabled: !sourcesStore.sources,
});

// Fetch preferences using Vue Query
const { data: feedPreference, refetch: refetchPreferences } =
  useGetFeedPreference();

// Computed properties for selectors with fallback to query data
const categories = computed(
  () => categoriesStore.categories || categoriesData.value || []
);
const authors = computed(() => authorsStore.authors || authorsData.value || []);
const sources = computed(() => sourcesStore.sources || sourcesData.value || []);

// Initialize form from preferences
const initializeForm = (prefs: any) => {
  if (!prefs) return;

  try {
    const feedData = prefs.feed ? JSON.parse(prefs.feed) : null;
    if (!feedData) return;

    form.value = {
      categories: feedData.categoryIds
        ? feedData.categoryIds.split(",").map(Number).filter(Boolean)
        : [],
      authors: feedData.authorIds
        ? feedData.authorIds.split(",").map(Number).filter(Boolean)
        : [],
      sources: feedData.sourceIds
        ? feedData.sourceIds.split(",").map(Number).filter(Boolean)
        : [],
    };
  } catch (error) {
    console.error("Error parsing preferences:", error);
    toast.error("Error loading preferences");
  }
};

// Watch for preference changes from Vue Query
watch(
  () => feedPreference.value,
  (newPrefs) => {
    if (newPrefs) {
      // Initialize form with new preferences
      initializeForm(newPrefs);
    }
  },
  { immediate: true }
);

// Handle form submission
const handleSubmit = async () => {
  try {
    isSaving.value = true;
    updateFeed({
      categoryIds: form.value.categories.toString(),
      authorIds: form.value.authors.toString(),
      sourceIds: form.value.sources.toString(),
      userId: userProfile?.id || null,
    });

    toast.success("Feed preferences updated successfully");

    // Refetch preferences after successful update
    await refetchPreferences();
  } catch (error) {
    console.error("Error updating preferences:", error);
    toast.error("Failed to update feed preferences");
  } finally {
    isSaving.value = false;
  }
};

// Initialize on mount
onMounted(async () => {
  await refetchPreferences();
});
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
  flex-wrap: wrap;
  gap: 0.5rem;
}

.submit-button {
  min-width: 200px;
  height: 40px;
  font-size: 16px;
}
</style>
