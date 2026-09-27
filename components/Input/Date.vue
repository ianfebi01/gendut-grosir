<template>
  <div class="w-full max-w-[400px]">
    <label class="mb-1 mt-2 block text-sm font-medium text-gray-700">Date</label>
    <UInput :model-value="modelValue" disabled placeholder="DD/MM/YYYY" size="md" class="w-full" :ui="{ base: 'bg-white' }" icon="i-heroicons-calendar-20-solid" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'InputDate' })
defineProps({ modelValue: { type: String, default: 'DD/MM/YYYY' } })
defineEmits(['update:modelValue'])
</script>
