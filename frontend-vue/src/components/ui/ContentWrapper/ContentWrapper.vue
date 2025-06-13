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

<style scoped lang="scss">
@import './ContentWrapper.scss';
</style> 