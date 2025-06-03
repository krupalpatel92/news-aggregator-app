import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/feed-settings",
      name: "feedSettings",
      component: () => import("../views/FeedSettingsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/feed-preferences",
      name: "feedPreferences",
      component: () => import("../views/FeedPreferencesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("../views/SignInView.vue"),
      meta: { guestOnly: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignUpView.vue"),
      meta: { guestOnly: true },
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // Redirect to signin page with return URL
    next({
      name: "signin",
      query: { redirect: to.fullPath },
      state: {
        message: {
          type: "warning",
          text: "You need to be logged in to access this page.",
        },
      },
    });
    return;
  }

  // Check if the route is for guests only (signin/signup)
  if (to.meta.guestOnly && auth.isLoggedIn) {
    // Redirect to home or last intended destination
    next({ name: "home" });
    return;
  }

  // Proceed with navigation
  next();
});

export default router;
