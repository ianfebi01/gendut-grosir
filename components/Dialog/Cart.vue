<template>
  <DialogModal
    v-model="model"
    title="Keranjang"
    subtitle="Tambahkan produk untuk membeli"
    :error-message="orderStore.cartError"
    save-text="Beli"
    :disable="!datas.length"
    :loading="createOrder.isPending.value || barcodeLoading"
    @save="handleCheckout"
    @clear-error-message="orderStore.clearCartError"
  >
    <template #icon>
      <CartIcon class="size-6 text-primary-600" />
    </template>
    <template #content>
      <Barcode
        ref="barcodeRef"
        v-model="barcode"
        class="mt-2"
        label="Barcode"
        placeholder="Tambahkan dengan barcode"
        :loading="barcodeLoading"
        :error-message="barcodeError"
        @handle-barcodeinput="handleBarcodeInput"
      />
      <template v-if="datas.length">
        <ul class="space-y-2">
          <li v-for="item in datas" :key="item?._id" class="border-soft flex gap-2 p-2">
            <img
              :src="imageSrc(item?.image)"
              alt="product"
              class="h-20 w-20 shrink-0 rounded-lg object-cover"
              loading="lazy"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-[16px] font-medium text-gray-900">{{ item?.name }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-[16px] font-bold">
                  {{ formatRupiah(customer?.status === 'retail' ? item?.retailPrice : item?.wholesalerPrice) }}
                </span>
                <div class="flex items-center gap-2">
                  <UButton size="xs" variant="outline" color="primary" square @click="handleMinus(item?._id)">
                    <template #leading><UIcon name="i-heroicons-minus-20-solid" class="size-4" /></template>
                  </UButton>
                  <span class="text-[16px]">{{ item?.qty }}</span>
                  <UButton size="xs" variant="outline" color="primary" square @click="handlePlus(item?._id, item?.stock)">
                    <template #leading><UIcon name="i-heroicons-plus-20-solid" class="size-4" /></template>
                  </UButton>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="border-soft mt-2 flex items-center justify-between p-3">
          <span class="text-sm font-bold">Total</span>
          <span class="text-sm font-bold text-gray-900">{{ totalLabel }}</span>
        </div>
      </template>
      <LayoutEmpty
        v-else
        img="/girl-shop.svg"
        title="Keranjang Kosong"
        description="Tambahkan produk terlebih dahulu!"
      />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import { debounce } from '~/utils/debounce'
import { formatRupiah } from '~/utils/formatRupiah'
import DialogModal from './Modal.vue'
import Barcode from '~/components/Input/Barcode.vue'
import LayoutEmpty from '../Layout/Empty.vue'
import CartIcon from '~/components/CustomIcons/Cart.vue'
import { useOrderMutations } from '@/composables/queries/useOrders'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  customer: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
})
const emit = defineEmits(['update:model-value', 'successCheckout'])

const orderStore = useOrderStore()
const { createOrder } = useOrderMutations()
const { api } = useApi()
const { $changeImageSize } = useNuxtApp()
const toast = useToast()

const barcode = ref<any>(null)
const barcodeLoading = ref(false)
const barcodeError = ref('')
const barcodeRef = ref()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:model-value', v),
})
const datas = computed(() => orderStore.cart)

const totalLabel = computed(() => {
  const total = datas.value.reduce((sum: number, item: any) => {
    const price = props.customer?.status === 'retail' ? item?.retailPrice : item?.wholesalerPrice
    return sum + (item.qty || 0) * (price || 0)
  }, 0)
  return formatRupiah(total)
})

function imageSrc(raw: string) {
  if (!raw) return '/lazy-loader.svg'
  try {
    return ($changeImageSize as any)?.(raw, 'md') ?? raw
  } catch {
    return raw
  }
}

function handlePlus(id: string, stock?: number) {
  orderStore.plus(id, stock)
}
function handleMinus(id: string) {
  orderStore.minus(id)
}

watch(model, async (val) => {
  if (val) {
    await nextTick()
    try {
      ;(barcodeRef.value as any)?.focus?.()
    } catch {}
  }
})

async function handleCheckout() {
  const details = datas.value.map((item: any) => ({
    product: item?._id,
    qty: item?.qty,
    buyPrice: item?.buyPrice,
    price: props.customer?.status === 'retail' ? item?.retailPrice : item?.wholesalerPrice,
  }))
  try {
    const result = await createOrder.mutateAsync({ user: props.customer?._id || '', details })
    orderStore.setCart([])
    orderStore.setDetailOrder(result ?? {})
    model.value = false
    emit('successCheckout')
  } catch (e: any) {
    orderStore.cartError = e?.data?.message ?? e?.message ?? 'Gagal checkout'
    toast.add({ title: 'Gagal checkout', description: orderStore.cartError, color: 'error' })
  }
}

const doBarcode = debounce(async () => {
  if (barcode.value == null || barcode.value === '') return
  barcodeLoading.value = true
  barcodeError.value = ''
  try {
    const code = String(barcode.value).replace(/[^0-9]/g, '')
    const result: any = await api(`productByBarcode/${code}`)
    const product = result?.data
    if (product) {
      orderStore.addCart({ ...product, qty: 1 }, product.stock)
      barcode.value = null
    } else {
      barcodeError.value = 'Produk tidak ditemukan'
    }
  } catch (e: any) {
    barcodeError.value = e?.data?.message ?? e?.message ?? 'Produk tidak ditemukan'
  } finally {
    barcodeLoading.value = false
  }
}, 500)

function handleBarcodeInput() {
  doBarcode()
}
</script>
