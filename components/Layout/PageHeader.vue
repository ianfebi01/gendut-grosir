<template>
  <div>
    <div class="flex items-center gap-3 pt-4">
      <h1 class="text-[30px] font-medium text-gray-900">{{ title }}</h1>
      <div class="flex-1" />
      <slot name="actions" />
      <UButton v-if="actions" color="primary" size="lg" @click="$emit('add')">
        <template #leading>
          <UIcon name="i-heroicons-plus-20-solid" class="size-4" />
        </template>
        {{ addText }}
      </UButton>
    </div>
    <p class="text-sm font-normal text-gray-500">{{ subtitle }}</p>
    <div v-if="searchBar" class="max-w-[400px] pt-4">
      <Search :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
    </div>
    <div v-if="searchBar" class="pb-1" />
  </div>
</template>

<script setup lang="ts">
import Search from '../Input/Search.vue'

defineProps({
  actions: { type: Boolean, default: true },
  searchBar: { type: Boolean, default: true },
  title: { type: String, default: 'Title' },
  subtitle: { type: String, default: 'Subtitle' },
  addText: { type: String, default: 'Tambah Customer' },
  modelValue: { type: String, default: '' },
})
defineEmits(['add', 'search', 'update:modelValue', 'update:model-value'])
</script>
