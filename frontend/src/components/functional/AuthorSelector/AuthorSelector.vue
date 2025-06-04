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

onMounted(async () => {
  if (!authorsStore.authors) {
    await authorsStore.fetchAuthors();
  }
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.selector-wrapper {
  width: 100%;
  min-width: 200px;
}

:deep(.author-select) {
  width: 100%;

  .ant-select-selector {
    background: #f8f9fa !important;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    min-height: 38px !important;
    padding: 2px 8px !important;

    &:hover {
      border-color: #007bff !important;
    }
  }

  &.ant-select-focused {
    .ant-select-selector {
      border-color: #007bff !important;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1) !important;
    }
  }

  .ant-select-selection-placeholder {
    color: #6c757d;
    line-height: 32px;
  }

  .ant-select-selection-item {
    background: #e9ecef;
    border-radius: 4px;
    border: 1px solid #dee2e6;
    margin: 2px;
  }

  .ant-select-selection-search {
    margin-inline-start: 0;
  }
}

:deep(.ant-select-dropdown) {
  padding: 4px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 
              0 6px 16px 0 rgba(0, 0, 0, 0.08),
              0 9px 28px 8px rgba(0, 0, 0, 0.05);

  .ant-select-item {
    padding: 8px 12px;
    border-radius: 4px;
    margin: 2px 0;
    color: #495057;

    &:hover {
      background-color: #f8f9fa;
    }

    &-option-selected {
      background-color: #e9ecef !important;
      font-weight: 500;
    }

    &-option-active {
      background-color: #f8f9fa;
    }
  }

  .ant-select-empty {
    padding: 12px;
    color: #6c757d;
  }

  .ant-select-item-empty {
    padding: 12px;
    color: #6c757d;
    text-align: center;
  }
}
</style>
