<template>
  <div class="search-filters-wrapper">
    <div class="search-filters">
      <div class="filter-group">
        <input
          type="text"
          v-model="keyword"
          placeholder="Search by keyword"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <input
          type="date"
          v-model="dateRange"
          placeholder="Select a date range"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <select v-model="selectedCategory" class="filter-input">
          <option value="">Select categories...</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <select v-model="selectedAuthor" class="filter-input">
          <option value="">Select authors...</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <select v-model="selectedSource" class="filter-input">
          <option value="">Select sources...</option>
          <option v-for="source in sources" :key="source.id" :value="source.id">
            {{ source.name }}
          </option>
        </select>
      </div>

      <div class="filter-actions">
        <button class="btn btn-primary" @click="handleSearch">Search</button>
        <button class="btn btn-primary" @click="handleClear">Clear</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchFilters",
  data() {
    return {
      keyword: "",
      dateRange: "",
      selectedCategory: "",
      selectedAuthor: "",
      selectedSource: "",
      categories: [], // This will be populated from your API
      authors: [], // This will be populated from your API
      sources: [], // This will be populated from your API
    };
  },
  methods: {
    handleSearch() {
      console.log("Search clicked", {
        keyword: this.keyword,
        dateRange: this.dateRange,
        category: this.selectedCategory,
        author: this.selectedAuthor,
        source: this.selectedSource,
      });
    },
    handleClear() {
      this.keyword = "";
      this.dateRange = "";
      this.selectedCategory = "";
      this.selectedAuthor = "";
      this.selectedSource = "";
    },
  },
});
</script>

<style scoped>
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
  min-width: 180px;
}

.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background: #f8f9fa;
}

.filter-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  min-width: 80px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
