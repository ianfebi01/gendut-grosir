<template>
  <UModal v-model:open="modal" :ui="{ content: 'rounded-xl max-w-[408px] w-full' }">
    <template #content>
      <div class="flex flex-col items-center px-6 pt-6 text-center">
        <div :class="type === 'oke' ? 'icon-oke' : 'icon-default'" class="mb-4 mt-2">
          <slot name="icon" />
        </div>
        <h3 class="mb-2 text-[18px] font-bold leading-5 text-gray-900">{{ title }}</h3>
        <p class="text-sm font-normal leading-5 text-gray-500">{{ subtitle }}</p>
        <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" class="mt-3 w-full" />
      </div>
      <div class="px-6 py-4">
        <slot name="content" />
      </div>
      <div class="flex gap-2 px-6 pb-6">
        <slot name="action">
          <UButton block variant="outline" color="neutral" size="lg" :disabled="loading" @click="cancel">
            {{ cancelText }}
          </UButton>
          <UButton block color="primary" size="lg" :loading="loading" :disabled="disable" @click="save">
            {{ saveText }}
          </UButton>
        </slot>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: 'Enter Title' },
  subtitle: { type: String, default: 'Enter Subtitle to make perfect design' },
  loading: { type: Boolean, default: false },
  type: { type: String, default: 'default' },
  disable: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  modelValue: { type: Boolean, default: false },
  saveText: { type: String, default: 'Simpan' },
  cancelText: { type: String, default: 'Batal' },
})
const emit = defineEmits(['update:model-value', 'cancel', 'save', 'clearErrorMessage'])

const modal = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:model-value', v),
})

function cancel() {
  emit('cancel')
  modal.value = false
}
function save() {
  emit('save')
}
</script>

<style scoped>
.icon-default {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary-100);
  width: 58px;
  height: 58px;
  border: 8px solid var(--color-primary-50);
}
.icon-oke {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #d1fadf;
  width: 58px;
  height: 58px;
  border: 8px solid #ecfdf3;
}
</style>
