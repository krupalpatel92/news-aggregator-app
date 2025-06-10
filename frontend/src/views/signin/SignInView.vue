<template>
  <ContentWrapper>
    <FeedAlert class="mb-4" />
    <h1 class="text-center mb-4">Sign In</h1>
    <div class="col-md-4 mx-auto">
      <SignInForm />
    </div>
  </ContentWrapper>
</template>

<script setup lang="ts">
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import SignInForm from "@/components/functional/SignInForm/SignInForm.vue";
import FeedAlert from "@/components/ui/FeedAlert/FeedAlert.vue";
</script>

<style scoped>
.text-center {
  text-align: center;
}

.col-4 {
  width: 33.333333%;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .col-4 {
    width: 100%;
    padding: 0 1rem;
  }
}
</style>
