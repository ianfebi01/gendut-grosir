<template>
  <div>
    <label class="mb-1 mt-2 block text-sm font-medium text-gray-700">
      {{ item?.label }}
      <span v-if="item?.validations?.required" class="text-red-500">*</span>
    </label>
    <UInput
      v-if="item?.fieldType === 'textField'"
      :model-value="modelValue as any"
      :type="item?.type || 'text'"
      :placeholder="item?.placeholder"
      size="md"
      class="w-full"
      :ui="{ base: 'bg-white' }"
      @update:model-value="$emit('update:modelValue', $event)"
      @blur="$emit('blur')"
    />
    <p v-if="errorText" class="mt-1 text-xs text-red-500">{{ errorText }}</p>
    <slot v-else-if="item?.fieldType === 'autocomplete'" name="autocomplete" :error-messages="errorMessages" />
    <USelect
      v-else-if="item?.fieldType === 'select'"
      :model-value="modelValue as any"
      :items="item?.items"
      value-key="value"
      label-key="name"
      :placeholder="item?.placeholder"
      size="md"
      class="w-full"
      :ui="{ base: 'bg-white' }"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <USwitch
      v-else-if="item?.fieldType === 'switch'"
      :model-value="modelValue as any"
      class="ml-1 mt-3"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <div v-else-if="item?.fieldType === 'checkbox'" class="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <UCheckbox
        v-for="(item2, index) in item?.checkboxitem"
        :key="index"
        :model-value="(modelValue as any[])?.includes?.(item2.value)"
        :label="item2.name"
        @update:model-value="toggleCheck(item2.value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DynamicField' })

const props = defineProps({
  item: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  modelValue: { type: [String, Number, Boolean, Array] as PropType<any>, default: null },
  errorMessages: { type: Array as PropType<string[]>, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'update:model-value', 'blur'])

const errorText = computed(() => props.errorMessages?.[0] ?? '')

function toggleCheck(value: any) {
  const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const idx = arr.indexOf(value)
  if (idx === -1) arr.push(value)
  else arr.splice(idx, 1)
  emit('update:modelValue', arr)
  emit('update:model-value', arr)
}
</script>
