<template>
  <header
    class="z-30 flex h-14 items-center gap-2 border-b border-gray-200 bg-white"
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
    <div v-if="router === '/'" class="pr-2 lg:hidden">
      <UButton variant="link" color="primary" size="sm" @click="openCart">
        <template #leading>
          <div class="relative">
            <UBadge
              v-if="cart?.length"
              :label="String(cart.length)"
              color="primary"
              size="xs"
              class="absolute left-full bottom-full translate-y-0.5 size-4 flex items-center justify-center"
            />
            <UIcon
              name="i-lucide-shopping-cart"
              class="size-3.5 text-ink-600"
            />
          </div>
        </template>
      </UButton>
    </div>
  </header>
</template>

<script setup lang="ts">
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
