<template>
  <div class="user-actions">
    <template v-if="!isLoggedIn">
      <router-link
        to="/signin"
        class="d-flex align-items-center text-dark text-decoration-none pe-3 me-3 border-end"
      >
        <i class="fa-solid fa-right-to-bracket me-2 fs-5"></i>
        SignIn
      </router-link>
      <router-link
        to="/signup"
        class="d-flex align-items-center text-dark text-decoration-none"
      >
        <i class="fa-solid fa-user-plus me-2 fs-5"></i>
        SignUp
      </router-link>
    </template>
    <template v-else>
      <span class="me-2">Hello, {{ userProfile?.name }}</span>
      <span class="border-start ps-2">
        <button
          class="btn btn-link text-dark text-decoration-none p-0"
          @click="handleLogout"
        >
          <i class="fa-solid fa-right-from-bracket me-2"></i>
          Logout
        </button>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const isLoggedIn = computed(() => auth.isLoggedIn);
const userProfile = computed(() => auth.userProfile);

const handleLogout = () => {
  auth.logout();
};
</script>

<style scoped lang="scss">
.user-actions {
  display: flex;
  align-items: center;

  a,
  button {
    font-weight: 400;
    letter-spacing: 0.5px;
  }
}
</style>
