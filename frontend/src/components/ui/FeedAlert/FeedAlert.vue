<template>
  <div v-if="shouldShowAlert" :class="alertClass" role="alert">
    <!-- Guest Feed -->
    <template v-if="msgConditions.isGuestFeed">
      You are not logged in. <router-link to="/signin">Login</router-link> to
      see your feed.
    </template>

    <!-- General Feed -->
    <template v-if="msgConditions.isGeneralFeed">
      You are seeing general feed. Setup
      <router-link to="/feed-settings">feed preferences</router-link> to see
      personalized feed.
    </template>

    <!-- Personal Feed -->
    <!-- <template v-if="msgConditions.isPersonalFeed">
      You are seeing personalized feed based on your
      <router-link to="/feed-settings">preferences</router-link>.
    </template> -->

    <!-- Search Result Feed -->
    <template v-if="msgConditions.isSearchResultFeed">
      You are seeing feed based on your search query and filters.
      <a href="#" @click.prevent="handleClearSearch" class="clear-search">
        <strong><u>Reset Search Filters</u></strong>
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
// import { useUserPreferencesStore } from "@/stores/userPreferences";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
// const preferencesStore = useUserPreferencesStore();

const msgConditions = computed(() => {
  const hasSearch = Object.keys(route.query).length > 0;
  // const hasFeed = preferencesStore.feedPreferences &&
  //   Object.values(preferencesStore.feedPreferences).some(val => val && val.length > 0);

  return {
    isGuestFeed: !authStore.isLoggedIn && !hasSearch,
    isGeneralFeed: authStore.isLoggedIn && !hasSearch,
    // isPersonalFeed: authStore.isLoggedIn && hasFeed && !hasSearch,
    isSearchResultFeed: hasSearch,
  };
});

const alertClass = computed(() => {
  return {
    alert: true,
    "alert-info": msgConditions.value.isGuestFeed,
    "alert-warning": msgConditions.value.isGeneralFeed,
    // "alert-success": msgConditions.value.isPersonalFeed,
    "alert-primary": msgConditions.value.isSearchResultFeed,
  };
});

const shouldShowAlert = computed(() => {
  return Object.values(msgConditions.value).some((condition) => condition);
});

const handleClearSearch = () => {
  router.replace({ query: {} });
};
</script>

<style lang="scss" scoped>
.alert {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid transparent;

  &.alert-info {
    background-color: #cce5ff;
    border-color: #b8daff;
    color: #004085;
  }

  &.alert-warning {
    background-color: #fff3cd;
    border-color: #ffeeba;
    color: #856404;
  }

  &.alert-success {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
  }

  &.alert-primary {
    background-color: #e7f5ff;
    border-color: #b8daff;
    color: #004085;
  }

  a {
    color: inherit;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  .clear-search {
    margin-left: 0.5rem;
  }
}
</style>
