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
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import FeedAlert from "@/components/ui/FeedAlert/FeedAlert.vue";
import NewsCard from "@/components/NewsCard.vue";
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import SearchFilters from "@/components/functional/Filters/SearchFilters.vue";
import { useCategoriesQuery } from "@/api/category/category";
import { useAuthorsQuery } from "@/api/authors/author";
import { useSourcesQuery } from "@/api/sources/source";
import { useSearchArticlesQuery } from "@/api/articles/search";

const route = useRoute();
const searchParams = ref("");

// Fetch metadata
const { data: categoriesData } = useCategoriesQuery();
const { data: authorsData } = useAuthorsQuery();
const { data: sourcesData } = useSourcesQuery();

const categories = computed(() => categoriesData.value || []);
const authors = computed(() => authorsData.value || []);
const sources = computed(() => sourcesData.value || []);

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
const { data: searchData, isLoading } = useSearchArticlesQuery(
  currentSearchParams.value
);
const articles = computed(() => searchData.value?.articles || []);

// Article display sections
const smallNewsCards = computed(() => articles.value.slice(1, 6));
const largeNewsCards = computed(() => articles.value.slice(6, 8));
const mediumNewsCards = computed(() => articles.value.slice(8));

const handleSearch = () => {
  // The search will be triggered automatically by the computed property
  console.log("Search triggered with params:", currentSearchParams.value);
};

// Watch for query changes to trigger search
watch(
  () => route.query,
  () => {
    handleSearch();
  },
  { immediate: true, deep: true }
);
</script>
