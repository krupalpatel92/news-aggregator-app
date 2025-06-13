<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSourcesStore } from "@/stores/sources";
import { sortBy } from "lodash-es";

const props = defineProps<{
  modelValue?: number[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
}>();

const sourcesStore = useSourcesStore();
const selectedItems = ref<number[]>([]);

const options = computed(() => {
  if (!sourcesStore.sources) return [];
  return sortBy(sourcesStore.sources, "name").map((source) => ({
    value: source.id,
    label: source.name,
  }));
});

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleChange = (values: number[]) => {
  emit("update:modelValue", values || []);
};

watch(
  [() => props.modelValue, () => sourcesStore.sources],
  ([newValue, sources]) => {
    if (newValue && sources && sources.length > 0) {
      selectedItems.value = Array.isArray(newValue) ? newValue : [newValue];
    } else {
      selectedItems.value = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="selector-wrapper">
    <a-select
      v-model:value="selectedItems"
      mode="multiple"
      placeholder="Select sources"
      :options="options"
      :filter-option="filterOption"
      @change="handleChange"
      class="source-select"
      :dropdown-style="{ padding: '8px' }"
      :max-tag-count="3"
      :dropdown-match-select-width="true"
      :show-search="true"
      :virtual="false"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "./source.scss";
</style>
