<template>
  <ContentWrapper>
    <h1 class="text-center mb-4">Sign In</h1>
    <div class="col-md-4 mx-auto">
      <SignInForm />
    </div>
  </ContentWrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContentWrapper from "@/components/ui/ContentWrapper/ContentWrapper.vue";
import SignInForm from "@/components/functional/SignInForm/SignInForm.vue";

export default defineComponent({
  name: "SignInView",
  components: {
    ContentWrapper,
    SignInForm,
  },
});
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
