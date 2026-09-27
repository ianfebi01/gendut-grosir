<template>
  <UCard
    :ui="{ root: 'overflow-hidden border transition-all hover:border-primary-300', body: 'p-0!' }"
    class="h-full cursor-pointer bg-white"
    :class="{ 'opacity-60 pointer-events-none': disabled }"
    @click="$emit('handleClick', item)"
  >
    <div class="relative">
      <img
        :src="imageSrc"
        alt="product"
        class="h-[150px] w-full object-cover"
        loading="lazy"
      />
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/60">
        <UIcon name="i-heroicons-arrow-path-20-solid" class="size-8 animate-spin text-primary-600" />
      </div>
    </div>
    <div class="flex h-[calc(100%-150px)] flex-col px-3 py-2">
      <h3 class="line-clamp-2 min-h-[44px] text-[16px] font-medium tracking-normal text-gray-900">
        {{ item?.name }}
      </h3>
      <div class="flex-1" />
      <div class="mt-1 flex items-center justify-between">
        <span class="text-[18px] font-bold text-primary-600">
          {{ price }}
        </span>
        <UBadge v-if="item?.stock <= 0" color="error" variant="soft" size="xs">Habis</UBadge>
        <UBadge v-else color="neutral" variant="soft" size="xs">Stok {{ item?.stock }}</UBadge>
      </div>
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
  if (props.customerStatus === 'retail') return formatRupiah(props.item?.retailPrice)
  return formatRupiah(props.item?.wholesalerPrice)
})

const disabled = computed(() => !!props.loading || (props.item?.stock ?? 1) <= 0)
</script>
