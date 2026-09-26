<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <v-text-field
        :model-value="displayRange"
        bg-color="#fff"
        hide-details
        variant="outlined"
        height="44px"
        density="compact"
        readonly
        style="width: 250px !important"
        v-bind="menuProps"
      ></v-text-field>
    </template>
    <v-card rounded="lg">
      <DatePicker
        v-model.range="range"
        :columns="2"
        color="primary"
        :max-date="maxDate"
      />

      <v-divider></v-divider>
      <v-card-actions class="d-flex pa-4">
        <v-btn
          color="gray_900"
          variant="outlined"
          class="px-4"
          height="44"
          @click="handleClickReset"
        >
          Reset
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="gray_900"
          variant="outlined"
          class="mr-2 px-4"
          height="44"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="text-white px-4"
          height="44"
          @click="handleApply"
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'

defineOptions({ name: 'DateRangePicker' })

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue', 'apply'])

const menu = ref(false)
const maxDate = ref(new Date())

const range = computed({
  get: () => props.modelValue,
  set: (newVal) => emit('update:modelValue', newVal),
})

const displayRange = computed(() => {
  const format = (date) => (date ? dayjs(date).format('D MMM YYYY') : '-')
  return `${format(props.modelValue?.start)} - ${format(
    props.modelValue?.end
  )}`
})

function defaultRange() {
  return {
    start: dayjs().startOf('month').toDate(),
    end: new Date(),
  }
}

function handleApply() {
  emit('apply')
  menu.value = false
}
function handleCancel() {
  emit('update:modelValue', defaultRange())
  menu.value = false
}
function handleClickReset() {
  emit('update:modelValue', defaultRange())
  emit('apply')
  menu.value = false
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;
//styling container and font weight in v-calendar

.vc-container {
  --primary-200: #e9d7fe !important;
  --primary-600: #7f56d9 !important;
  --primary-700: #6941c6 !important;
  --primary-900: #42307d !important;
  border: none;
}

:deep(.vc-header) {
  margin-bottom: 22px;
  padding-top: 22px;
  .vc-title {
    font-weight: 500 !important;
    color: #344054;
  }
}
:deep(.vc-pane-container) {
  margin: 10px;
  margin-bottom: 0;
}

:deep(.vc-weekday) {
  font-weight: 500 !important;
  color: black !important;
  margin-bottom: 8px;
}

:deep(.vc-day) {
  margin-bottom: 4px;
}

:deep(.vc-day-content) {
  font-weight: 400 !important;
  font-size: 14px !important;
  width: 40px !important;
  height: 40px !important;

  &.is-disabled {
    cursor: not-allowed;
    background-color: none;
    border-color: #667085;
  }

  &:not(.is-disabled):hover {
    background-color: var(--primary-200);
    color: var(--primary-600);
  }
}

:deep(.vc-highlight) {
  width: 40px !important;
  height: 40px !important;
}
</style>
