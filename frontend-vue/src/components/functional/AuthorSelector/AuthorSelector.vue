<template>
  <div class="selector-wrapper">
    <a-select
      v-model:value="selectedItems"
      mode="multiple"
      placeholder="Select authors"
      :options="options"
      :filter-option="filterOption"
      @change="handleChange"
      class="author-select"
      :dropdown-style="{ padding: '8px' }"
      :max-tag-count="3"
      :dropdown-match-select-width="true"
      :show-search="true"
      :virtual="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAuthorsStore } from "@/stores/authors";
import { sortBy } from "lodash-es";

const props = defineProps<{
  modelValue?: number[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
}>();

const authorsStore = useAuthorsStore();
const isLoading = ref(true);
const selectedItems = ref<number[]>([]);

const options = computed(() => {
  if (!authorsStore.authors) return [];
  return sortBy(authorsStore.authors, "name").map((author) => ({
    value: author.id,
    label: author.name,
  }));
});

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleChange = (values: number[]) => {
  emit("update:modelValue", values || []);
};

watch(
  [() => props.modelValue, () => authorsStore.authors],
  ([newValue, authors]) => {
    if (newValue && authors && authors.length > 0) {
      selectedItems.value = Array.isArray(newValue) ? newValue : [newValue];
    } else {
      selectedItems.value = [];
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import './AuthorSelector.scss';
</style>
