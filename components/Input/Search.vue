<template>
  <v-text-field
    id="search"
    :model-value="modelValue"
    :placeholder="placeholder"
    hide-details
    @keyup="debounceInput($event)"
  >
    <template #prepend-inner>
      <v-icon size="15" class="mr-2">$magnify</v-icon>
    </template>
  </v-text-field>
</template>

<script setup>
import debounce from 'lodash/debounce'

defineOptions({ name: 'InputSearch' })

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Cari',
  },
})
const emit = defineEmits(['update:modelValue'])

const debounceInput = debounce(function (event) {
  const q = event.target.value
  emit('update:modelValue', q)
}, 500)
</script>
