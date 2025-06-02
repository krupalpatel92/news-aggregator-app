<template>
  <ContentWrapper>
    <h1>Feed Settings</h1>
    <div class="settings-container">
      <!-- Feed settings content will go here -->
    </div>
  </ContentWrapper>
</template>

<script lang="ts">
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "FeedSettingsView",
  components: {
    ContentWrapper,
  },
});
</script>

<style scoped>
.settings-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}
</style>
