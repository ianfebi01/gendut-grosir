<template>
  <UAlert
    :color="color"
    variant="solid"
    :title="text"
    :close="true"
    class="shadow-lg"
    @close="$emit('set')"
  />
</template>

<script setup lang="ts">
defineProps({
  text: { type: String, default: 'You should set the text props!' },
  color: { type: String as PropType<'success' | 'error' | 'info' | 'warning' | 'primary' | 'secondary' | 'neutral'>, default: 'success' },
})

defineEmits(['set'])

onMounted(() => {
  // keep auto-dismiss behaviour in parent via timeout; no-op here
})
</script>
