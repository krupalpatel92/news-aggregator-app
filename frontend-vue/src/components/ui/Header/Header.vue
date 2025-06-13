<template>
  <ContentWrapper>
    <header class="wrapper">
      <div class="left-section">
        <router-link to="/" class="logo">
          <img src="/logo.svg" alt="Logo" width="75px" />
        </router-link>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">News</router-link>
          <router-link to="/feed-settings" class="nav-link"
            >Feed Settings</router-link
          >
        </nav>
      </div>
      <div class="user-section">
        <UserActions />
      </div>
    </header>
  </ContentWrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserActions from "@/components/functional/UserActions/UserActions.vue";

export default defineComponent({
  name: "Header",
  components: {
    UserActions,
  },
  data() {
    return {
      userName: "Neel Brahmbhatt", // This should come from your auth store later
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./header.scss";
</style>
