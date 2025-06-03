<template>
  <div class="search-filters-wrapper">
    <div class="search-filters">
      <div class="filter-group">
        <input
          type="text"
          v-model="filters.keyword"
          placeholder="Search by keyword"
          class="filter-input"
          @keyup.enter="handleSearch"
        />
      </div>

      <div class="filter-group">
        <Datepicker
          v-model="filters.dateRange"
          range
          :enable-time-picker="false"
          :max-date="new Date()"
          placeholder="Select date range"
          :clearable="true"
          :auto-apply="true"
          text-input
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <CategorySelector v-model="filters.categories" />
      </div>

      <div class="filter-group">
        <AuthorSelector v-model="filters.authors" />
      </div>

      <div class="filter-group">
        <SourceSelector v-model="filters.sources" />
      </div>

      <div class="filter-actions">
        <button class="btn btn-primary" @click="handleSearch">Search</button>
        <button class="btn btn-primary" @click="handleClear">Clear</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import CategorySelector from "../CategorySelector/CategorySelector.vue";
import AuthorSelector from "../AuthorSelector/AuthorSelector.vue";
import SourceSelector from "../SourceSelector/SourceSelector.vue";

interface Filters {
  keyword: string;
  dateRange: Date[] | null;
  categories: number[];
  authors: number[];
  sources: number[];
}

const route = useRoute();
const router = useRouter();

const filters = ref<Filters>({
  keyword: "",
  dateRange: null,
  categories: [],
  authors: [],
  sources: [],
});

// Initialize filters from URL query parameters
const initializeFilters = () => {
  const query = route.query;
  filters.value = {
    keyword: (query.keyword as string) || "",
    dateRange:
      query.start_date && query.end_date
        ? [
            new Date(query.start_date as string),
            new Date(query.end_date as string),
          ]
        : null,
    categories: query.category
      ? (query.category as string).split(",").map(Number)
      : [],
    authors: query.author
      ? (query.author as string).split(",").map(Number)
      : [],
    sources: query.source
      ? (query.source as string).split(",").map(Number)
      : [],
  };
};

// Update URL when filters change
const updateURL = () => {
  const query: Record<string, string> = {};

  if (filters.value.keyword) {
    query.keyword = filters.value.keyword;
  }

  if (filters.value.dateRange?.[0] && filters.value.dateRange[1]) {
    query.start_date = filters.value.dateRange[0].toISOString().split("T")[0];
    query.end_date = filters.value.dateRange[1].toISOString().split("T")[0];
  }

  if (filters.value.categories.length) {
    query.category = filters.value.categories.join(",");
  }

  if (filters.value.authors.length) {
    query.author = filters.value.authors.join(",");
  }

  if (filters.value.sources.length) {
    query.source = filters.value.sources.join(",");
  }

  router.push({ query });
};

const handleSearch = () => {
  updateURL();
};

const handleClear = () => {
  filters.value = {
    keyword: "",
    dateRange: null,
    categories: [],
    authors: [],
    sources: [],
  };
  router.push({ query: {} });
};

// Watch route changes to update filters
watch(
  () => route.query,
  () => {
    initializeFilters();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.search-filters-wrapper {
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #efefef;
  position: relative;
  z-index: 3;
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

:deep(.dp__input) {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background: #f8f9fa;
  height: auto;

  &:hover,
  &:focus {
    border-color: #007bff;
  }
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  min-width: 80px;
  height: 38px;

  &-primary {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }
}

@media (max-width: 768px) {
  .filter-group {
    min-width: 100%;
  }

  .filter-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
