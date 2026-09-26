<template>
  <div>
    <div
      style="font-size: 14px"
      class="font-weight-medium mb-1 text-gray_700 mt-2"
    >
      {{ item?.label }}
      <span v-if="item?.validations?.required" style="color: red !important"
        >*</span
      >
    </div>
    <v-text-field
      v-if="item?.fieldType === 'textField'"
      v-model="model"
      v-types="item?.type"
      :type="item?.type"
      variant="outlined"
      density="compact"
      bg-color="#fff"
      height="44"
      :hide-details="errorMessages == ''"
      :placeholder="item?.placeholder"
      :error-messages="errorMessages"
      @blur="emit('blur')"
    ></v-text-field>
    <slot
      v-else-if="item?.fieldType === 'autocomplete'"
      name="autocomplete"
      :error-messages="errorMessages"
    />
    <v-select
      v-else-if="item?.fieldType === 'select'"
      v-model="model"
      :items="item?.items"
      item-title="name"
      item-value="value"
      variant="outlined"
      density="compact"
      bg-color="#fff"
      height="44"
      :placeholder="item?.placeholder"
      :error-messages="errorMessages"
      @blur="emit('blur')"
    ></v-select>
    <v-switch
      v-else-if="item?.fieldType === 'switch'"
      v-model="model"
      class="mt-3 ml-1"
      inset
      :label="
        item?.validations?.required
          ? item?.placeholder[0]
          : item?.placeholder[1]
      "
      :error-messages="errorMessages"
      @blur="emit('blur')"
    ></v-switch>

    <v-row v-else-if="item?.fieldType === 'checkbox'">
      <v-col
        v-for="(item2, index) in item?.checkboxitem"
        :key="index"
        cols="12"
        sm="4"
        md="4"
      >
        <v-checkbox
          v-model="model"
          :label="item2.name"
          color="primary"
          :value="item2.value"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { inputDirectives } from '@/utils/directive'

defineOptions({ name: 'DynamicField' })

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: null,
  },
  errorMessages: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue', 'blur'])

// Local registration for `v-types` (migrated to the Vue 3
// `beforeMount` hook in `@/utils/directive`).
const vTypes = inputDirectives.types

const model = computed({
  get: () => props.modelValue,
  set: (newVal) => emit('update:modelValue', newVal),
})
</script>
