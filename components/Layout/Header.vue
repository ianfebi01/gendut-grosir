<template>
  <header
    class="z-30 flex h-12 items-center gap-2 border-b border-gray-200 bg-white"
  >
    <UButton
      variant="ghost"
      color="neutral"
      size="sm"
      @click="$emit('toggleDrawer')"
    >
      <template #leading>
        <UIcon name="i-heroicons-bars-3-20-solid" class="size-4 text-ink-600" />
      </template>
    </UButton>

    <div v-if="pageTitle" class="flex items-center gap-2">
      <UIcon name="i-lucide-chevron-right" class="text-ink-600" />
      <span>{{ pageTitle }}</span>
    </div>
    <div class="grow"></div>
    <div v-if="router === '/'" class="pr-2">
      <UButton variant="ghost" color="primary" size="sm" @click="openCart">
        <template #leading>
          <UBadge
            v-if="cart?.length"
            :label="String(cart.length)"
            color="primary"
            size="xs"
            class="absolute -right-1 -top-1"
          />
          <CartIcon class="size-5 text-primary-600" />
        </template>
      </UButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import CartIcon from '@/components/CustomIcons/Cart.vue'

defineEmits(['toggleDrawer'])
const route = useRoute()
const orderStore = useOrderStore()

const router = computed(() => route.path)
const cart = computed(() => orderStore.cart)
// Set per page via definePageMeta({ title })
const pageTitle = computed(() => route.meta.title)

function openCart() {
  orderStore.setModalCart(true)
}
</script>
