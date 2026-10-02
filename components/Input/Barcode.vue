<template>
  <UFormField :label="label" :error="errorMessage || undefined" :hint="successMessage || undefined">
    <UInput
      ref="barcodeRef"
      :model-value="modelValue"
      :placeholder="placeholder"
      :loading="loading"
      size="md"
      variant="outline"
      class="w-full"
      icon="i-lucide-scan-barcode"
      @update:model-value="$emit('update:modelValue', $event)"
      @keyup.enter="$emit('handleBarcodeinput', modelValue)"
    />
  </UFormField>
</template>

<script setup lang="ts">
defineOptions({ name: 'InputBarcode' })

defineProps({
  modelValue: { type: [String, Number] as PropType<string | number | null>, default: '' },
  placeholder: { type: String, default: 'Cari' },
  label: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  successMessage: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})
defineEmits(['update:modelValue', 'update:model-value', 'handleBarcodeinput'])

const barcodeRef = ref()
defineExpose({ focus: () => (barcodeRef.value as any)?.inputRef?.focus?.() })
</script>
