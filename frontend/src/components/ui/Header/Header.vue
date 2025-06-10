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
        <!-- <span class="user-name">Hello, {{ userName }}</span>
        <button class="logout-btn" @click="handleLogout">
          <span class="logout-icon">⏻</span>
          Logout
        </button> -->
      </div>
    </header>
  </ContentWrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
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
  methods: {
    handleLogout() {
      // Implement logout logic
      console.log("Logout clicked");
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0;
  overflow: hidden;
  background-color: #eee;
  border: 3px solid #eee;
  border-radius: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.left-section {
  padding: 10px 20px;
  background-color: #fff;
  flex-grow: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;

  .logo {
    padding-right: 20px;
    border-right: 2px solid #eee;
    margin-right: 20px;
    color: #007bff;
    text-decoration: none;
  }
}

.main-nav {
  display: flex;
  gap: 1.5rem;

  .nav-link {
    color: #333;
    text-decoration: none;
    font-size: 0.95rem;

    &:hover {
      color: #ff0c81;
    }
  }
}

:deep(.router-link-active) {
  color: #ff0c81 !important;
}

.user-section {
  padding: 10px 20px;

  .user-name {
    color: #333;
    font-size: 0.95rem;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border: none;
    background: none;
    color: #666;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      color: #333;
    }

    .logout-icon {
      font-size: 1rem;
    }
  }
}
</style>
