<template>
  <UIcon :name="icon || 'i-lucide-layout-grid'" class="size-4 shrink-0" />
</template>

<script setup lang="ts">
defineProps<{ icon?: string }>()
</script>
