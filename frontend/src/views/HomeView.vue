<template>
  <ContentWrapper>
    <FeedAlert />
    <div class="row mb-4">
      <div class="col">
        <SearchFilters @search="handleSearch" />
      </div>
    </div>

    <div v-if="isLoading" class="row">
      <div class="col">
        <p class="text-center">Fetching news articles...</p>
      </div>
    </div>

    <template v-else-if="articles?.length > 0">
      <div class="row mb-4">
        <div class="col-lg-8 mb-4 mb-lg-0">
          <NewsCard
            v-if="articles[0]"
            :article="articles[0]"
            type="extra-large"
          />
        </div>

        <div class="col-lg-4">
          <div
            v-for="(article, index) in smallNewsCards"
            :key="article.slug + index"
            class="mb-3"
          >
            <NewsCard :article="article" type="small" />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="row mb-3">
            <div
              v-for="(article, index) in largeNewsCards"
              :key="article.slug + index"
              class="col-md-6 mb-3"
            >
              <NewsCard :article="article" type="large" />
            </div>
          </div>
          <div
            v-for="(article, index) in mediumNewsCards"
            :key="article.slug + index"
            class="mb-3"
          >
            <NewsCard :article="article" type="medium" />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="mb-5">
            <h3 class="mb-3">Categories ({{ categories.length }})</h3>
            <div class="d-flex flex-wrap gap-2">
              <router-link
                v-for="category in categories"
                :key="category.slug"
                :to="{ query: { category: category.id } }"
                class="text-decoration-none"
              >
                <span class="badge bg-primary">{{ category.name }}</span>
              </router-link>
            </div>
          </div>

          <div class="mb-5">
            <h3 class="mb-3">Sources ({{ sources.length }})</h3>
            <div class="d-flex flex-wrap gap-2">
              <router-link
                v-for="source in sources"
                :key="source.slug"
                :to="{ query: { source: source.id } }"
                class="text-decoration-none"
              >
                <span class="badge bg-primary">{{ source.name }}</span>
              </router-link>
            </div>
          </div>

          <div class="mb-5">
            <h3 class="mb-3">Authors ({{ authors.length }})</h3>
            <div class="d-flex flex-wrap gap-2">
              <router-link
                v-for="author in authors"
                :key="author.slug"
                :to="{ query: { author: author.id } }"
                class="text-decoration-none"
              >
                <span class="badge bg-primary">{{ author.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="row">
        <div class="col">
          <p class="text-center">No articles found matching your criteria.</p>
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { computed, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import FeedAlert from "@/components/ui/FeedAlert/FeedAlert.vue";
import NewsCard from "@/components/ui/NewsCard/NewsCard.vue";
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import SearchFilters from "@/components/functional/Filters/SearchFilters.vue";
import { useCategoriesQuery } from "@/api/category/category";
import { useAuthorsQuery } from "@/api/authors/author";
import { useSourcesQuery } from "@/api/sources/source";
import { useSearchArticlesQuery } from "@/api/articles/search";
import { useGetFeedPreference } from "@/api/user/feedpreference";
import { useCategoriesStore } from "@/stores/categories";
import { useAuthorsStore } from "@/stores/authors";
import { useSourcesStore } from "@/stores/sources";
import { usePrefrencesStore } from "@/stores/prefrences";

const route = useRoute();

// Initialize stores
const categoriesStore = useCategoriesStore();
const authorsStore = useAuthorsStore();
const sourcesStore = useSourcesStore();
const { prefrences, setPrefrences } = usePrefrencesStore();

const { data: feedpreference } = useGetFeedPreference({
  enabled: !prefrences,
});
console.log("Feed preferences data:", feedpreference.value);

// Only fetch data if not already in store
const { data: categoriesData } = useCategoriesQuery({
  enabled: !categoriesStore.categories,
});

const { data: authorsData } = useAuthorsQuery({
  enabled: !authorsStore.authors,
});

const { data: sourcesData } = useSourcesQuery({
  enabled: !sourcesStore.sources,
});

// Use store data with fallback to query data
const categories = computed(
  () => categoriesStore.categories || categoriesData.value || []
);
const authors = computed(() => authorsStore.authors || authorsData.value || []);
const sources = computed(() => sourcesStore.sources || sourcesData.value || []);

// Create search params from route query
const createSearchParams = () => {
  const payload = {
    keyword: route.query.keyword as string,
    startDate: route.query.start_date as string,
    endDate: route.query.end_date as string,
    categoryIds: route.query.category
      ? (route.query.category as string).split(",").map(Number)
      : undefined,
    authorIds: route.query.author
      ? (route.query.author as string).split(",").map(Number)
      : undefined,
    sourceIds: route.query.source
      ? (route.query.source as string).split(",").map(Number)
      : undefined,
  };
  return JSON.stringify(payload);
};

// Initialize search params and create computed property for current params
const currentSearchParams = computed(() => createSearchParams());
console.log("Current search params:", currentSearchParams.value);

// Search articles with the current params
const { data: searchData, isLoading } =
  useSearchArticlesQuery(currentSearchParams);

// console.log("Search data:", searchData.value.data);

const articles = computed(() => searchData?.value?.data || []);

// Article display sections
const smallNewsCards = computed(() => articles.value.slice(1, 6));
const largeNewsCards = computed(() => articles.value.slice(6, 8));
const mediumNewsCards = computed(() => articles.value.slice(8));

const handleSearch = () => {
  createSearchParams();
};

console.log("Pinia prefrences store:", prefrences);

watchEffect(() => {
  if (feedpreference.value) {
    setPrefrences(feedpreference.value);
  }
});

// Watch for query changes to trigger search
watch(
  () => route.query,
  () => {
    handleSearch();
    createSearchParams();
  },
  { immediate: true, deep: true }
);
</script>
