<template>
  <div class="feed-alert">
    <div class="alert-content">
      You are seeing general feed. Setup
      <router-link to="/feed-settings" class="alert-link"
        >feed preferences</router-link
      >
      to see personalized feed.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FeedAlert",
});
</script>

<style scoped>
.feed-alert {
  background-color: rgb(255, 243, 205);
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  margin-bottom: 16px;
  color: #856404;
  border: none;
}

/* .alert-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
} */

.alert-link {
  color: #007bff;
  font-weight: normal;
}

.alert-link:hover {
  text-decoration: underline;
}
</style>
