<template>
  <UCard
    :ui="{
      root: 'overflow-hidden border transition-all hover:border-ink-400',
      body: 'p-0! h-full flex flex-col',
    }"
    class="h-full cursor-pointer bg-white flex flex-col"
    :class="{ 'opacity-60 pointer-events-none': disabled }"
    @click="$emit('handleClick', item)"
  >
    <div class="relative h-37.5 p-2">
      <img
        :src="imageSrc"
        alt="product"
        class="h-full w-full object-cover rounded-md"
        loading="lazy"
      />
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white/60"
      >
        <UIcon
          name="i-heroicons-arrow-path-20-solid"
          class="size-8 animate-spin text-primary-600"
        />
      </div>
    </div>
    <div class="flex grow flex-col px-3 pb-2">
      <UBadge
        v-if="item.category.name"
        :label="item.category.name"
        variant="outline"
        class="w-fit"
        :ui="{
          base: 'ring-ink-200',
        }"
      />
      <h3
        class="line-clamp-2 min-h-[44px] text-[16px] font-medium tracking-normal text-gray-900"
      >
        {{ item?.name }}
      </h3>
      <div class="flex-1" />
      <div class="mt-1 flex items-center justify-between">
        <span class="text-[18px] font-medium text-primary-600">
          {{ price }}
        </span>
        <UBadge v-if="item?.stock <= 0" color="error" variant="soft" size="xs"
          >Habis</UBadge
        >
        <UBadge v-else color="neutral" variant="soft" size="xs"
          >Stok {{ item?.stock }}</UBadge
        >
      </div>
    </div>
    <div class="flex items-center justify-center p-2 bg-brand-600 text-white">
      <UIcon name="i-lucide-shopping-cart-plus" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { formatRupiah } from '~/utils/formatRupiah'

const props = defineProps({
  item: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  loading: { type: [Boolean, String], default: false },
  customerStatus: { type: String, default: '' },
})
defineEmits(['handleClick'])

const { $changeImageSize } = useNuxtApp()

const imageSrc = computed(() => {
  const raw = props.item?.image as string
  if (!raw) return '/lazy-loader.svg'
  try {
    return ($changeImageSize as any)?.(raw, 'md') ?? raw
  } catch {
    return raw
  }
})

const price = computed(() => {
  if (props.customerStatus === 'retail')
    return formatRupiah(props.item?.retailPrice)
  return formatRupiah(props.item?.wholesalerPrice)
})

const disabled = computed(
  () => !!props.loading || (props.item?.stock ?? 1) <= 0,
)
</script>
