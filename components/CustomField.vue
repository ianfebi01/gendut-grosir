<template>
  <form @submit.prevent="submit">
    <div class="mt-6 grid grid-cols-1 gap-4 px-6 sm:grid-cols-2">
      <div v-for="(item, i) in datas" :key="i">
        <label class="mb-1 mt-2 block text-sm font-medium text-gray-700">
          {{ item.label }}
          <span v-if="item.validations?.required" class="text-red-500">*</span>
        </label>
        <UInput
          v-if="item.fieldType === 'textField'"
          v-model="form[item.valueName]"
          :type="item.type || 'text'"
          :placeholder="item.placeholder"
          size="md"
          class="w-full"
          @blur="touch(item.valueName)"
        />
        <USelect
          v-else-if="item.fieldType === 'select'"
          v-model="form[item.valueName]"
          :items="item.items"
          value-key="value"
          label-key="name"
          :placeholder="item.placeholder"
          size="md"
          class="w-full"
        />
        <USwitch
          v-else-if="item.fieldType === 'switch'"
          v-model="form[item.valueName]"
          class="ml-1 mt-3"
        />
        <div v-else-if="item.fieldType === 'checkbox'" class="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <UCheckbox
            v-for="(item2, index) in item.checkboxItem"
            :key="index"
            :model-value="form[item.valueName]?.includes?.(item2.value)"
            :label="item2.name"
            @update:model-value="toggleCheck(item.valueName, item2.value)"
          />
        </div>
        <p v-if="errorMessage(item?.valueName)" class="mt-1 text-xs text-red-500">{{ errorMessage(item?.valueName) }}</p>
      </div>
    </div>
    <div class="px-6 pb-6">
      <UButton type="submit" color="primary" size="lg" block :disabled="!valid">Submit</UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
defineOptions({ name: 'CustomField' })

const props = defineProps({ datas: { type: Array as PropType<any[]>, default: () => [] } })
const emit = defineEmits(['handleSubmit'])

const form = reactive<Record<string, any>>({})
const touched = reactive<Record<string, boolean>>({})

function touch(name: string) {
  touched[name] = true
}

function errorMessage(name: string): string {
  if (!touched[name]) return ''
  const item = props.datas.find((d: any) => d.valueName === name)
  const val = form[name]
  if (item?.validations?.required && (val === '' || val == null)) return 'Field Tidak Boleh Kosong'
  if (item?.validations?.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Format email tidak valid'
  if (item?.validations?.minLength && String(val ?? '').length < item.validations.minLength)
    return `Input minimal ${item.validations.minLength} karakter`
  if (item?.validations?.numeric && val !== '' && val != null && isNaN(Number(val))) return 'Input hanya boleh angka'
  if (item?.validations?.sameAs && val !== form[item.validations.sameAs]) return 'Input harus sama'
  return ''
}

const valid = computed(() => props.datas.every((d: any) => !errorMessage(d.valueName) && (!d.validations?.required || (form[d.valueName] !== '' && form[d.valueName] != null))))

function toggleCheck(name: string, value: any) {
  const arr = Array.isArray(form[name]) ? [...form[name]] : []
  const idx = arr.indexOf(value)
  if (idx === -1) arr.push(value)
  else arr.splice(idx, 1)
  form[name] = arr
}

function submit() {
  props.datas.forEach((d: any) => touch(d.valueName))
  if (!valid.value) return
  emit('handleSubmit', { ...form })
}
</script>
