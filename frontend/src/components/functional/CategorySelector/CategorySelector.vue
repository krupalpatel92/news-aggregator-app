<template>
  <div class="selector-wrapper">
    <a-select
      v-model:value="selectedItems"
      mode="multiple"
      placeholder="Select categories"
      :options="options"
      :filter-option="filterOption"
      @change="handleChange"
      class="category-select"
      :dropdown-style="{ padding: '8px' }"
      :max-tag-count="3"
      :dropdown-match-select-width="true"
      :show-search="true"
      :virtual="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, inject } from "vue";
import { useCategoriesStore } from "@/stores/categories";
import { sortBy } from "lodash-es";

const props = defineProps<{
  modelValue?: number[];
}>();

const withoutDrilling = inject<{ value: any }>("categoriesData");

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
}>();

const categoriesStore = useCategoriesStore();
const selectedItems = ref<number[]>([]);

//Initialize options from categories store

const options = computed(() => {
  if (!categoriesStore.categories) return [];
  return sortBy(categoriesStore.categories, "name").map((category) => ({
    value: category.id,
    label: category.name,
  }));
});

// With Provide/Inject approach without drilling
// const options = computed(() => {
//   // 4. Debug: Log inside computed
//   console.log("Computing options, injectedCategories:", withoutDrilling);

//   // 5. Safely access the data with optional chaining and fallback
//   const categoriesData = withoutDrilling?.value ?? [];
//   console.log("Categories data in computed:", categoriesData);

//   if (!Array.isArray(categoriesData)) {
//     console.log("Categories data is not an array:", categoriesData);
//     return [];
//   }

//   return sortBy(categoriesData, "name").map((category) => ({
//     value: category.id,
//     label: category.name,
//   }));
// });

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleChange = (values: number[]) => {
  selectedItems.value = values;
  emit("update:modelValue", values || []);
};

// Initialize selected items when props or categories change
const updateSelectedItems = () => {
  if (props.modelValue && categoriesStore.categories) {
    const validIds = props.modelValue.filter((id) =>
      categoriesStore.categories?.some((category) => category.id === id)
    );
    selectedItems.value = validIds;
    if (validIds.length !== props.modelValue.length) {
      emit("update:modelValue", validIds);
    }
  } else {
    selectedItems.value = [];
  }
};

// Watch for both modelValue and categories changes
watch(
  [() => props.modelValue, () => categoriesStore.categories],
  () => {
    console.log("Props values", props.modelValue);
    updateSelectedItems();
  },
  { immediate: true }
);

// Initialize on mount
onMounted(() => {
  updateSelectedItems();
});
</script>

<style lang="scss" scoped>
@import "./CategorySelector.scss";
</style>
