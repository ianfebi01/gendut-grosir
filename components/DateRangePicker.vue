<template>
  <UPopover v-model:open="open">
    <UInput :model-value="displayRange" readonly size="md" icon="i-heroicons-calendar-20-solid" class="w-[250px]" @click="open = true" />
    <template #content>
      <UCard :ui="{ body: 'p-4 space-y-3' }">
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Mulai">
            <UInput v-model="draft.start" type="date" size="md" :max="today" />
          </UFormField>
          <UFormField label="Selesai">
            <UInput v-model="draft.end" type="date" size="md" :max="today" />
          </UFormField>
        </div>
        <div class="flex gap-2 pt-1">
          <UButton variant="outline" color="neutral" size="md" class="px-4" @click="handleClickReset">Reset</UButton>
          <div class="flex-1" />
          <UButton variant="outline" color="neutral" size="md" class="px-4" @click="handleCancel">Cancel</UButton>
          <UButton color="primary" size="md" class="px-4" @click="handleApply">Apply</UButton>
        </div>
      </UCard>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

defineOptions({ name: 'DateRangePicker' })

const props = defineProps({ modelValue: { type: Object as PropType<{ start?: any; end?: any }>, default: () => ({}) } })
const emit = defineEmits(['update:modelValue', 'update:model-value', 'apply'])

const open = ref(false)
const today = computed(() => dayjs().format('YYYY-MM-DD'))

const draft = reactive({ start: '', end: '' })
watch(
  () => props.modelValue,
  (v) => {
    draft.start = v?.start ? dayjs(v.start).format('YYYY-MM-DD') : ''
    draft.end = v?.end ? dayjs(v.end).format('YYYY-MM-DD') : ''
  },
  { immediate: true },
)

const displayRange = computed(() => {
  const format = (date: any) => (date ? dayjs(date).format('D MMM YYYY') : '-')
  return `${format(props.modelValue?.start)} - ${format(props.modelValue?.end)}`
})

function emitRange(start: any, end: any) {
  const payload = { start, end }
  emit('update:modelValue', payload)
  emit('update:model-value', payload)
}

function defaultRange() {
  return { start: dayjs().startOf('month').toDate(), end: new Date() }
}

function handleApply() {
  emitRange(draft.start ? new Date(draft.start) : undefined, draft.end ? new Date(draft.end) : undefined)
  emit('apply')
  open.value = false
}
function handleCancel() {
  emitRange(...Object.values(defaultRange()) as [any, any])
  open.value = false
}
function handleClickReset() {
  emitRange(...Object.values(defaultRange()) as [any, any])
  emit('apply')
  open.value = false
}
</script>
