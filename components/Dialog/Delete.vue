<template>
  <UModal v-model:open="modal" :ui="{ content: 'rounded-xl max-w-[408px] w-full' }">
    <template #content>
      <div class="flex flex-col items-center px-6 pt-6 text-center">
        <div class="icon-error mb-4 mt-2">
          <slot name="icon">
            <UIcon name="i-heroicons-trash-20-solid" class="size-6 text-red-600" />
          </slot>
        </div>
        <h3 class="mb-2 text-[18px] font-bold leading-5 text-gray-900">{{ title }}</h3>
        <p class="text-center text-sm font-normal leading-5 text-gray-500">{{ subtitle }}</p>
      </div>
      <div class="px-6 py-2">
        <slot name="content" />
      </div>
      <div class="flex gap-2 px-6 pb-6">
        <UButton block variant="outline" color="neutral" size="lg" :disabled="loading" @click="cancel">
          Batal
        </UButton>
        <UButton block color="error" size="lg" :loading="loading" @click="ok">
          Hapus
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: 'Delete' },
  subtitle: { type: String, default: 'Are you sure you want to delete this? This action cannot be undone.' },
  loading: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:model-value', 'cancel', 'ok'])

const modal = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:model-value', v),
})

function cancel() {
  emit('cancel')
  modal.value = false
}
function ok() {
  emit('ok')
}
</script>

<style scoped>
.icon-error {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fee4e2;
  width: 58px;
  height: 58px;
  border: 8px solid #fef3f2;
}
</style>
