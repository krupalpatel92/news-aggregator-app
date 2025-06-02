<template>
  <div class="wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContentWrapper'
})
</script>

<style scoped>
.wrapper {
  margin: 0 auto;
  width: calc(100vw - 100px);
  padding: 20px 0;
}
</style> 