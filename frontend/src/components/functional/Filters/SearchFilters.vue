<template>
  <div class="search-filters-wrapper">
    <div class="search-filters">
      <div class="filter-group">
        <a-input
          v-model:value="filters.keyword"
          placeholder="Search by keyword"
          :allowClear="true"
          @pressEnter="handleSearch"
        >
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>
      </div>

      <div class="filter-group">
        <a-range-picker
          v-model:value="filters.dateRange"
          class="date-picker"
          :allowClear="true"
          :disabledDate="disabledDate"
          format="YYYY-MM-DD"
          style="width: 100%"
        />
      </div>

      <div class="filter-group">
        <CategorySelector
          v-model="filters.categories"
          @update:modelValue="handleCategoryChange"
        />
      </div>

      <div class="filter-group">
        <AuthorSelector v-model="filters.authors" />
      </div>

      <div class="filter-group">
        <SourceSelector v-model="filters.sources" />
      </div>

      <div class="filter-actions">
        <a-button type="primary" @click="handleSearch">Search</a-button>
        <a-button @click="handleClear">Clear</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs, { Dayjs } from "dayjs";
import { SearchOutlined } from '@ant-design/icons-vue';
import CategorySelector from "../CategorySelector/CategorySelector.vue";
import AuthorSelector from "../AuthorSelector/AuthorSelector.vue";
import SourceSelector from "../SourceSelector/SourceSelector.vue";

interface Filters {
  keyword: string;
  dateRange: [Dayjs, Dayjs] | null;
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

const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf("day");
};

// Initialize filters from URL query parameters
const initializeFilters = () => {
  const query = route.query;
  filters.value = {
    keyword: (query.keyword as string) || "",
    dateRange:
      query.start_date && query.end_date
        ? [dayjs(query.start_date as string), dayjs(query.end_date as string)]
        : null,
    categories: query.category
      ? typeof query.category === "string"
        ? query.category.split(",").map(Number)
        : Array.isArray(query.category)
        ? query.category.map(Number)
        : []
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
const updateURL = (newQuery: Record<string, string> = {}) => {
  const query: Record<string, string> = { ...route.query, ...newQuery };

  if (filters.value.keyword) {
    query.keyword = filters.value.keyword;
  } else {
    delete query.keyword;
  }

  if (filters.value.dateRange?.[0] && filters.value.dateRange[1]) {
    query.start_date = filters.value.dateRange[0].format("YYYY-MM-DD");
    query.end_date = filters.value.dateRange[1].format("YYYY-MM-DD");
  } else {
    delete query.start_date;
    delete query.end_date;
  }

  if (filters.value.categories.length) {
    query.category = filters.value.categories.join(",");
  } else {
    delete query.category;
  }

  if (filters.value.authors.length) {
    query.author = filters.value.authors.join(",");
  } else {
    delete query.author;
  }

  if (filters.value.sources.length) {
    query.source = filters.value.sources.join(",");
  } else {
    delete query.source;
  }

  // Use replace to avoid creating new history entries for every filter change
  router.replace({ query });
};

const handleCategoryChange = (categories: number[]) => {
  filters.value.categories = categories;
  updateURL();
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
  router.replace({ query: {} });
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

  :deep(.ant-input-affix-wrapper) {
    background: #f8f9fa !important;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    height: 38px !important;
    padding: 0 11px !important;

    &:hover {
      border-color: #007bff !important;
    }
  }

  :deep(.ant-input-affix-wrapper-focused) {
    border-color: #007bff !important;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1) !important;
  }

  :deep(.ant-input) {
    background: #f8f9fa !important;
    height: 100% !important;

    &::placeholder {
      color: #6c757d;
    }
  }

  :deep(.anticon) {
    color: #6c757d;
  }
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

:deep(.date-picker) {
  width: 100%;

  .ant-picker {
    background: #f8f9fa !important;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    height: 38px !important;
    width: 100% !important;
    display: flex !important;

    &:hover {
      border-color: #007bff !important;
    }

    &.ant-picker-focused {
      border-color: #007bff !important;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1) !important;
    }
  }

  .ant-picker-input {
    flex: 1;
    
    > input {
      color: #495057;
      width: 100%;

      &::placeholder {
        color: #6c757d;
      }
    }
  }

  .ant-picker-range-separator {
    padding: 0 8px;
  }
}

:deep(.ant-btn) {
  height: 38px;
  border-radius: 4px;
  padding: 0 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  min-width: 80px;

  &.ant-btn-primary {
    background-color: #007bff;
    border-color: #007bff;

    &:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }
  }

  &:not(.ant-btn-primary) {
    border-color: #ddd;
    color: #495057;

    &:hover {
      color: #007bff;
      border-color: #007bff;
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
