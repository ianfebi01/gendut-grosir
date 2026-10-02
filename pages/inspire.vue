<template>
  <div class="p-6">
    <UCard>
      <template #header>
        <h1 class="text-xl font-semibold">Inspire</h1>
      </template>
      <blockquote class="text-gray-600">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer class="mt-2 text-sm text-gray-500">
          <em>&mdash;John Johnson</em>
        </footer>
      </blockquote>
      <template #footer>
        <UButton color="primary" variant="outline" to="/">Back to home</UButton>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>
