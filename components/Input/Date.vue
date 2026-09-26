<template>
  <v-col class="pa-0" style="max-width: 400px">
    <div
      class="font-weight-medium mb-1 text-gray_700 mt-2"
      style="font-size: 14px"
    >
      Date
    </div>
    <v-text-field
      v-model="model"
      bg-color="#fff"
      variant="outlined"
      density="compact"
      height="44"
      disabled
      hide-details
      placeholder="Enter Product name"
    >
      <template #prepend-inner>
        <v-icon color="red"> $date</v-icon>
      </template>
    </v-text-field>
  </v-col>
</template>
<script setup>
import { computed } from 'vue'

defineOptions({ name: 'InputDate' })

const props = defineProps({
  modelValue: {
    type: String,
    default: 'DD/MM/YYYY',
  },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
