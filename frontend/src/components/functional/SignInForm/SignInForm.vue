<template>
  <div class="w-100">
    <div
      v-if="urlMessage"
      :class="`alert alert-${
        urlMessage.type || 'info'
      } alert-dismissible fade show`"
      role="alert"
    >
      {{ urlMessage.text }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>

    <form @submit.prevent="handleSubmit" class="mt-4">
      <div class="mb-3 position-relative">
        <label for="email" class="form-label">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          v-model="form.email"
          :class="[
            'form-control',
            { 'is-invalid': errors.email && touched.email },
          ]"
          @blur="handleBlur('email')"
        />
        <div v-if="errors.email && touched.email" class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>

      <div class="mb-3 position-relative">
        <label for="password" class="form-label">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          v-model="form.password"
          :class="[
            'form-control',
            { 'is-invalid': errors.password && touched.password },
          ]"
          @blur="handleBlur('password')"
        />
        <div
          v-if="errors.password && touched.password"
          class="invalid-feedback"
        >
          {{ errors.password }}
        </div>
      </div>

      <div class="mb-3 form-check">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          v-model="form.rememberMe"
          class="form-check-input"
        />
        <label class="form-check-label" for="rememberMe"> Remember Me </label>
      </div>

      <div class="d-flex align-items-center gap-3">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          Sign In
        </button>
        <router-link to="/signup" class="text-decoration-none">
          Don't have an account?
        </router-link>
      </div>

      <div
        v-if="!isSubmitting && error"
        class="alert alert-danger mt-3"
        role="alert"
      >
        Wrong Credentials
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { object, string } from "yup";
import { omit } from "lodash";
import { useSignInMutation } from "@/api/user/signin";

const validationSchema = object({
  email: string().email("Invalid email address").required("Email is required"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default defineComponent({
  name: "SignInForm",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { mutate: signIn } = useSignInMutation();

    const form = reactive({
      email: "",
      password: "",
      rememberMe: false,
    });

    const touched = reactive({
      email: false,
      password: false,
    });

    const errors = reactive({
      email: "",
      password: "",
    });

    const isSubmitting = ref(false);
    const error = ref(false);
    const urlMessage = ref(route.state?.message);

    const handleBlur = async (field: keyof typeof form) => {
      touched[field] = true;
      try {
        await validationSchema.validateAt(field, form);
        errors[field] = "";
      } catch (err: any) {
        errors[field] = err.message;
      }
    };

    const validateForm = async () => {
      try {
        await validationSchema.validate(form, { abortEarly: false });
        return true;
      } catch (err: any) {
        err.inner.forEach((error: any) => {
          errors[error.path] = error.message;
          touched[error.path] = true;
        });
        return false;
      }
    };

    const handleSubmit = async () => {
      const isValid = await validateForm();
      if (!isValid) return;

      isSubmitting.value = true;
      error.value = false;

      try {
        // TODO: Implement sign in API call
        await signIn(omit(form, ["rememberMe"]));
      } catch (err) {
        error.value = true;
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      form,
      touched,
      errors,
      isSubmitting,
      error,
      urlMessage,
      handleBlur,
      handleSubmit,
    };
  },
});
</script>
