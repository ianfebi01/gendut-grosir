<template>
  <div class="flex flex-col items-center justify-center px-8 py-8">
    <img
      :src="img"
      alt="Empty"
      class="w-full"
      :style="{ maxWidth: `${maxWidthImage}px`, maxHeight: `${maxHeightImage}px` }"
    />
    <span class="mt-4 text-[18px] font-medium text-gray-900">{{ title }}</span>
    <p class="mb-6 mt-2 text-center text-sm text-gray-500">{{ description }}</p>
    <slot name="button" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'No data found' },
  description: { type: String, default: 'Please clear filter or add new data' },
  img: { type: String, default: '/empty.svg' },
  maxHeightImage: { type: String, default: '305' },
  maxWidthImage: { type: String, default: '355' },
})
</script>
