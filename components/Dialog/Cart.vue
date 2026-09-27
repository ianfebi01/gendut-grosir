<template>
  <!-- Small screens only; on lg the cart is a panel in the layout -->
  <USlideover
    v-model:open="model"
    side="right"
    :ui="{ content: 'max-w-md' }"
    @after:enter="panelRef?.focus()"
  >
    <template #content>
      <CartPanel
        ref="panelRef"
        :customer="customer"
        @success-checkout="onSuccess"
      >
        <template #header-actions>
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-lucide-x"
            aria-label="Tutup"
            @click="model = false"
          />
        </template>
      </CartPanel>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import CartPanel from '~/components/Cart/Panel.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  customer: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:model-value', 'successCheckout'])

const panelRef = ref<InstanceType<typeof CartPanel>>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:model-value', v),
})

function onSuccess() {
  model.value = false
  emit('successCheckout')
}
</script>
