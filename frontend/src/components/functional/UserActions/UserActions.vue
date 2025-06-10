<template>
  <div class="user-actions">
    <template v-if="!isLoggedIn">
      <router-link
        to="/signin"
        class="d-flex align-items-center text-dark text-decoration-none pe-3 me-3 border-end"
      >
        <UserAddOutlined class="action-icon" />
        <span class="ms-2">SignIn</span>
      </router-link>
      <router-link
        to="/signup"
        class="d-flex align-items-center text-dark text-decoration-none"
      >
        <UserOutlined class="action-icon" />
        <span class="ms-2">SignUp</span>
      </router-link>
    </template>
    <template v-else>
      <span class="me-2">Hello, {{ userProfile?.name }}</span>
      <span class="border-start ps-2">
        <button
          class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center"
          @click="handleLogout"
        >
          <PoweroffOutlined />
          <span class="ms-2">Logout</span>
        </button>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  PoweroffOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { toast } from "@/utils/notification";

const auth = useAuthStore();

const isLoggedIn = computed(() => auth.isLoggedIn);
const userProfile = computed(() => auth.userProfile);

const handleLogout = () => {
  auth.logout();
  toast.success("You have successfully logged out.");
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

  .action-icon {
    font-size: 18px;
  }

  :deep(.anticon) {
    font-size: 18px;
  }
}
</style>
