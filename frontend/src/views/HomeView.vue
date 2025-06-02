<template>
  <ContentWrapper>
    <FeedAlert />
    <div class="row mb-4">
      <div class="col">
        <SearchFilters />
      </div>
    </div>

    <div v-if="loading" class="row">
      <div class="col">
        <p class="text-center">Fetching news articles...</p>
      </div>
    </div>

    <template v-else-if="articles.length > 0">
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
                :to="'/category/' + category.slug"
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
                :to="'/source/' + source.slug"
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
                :to="'/author/' + author.slug"
                class="text-decoration-none"
              >
                <span class="badge bg-primary">{{ author.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FeedAlert from "@/components/ui/FeedAlert/FeedAlert.vue";
import NewsCard from "@/components/NewsCard.vue";
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import SearchFilters from "@/components/functional/Filters/SearchFilters.vue";

// State
const loading = ref(false);
const articles = ref<any[]>([]);
const categories = ref<any[]>([]);
const authors = ref<any[]>([]);
const sources = ref<any[]>([]);

// Computed properties
const smallNewsCards = computed(() => articles.value.slice(1, 6));
const largeNewsCards = computed(() => articles.value.slice(6, 8));
const mediumNewsCards = computed(() => articles.value.slice(8));

// Fetch data on component creation
const fetchData = async () => {
  loading.value = true;
  try {
    // TODO: Implement API calls to fetch data
    // Example:
    // const [articlesData, categoriesData, authorsData, sourcesData] = await Promise.all([
    //   fetch('/api/articles').then(res => res.json()),
    //   fetch('/api/categories').then(res => res.json()),
    //   fetch('/api/authors').then(res => res.json()),
    //   fetch('/api/sources').then(res => res.json())
    // ]);
    //
    // articles.value = articlesData;
    // categories.value = categoriesData;
    // authors.value = authorsData;
    // sources.value = sourcesData;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

fetchData();
</script>
