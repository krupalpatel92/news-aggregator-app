<template>
  <form @submit.prevent="handleSubmit" class="mt-5">
    <div class="mb-3 position-relative">
      <label for="name" class="form-label">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        v-model="form.name"
        :class="['form-control', { 'is-invalid': errors.name && touched.name }]"
        @blur="handleBlur('name')"
      />
      <div v-if="errors.name && touched.name" class="invalid-feedback">
        {{ errors.name }}
      </div>
    </div>

    <div class="mb-3 position-relative">
      <label for="email" class="form-label">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        v-model="form.email"
        :class="['form-control', { 'is-invalid': errors.email && touched.email }]"
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
        :class="['form-control', { 'is-invalid': errors.password && touched.password }]"
        @blur="handleBlur('password')"
      />
      <div v-if="errors.password && touched.password" class="invalid-feedback">
        {{ errors.password }}
      </div>
    </div>

    <div class="mb-3 position-relative">
      <label for="confirmPassword" class="form-label">Confirm Password:</label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        v-model="form.confirmPassword"
        :class="['form-control', { 'is-invalid': errors.confirmPassword && touched.confirmPassword }]"
        @blur="handleBlur('confirmPassword')"
      />
      <div v-if="errors.confirmPassword && touched.confirmPassword" class="invalid-feedback">
        {{ errors.confirmPassword }}
      </div>
    </div>

    <div class="mb-3 position-relative">
      <div class="form-check">
        <input
          type="checkbox"
          id="agreed"
          name="agreed"
          v-model="form.agreed"
          :class="['form-check-input', { 'is-invalid': errors.agreed && touched.agreed }]"
          @blur="handleBlur('agreed')"
        />
        <label class="form-check-label ms-2" for="agreed">
          Agreed with <router-link to="/terms-conditions">Terms & Conditions</router-link> and
          <router-link to="/privacy-policy">Privacy Policy</router-link>
        </label>
        <div v-if="errors.agreed && touched.agreed" class="invalid-feedback">
          {{ errors.agreed }}
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center gap-3">
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Signing Up...' : 'Sign Up' }}
      </button>
      <router-link to="/signin" class="text-decoration-none">
        Already have an account?
      </router-link>
    </div>

    <div v-if="!isSubmitting && error" class="alert alert-danger mt-3" role="alert">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { object, string, ref as yupRef, boolean } from "yup";
import { omit } from "lodash";
import { useSignUpMutation } from "@/api/user/signup";

const router = useRouter();
const { mutate: signUp, isLoading } = useSignUpMutation();

// Form validation schema
const validationSchema = object({
  name: string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: string()
    .required("Email is required")
    .email("Invalid email address"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: string()
    .required("Please confirm your password")
    .oneOf([yupRef("password")], "Passwords must match"),
  agreed: boolean()
    .required("You must accept the terms and conditions")
    .oneOf([true], "You must accept the terms and conditions"),
});

// Form state
const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreed: false,
});

// Validation state
const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
  agreed: false,
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreed: "",
});

const isSubmitting = ref(false);
const error = ref("");

// Handle field blur
const handleBlur = async (field: keyof typeof form) => {
  touched[field] = true;
  try {
    await validationSchema.validateAt(field, form);
    errors[field] = "";
  } catch (err: any) {
    errors[field] = err.message;
  }
};

// Validate entire form
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

// Handle form submission
const handleSubmit = async () => {
  const isValid = await validateForm();
  if (!isValid) return;

  isSubmitting.value = true;
  error.value = "";

  try {
    await signUp(omit(form, ["confirmPassword", "agreed"]));
  } catch (err: any) {
    error.value = err.message || "Registration failed. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script> 