<template>
  <div class="p-6">
    <UCard>
      <template #header>
        <h1 class="text-xl font-semibold">Masonry Demo</h1>
      </template>
      <p class="text-sm text-gray-500">
        This is a placeholder page. The original masonry demo was removed during the Nuxt UI migration.
      </p>
      <template #footer>
        <UButton color="primary" variant="outline" to="/">Back to home</UButton>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>
