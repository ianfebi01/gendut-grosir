<template>
  <div class="flex h-full min-h-0 flex-col">
    <!-- Header -->
    <div
      class="flex h-14 shrink-0 items-center gap-2 border-b border-(--ui-border-muted) px-4"
    >
      <UIcon name="i-lucide-shopping-cart" class="size-4 text-ink-600" />
      <span class="font-medium text-ink-900">Keranjang</span>
      <UBadge
        v-if="datas.length"
        :label="String(totalQty)"
        color="neutral"
        variant="soft"
        size="sm"
      />
      <div class="grow" />
      <slot name="header-actions" />
    </div>

    <!-- Barcode -->
    <div class="shrink-0 px-4 pt-4">
      <Barcode
        ref="barcodeRef"
        v-model="barcode"
        placeholder="Scan atau ketik barcode"
        :loading="barcodeLoading"
        :error-message="barcodeError"
        @handle-barcodeinput="doBarcode"
      />
    </div>

    <!-- Items -->
    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <UAlert
        v-if="orderStore.cartError"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        :title="orderStore.cartError"
        close
        class="mb-3"
        @update:open="orderStore.clearCartError()"
      />

      <ul v-if="datas.length" class="space-y-2">
        <li
          v-for="item in datas"
          :key="item?._id"
          class="flex gap-3 rounded-(--radius-card) border border-(--ui-border-muted) p-2"
        >
          <img
            :src="imageSrc(item?.image)"
            alt=""
            class="size-16 shrink-0 rounded-(--radius-control) bg-ink-50 object-cover"
            loading="lazy"
          />
          <div class="flex min-w-0 flex-1 flex-col justify-between">
            <p class="line-clamp-2 text-sm font-medium text-ink-900">
              {{ item?.name }}
            </p>
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-semibold text-ink-900">
                {{ formatRupiah(priceOf(item)) }}
              </span>
              <div
                class="flex items-center rounded-(--radius-control) border border-(--ui-border-muted)"
              >
                <UButton
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-minus"
                  aria-label="Kurangi"
                  @click="orderStore.minus(item?._id)"
                />
                <span class="min-w-6 text-center text-sm tabular-nums">{{
                  item?.qty
                }}</span>
                <UButton
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-plus"
                  aria-label="Tambah"
                  @click="orderStore.plus(item?._id, item?.stock)"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
      <LayoutEmpty
        v-else
        img="/girl-shop.svg"
        title="Keranjang Kosong"
        description="Tambahkan produk terlebih dahulu!"
      />
    </div>

    <!-- Footer -->
    <div
      class="shrink-0 space-y-3 border-t border-(--ui-border-muted) bg-ink-50 p-4"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="text-ink-600">Total</span>
        <span class="text-base font-semibold text-ink-900 tabular-nums">{{
          formatRupiah(total) || 'Rp 0'
        }}</span>
      </div>
      <UButton
        block
        size="lg"
        color="primary"
        icon="i-lucide-check"
        :disabled="!datas.length"
        :loading="createOrder.isPending.value"
        @click="openConfirm"
        >Beli</UButton
      >
    </div>

    <DialogModal
      v-model="confirmOpen"
      title="Konfirmasi Pembelian"
      subtitle="Pastikan pesanan sudah benar sebelum diproses."
      save-text="Ya, Beli"
      :loading="createOrder.isPending.value"
      :error-message="confirmError"
      @save="handleCheckout"
    >
      <template #icon>
        <UIcon name="i-lucide-shopping-cart" class="size-6 text-ink-900" />
      </template>
      <template #content>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-ink-600">Pelanggan</dt>
            <dd class="truncate font-medium text-ink-900">
              {{ customer?.name || 'Umum' }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-600">Harga</dt>
            <dd class="font-medium text-ink-900">
              {{ customer?.status === 'retail' ? 'Retail' : 'Sales' }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-600">Jumlah item</dt>
            <dd class="font-medium text-ink-900 tabular-nums">
              {{ totalQty }} pcs ({{ datas.length }} produk)
            </dd>
          </div>
          <div
            class="flex justify-between gap-4 border-t border-(--ui-border-muted) pt-2"
          >
            <dt class="text-ink-600">Total</dt>
            <dd class="text-base font-semibold text-ink-900 tabular-nums">
              {{ formatRupiah(total) || 'Rp 0' }}
            </dd>
          </div>
        </dl>
      </template>
    </DialogModal>
  </div>
</template>

<script setup lang="ts">
import { debounce } from '~/utils/debounce'
import { formatRupiah } from '~/utils/formatRupiah'
import Barcode from '~/components/Input/Barcode.vue'
import LayoutEmpty from '~/components/Layout/Empty.vue'
import DialogModal from '~/components/Dialog/Modal.vue'
import { useOrderMutations } from '@/composables/queries/useOrders'
import { getProductByBarcode } from '~/api/generated/products/products'

defineOptions({ name: 'CartPanel' })

const props = defineProps({
  customer: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
})
const emit = defineEmits(['successCheckout'])

const orderStore = useOrderStore()
const { createOrder } = useOrderMutations()
const { $changeImageSize } = useNuxtApp()
const toast = useToast()

const barcode = ref<any>(null)
const barcodeLoading = ref(false)
const barcodeError = ref('')
const barcodeRef = ref()

const datas = computed(() => orderStore.cart)
const priceOf = (item: any) =>
  props.customer?.status === 'retail'
    ? item?.retailPrice
    : item?.wholesalerPrice
const total = computed(() =>
  datas.value.reduce(
    (sum: number, item: any) => sum + (item.qty || 0) * (priceOf(item) || 0),
    0,
  ),
)
const totalQty = computed(() =>
  datas.value.reduce((sum: number, item: any) => sum + (item.qty || 0), 0),
)

function imageSrc(raw: string) {
  if (!raw) return '/lazy-loader.svg'
  try {
    return ($changeImageSize as any)?.(raw, 'md') ?? raw
  } catch {
    return raw
  }
}

const confirmOpen = ref(false)
const confirmError = ref('')

function openConfirm() {
  if (!datas.value.length) return
  confirmError.value = ''
  confirmOpen.value = true
}

async function handleCheckout() {
  const details = datas.value.map((item: any) => ({
    product: item?._id,
    qty: item?.qty,
    buyPrice: item?.buyPrice,
    price: priceOf(item),
  }))
  try {
    const result = await createOrder.mutateAsync({
      user: props.customer?._id || '',
      details,
    })
    orderStore.setCart([])
    orderStore.setDetailOrder(result ?? {})
    // Close before the parent opens its "Order Sukses" modal
    confirmOpen.value = false
    emit('successCheckout')
  } catch (e: any) {
    orderStore.cartError = e?.data?.message ?? e?.message ?? 'Gagal checkout'
    confirmError.value = orderStore.cartError
    toast.add({
      title: 'Gagal checkout',
      description: orderStore.cartError,
      color: 'error',
    })
  }
}

const doBarcode = debounce(async () => {
  if (barcode.value == null || barcode.value === '') return
  barcodeLoading.value = true
  barcodeError.value = ''
  try {
    const code = String(barcode.value).replace(/[^0-9]/g, '')
    const result = await getProductByBarcode(code)
    const product: any = result?.data
    if (product) {
      orderStore.addCart({ ...product, qty: 1 }, product.stock)
      barcode.value = null
    } else {
      barcodeError.value = 'Produk tidak ditemukan'
    }
  } catch (e: any) {
    barcodeError.value =
      e?.data?.message ?? e?.message ?? 'Produk tidak ditemukan'
  } finally {
    barcodeLoading.value = false
  }
}, 500)

defineExpose({ focus: () => (barcodeRef.value as any)?.focus?.() })
</script>
