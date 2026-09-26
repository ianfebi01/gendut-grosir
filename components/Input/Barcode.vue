<template>
  <v-text-field
    id="barcode"
    ref="barcode"
    v-model="model"
    v-barcode
    variant="outlined"
    density="compact"
    :label="label && label"
    :placeholder="placeholder"
    :loading="loading"
    :error-messages="errorMessage"
    :success-messages="successMessage"
    @keyup.enter="emit('handleBarcodeinput', props.modelValue)"
  >
    <template #prepend-inner>
      <v-icon size="25" class="mr-2">mdi-barcode</v-icon>
    </template>
  </v-text-field>
</template>

<script setup>
import { computed } from 'vue'
import { inputDirectives } from '~/utils/directive'

defineOptions({ name: 'InputBarcode' })

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Cari',
  },
  label: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  successMessage: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'handleBarcodeinput'])

// Local registration for `v-barcode` (migrated to the Vue 3
// `beforeMount` hook in `~/utils/directive`).
const vBarcode = inputDirectives.barcode

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
