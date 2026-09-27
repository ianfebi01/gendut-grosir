<template>
  <div class="min-h-screen bg-gray-100">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DefaultLayout' })
</script>
