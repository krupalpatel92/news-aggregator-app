<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/ui/Header/Header.vue";

export default defineComponent({
  name: "App",
  components: {
    Header,
  },
});
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <router-view></router-view>
  </div>
</template>

<style>
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --background-color: #f8f9fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-color);
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  margin: 0 auto;
  width: calc(100vw - 100px);
  padding: 20px 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: -12px;
}

.col {
  flex: 1;
  padding: 12px;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  text-decoration: none;
}

.bg-primary {
  background-color: var(--primary-color);
  color: white;
}

.m-1 {
  margin: 0.25rem;
}
</style>
