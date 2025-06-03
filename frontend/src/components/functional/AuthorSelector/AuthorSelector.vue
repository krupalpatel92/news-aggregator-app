<template>
  <div class="selector-wrapper">
    <Multiselect
      v-model="selectedItems"
      :options="options"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      placeholder="Select authors..."
      label="label"
      track-by="value"
      :loading="isLoading"
      :multiple="true"
      @update:modelValue="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
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
const selectedItems = ref([]);

const options = computed(() => {
  if (!authorsStore.authors) return [];
  return sortBy(authorsStore.authors, "name").map((author) => ({
    value: author.id,
    label: author.name,
  }));
});

const handleChange = (values: any[]) => {
  emit(
    "update:modelValue",
    values.map((v) => v.value)
  );
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && options.value) {
      selectedItems.value = options.value.filter((opt) =>
        newValue.includes(opt.value)
      );
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

:deep(.multiselect) {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:hover {
    border-color: #007bff;
  }

  &.is-active {
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    border-color: #007bff;
  }
}
</style>
