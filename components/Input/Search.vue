<template>
  <UInput
    :model-value="modelValue"
    :placeholder="placeholder"
    icon="i-heroicons-magnifying-glass-20-solid"
    size="md"
    class="w-full"
    :ui="{
      base: 'bg-ink-200 focus:outline-ink-600 focus:bg-white hover:bg-white focus:ring-ink-600 transition-colors duration-150 ease-in-out',
    }"
    @update:model-value="debouncedEmit"
  />
</template>

<script setup lang="ts">
import { debounce } from '~/utils/debounce'

defineOptions({ name: 'InputSearch' })

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Cari' },
})
const emit = defineEmits(['update:modelValue', 'update:model-value'])

const debouncedEmit = debounce((val: string) => {
  emit('update:modelValue', val)
  emit('update:model-value', val)
}, 500)
</script>
