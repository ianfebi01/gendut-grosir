<template>
  <div class="mx-auto flex w-full flex-col items-center pb-10 pt-4">
    <!-- Search + customer row -->
    <div class="flex w-full flex-wrap items-center gap-2">
      <div class="min-w-[200px] flex-1">
        <Search v-model="productQ" placeholder="Cari produk" />
      </div>
      <UButton
        color="primary"
        variant="solid"
        :loading="usersPending"
        @click="modalCustomer = true"
      >
        <template #leading>
          <UIcon name="i-heroicons-users-20-solid" class="size-4" />
        </template>
        {{ activeCustomer?.name || 'Pilih Pelanggan' }}
      </UButton>
    </div>

    <!-- Product grid -->
    <div
      v-if="productsPending"
      class="flex h-[60vh] w-full items-center justify-center"
    >
      <LoadingState />
    </div>
    <div
      v-else-if="!products.length"
      class="flex h-[60vh] w-full items-center justify-center"
    >
      <EmptyState
        title="Produk tidak ditemukan"
        description="Coba kata kunci lain atau tambah produk baru."
      />
    </div>
    <div v-else class="w-full py-6">
      <div
        class="grid grid-cols-2 gap-3 md:grid-cols-3"
        :class="{ 'xl:grid-cols-4': !appStore.drawer }"
      >
        <div v-for="item in products" :key="item?._id || item?.id">
          <ProductCard
            :item="item"
            :loading="false"
            :customer-status="effectiveStatus"
            @handle-click="handleClickSelect($event)"
          />
        </div>
      </div>
      <!-- Infinite scroll sentinel (replaces v-intersect) -->
      <div
        ref="productSentinel"
        class="flex w-full items-center justify-center py-4"
      >
        <span v-if="productsFetchingNext" class="text-sm text-primary-600"
          >Sedang memuat ...</span
        >
        <span v-else-if="productsHasNext" class="text-sm text-gray-400"
          >Scroll untuk memuat lagi</span
        >
      </div>
    </div>

    <!-- Customer modal -->
    <Modal
      v-model="modalCustomer"
      title="Siapa Pelanggan Anda?"
      subtitle="Pilih salah satu pelanggan Anda"
      error-message=""
    >
      <template #icon>
        <UIcon
          name="i-heroicons-users-20-solid"
          class="size-6 text-primary-600"
        />
      </template>
      <template #content>
        <Search v-model="userQ" class="my-2" placeholder="Cari pelanggan" />
        <div v-if="usersPending && !users.length" class="space-y-2">
          <USkeleton v-for="n in 5" :key="n" class="h-16 w-full rounded-lg" />
        </div>
        <div v-else-if="users.length" class="space-y-2">
          <button
            v-for="item in users"
            :id="`scroll-${item?._id}`"
            :key="item?._id"
            type="button"
            class="flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors"
            :class="
              tempSelected?._id === item?._id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200'
            "
            @click="tempSelected = item"
          >
            -c
            <UAvatar :src="item?.profilePicture" :alt="item?.name" size="lg" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-gray-900">{{
                item?.name
              }}</span>
              <span class="block text-xs text-gray-500">{{
                formatCustomerStatus(item?.status)
              }}</span>
            </span>
          </button>
          <!-- User infinite scroll sentinel -->
          <div
            ref="userSentinel"
            class="flex w-full items-center justify-center py-4"
          >
            <span v-if="usersFetchingNext" class="text-sm text-primary-600"
              >Sedang memuat ...</span
            >
          </div>
        </div>
        <EmptyState
          v-else
          img="/family.svg"
          title="Pelanggan tidak ditemukan"
          description="Tambahkan pelanggan terlebih dahulu."
        />
      </template>
      <template #action>
        <UButton
          block
          variant="outline"
          color="neutral"
          size="lg"
          @click="handleClickCancel"
        >
          Batal
        </UButton>
        <UButton block color="primary" size="lg" @click="handleClickSelectUser">
          Pilih
        </UButton>
      </template>
    </Modal>

    <!-- Cart: right-hand layout card on lg, slide-over below lg -->
    <Teleport v-if="isXl" defer to="#layout-aside">
      <CartPanel
        :customer="activeCustomer"
        @success-checkout="showSummary = true"
      />
    </Teleport>
    <CartDialog
      v-else
      v-model="cartOpen"
      :customer="activeCustomer"
      @success-checkout="showSummary = true"
    />

    <!-- Summary modal -->
    <Modal
      v-model="showSummary"
      type="oke"
      title="Order Sukses"
      subtitle="Berikut adalah detail order Anda."
      save-text="Print Invoice"
      cancel-text="Tutup"
      :loading="downloadInvoice.isPending.value"
      @save="handleDownloadInvoice"
    >
      <template #icon>
        <UIcon
          name="i-heroicons-check-circle-20-solid"
          class="size-6 text-green-600"
        />
      </template>
      <template v-if="detailOrder && detailOrder.details" #content>
        <ul class="space-y-2">
          <li
            v-for="item in detailOrder.details"
            :key="item?._id"
            class="flex items-center gap-3 rounded-lg border border-gray-200 p-2"
          >
            <UAvatar
              :src="item?.product?.image"
              :alt="item?.product?.name"
              size="lg"
            />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-gray-900">{{
                item?.product?.name
              }}</span>
              <span class="block text-xs text-gray-500"
                >Jumlah : {{ item?.qty }}</span
              >
            </span>
            <span class="text-sm font-bold text-gray-900">{{
              formatRupiah(item?.price)
            }}</span>
          </li>
        </ul>
        <div
          class="mt-2 flex items-center justify-between rounded-lg border border-gray-200 p-3"
        >
          <span class="text-sm font-bold">Total</span>
          <span class="text-sm font-bold text-gray-900">{{
            formatRupiah(detailOrder.total)
          }}</span>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Search from '~/components/Input/Search.vue'
import ProductCard from '~/components/Card/Product.vue'
import Modal from '~/components/Dialog/Modal.vue'
import CartDialog from '~/components/Dialog/Cart.vue'
import CartPanel from '~/components/Cart/Panel.vue'
import EmptyState from '~/components/Layout/Empty.vue'
import LoadingState from '~/components/Layout/Loading.vue'
import { useInfiniteProducts } from '@/composables/queries/useProducts'
import { useInfiniteUsers } from '@/composables/queries/useUsers'
import { useOrderMutations } from '@/composables/queries/useOrders'
import { formatRupiah } from '~/utils/formatRupiah'
import { useIntersectionObserver, useMediaQuery } from '@vueuse/core'

definePageMeta({ layout: 'dashboard', title: 'Point Of Sales', aside: true })

const toast = useToast()
const userStore = useUserStore()
const orderStore = useOrderStore()
const appStore = useAppStore() // sidebar open state drives grid columns

// ---- UI state (local only) ----
const productQ = ref('')
const userQ = ref('')
const modalCustomer = ref(false)
const showSummary = ref(false)
const tempSelected: any = ref(null)

// ---- Stores (UI state only) ----
const profile: any = computed(() => userStore.profile)
const selectedUser: any = computed(() => userStore.selectedUser)
const activeCustomer: any = computed(() => {
  const sel = selectedUser.value ?? {}
  if (sel && Object.keys(sel).length) return sel
  return profile.value ?? {}
})
const effectiveStatus: any = computed(
  () => selectedUser.value?.status || profile.value?.status || '',
)
const cartOpen = computed({
  get: () => orderStore.modalCart,
  set: (v: boolean) => orderStore.setModalCart(v),
})
// Matches Tailwind's lg breakpoint, where the cart lives in the layout aside
const isXl = useMediaQuery('(min-width: 1280px)')
watch(isXl, (xl) => {
  if (xl) cartOpen.value = false
})
const detailOrder: any = computed(() => orderStore.detailOrder)

// ---- Vue Query: products (search q, category, limit 24) ----
const {
  data: productsData,
  hasNextPage: productsHasNext,
  fetchNextPage: productsFetchNext,
  isFetchingNextPage: productsFetchingNext,
  isPending: productsPending,
} = useInfiniteProducts(() => ({ q: productQ.value, category: '', limit: 24 }))

const products: any = computed(
  () => productsData.value?.pages?.flatMap((p: any) => p.items ?? []) ?? [],
)

// ---- Vue Query: users (search q, limit 8) ----
const {
  data: usersData,
  hasNextPage: usersHasNext,
  fetchNextPage: usersFetchNext,
  isFetchingNextPage: usersFetchingNext,
  isPending: usersPending,
} = useInfiniteUsers(() => ({ q: userQ.value, category: '', limit: 8 }))

const users: any = computed(
  () => usersData.value?.pages?.flatMap((p: any) => p.items ?? []) ?? [],
)

const { downloadInvoice } = useOrderMutations()

// ---- Infinite scroll via IntersectionObserver sentinels ----
const productSentinel = ref<HTMLElement | null>(null)
const userSentinel = ref<HTMLElement | null>(null)

useIntersectionObserver(
  productSentinel,
  ([entry]: any) => {
    if (
      entry?.isIntersecting &&
      productsHasNext.value &&
      !productsFetchingNext.value
    ) {
      productsFetchNext()
    }
  },
  { rootMargin: '200px' },
)

useIntersectionObserver(
  userSentinel,
  ([entry]: any) => {
    if (
      entry?.isIntersecting &&
      modalCustomer.value &&
      usersHasNext.value &&
      !usersFetchingNext.value
    ) {
      usersFetchNext()
    }
  },
  { rootMargin: '200px' },
)

// ---- Cart error -> toast (replaces Snackbar) ----
watch(
  () => orderStore.cartError,
  (msg: string) => {
    if (msg) {
      toast.add({ title: 'Gagal', description: msg, color: 'error' })
      setTimeout(() => orderStore.clearCartError(), 3000)
    }
  },
)

// ---- Actions ----
function handleClickSelect(item: any) {
  orderStore.addCart({ ...item, qty: 1 })
  if (!orderStore.cartError) {
    toast.add({ title: 'Sukses menambahkan ke keranjang', color: 'success' })
  }
}

function handleClickCancel() {
  userQ.value = ''
  tempSelected.value = null
  modalCustomer.value = false
}

function handleClickSelectUser() {
  if (tempSelected.value) {
    userStore.setSelectedUser(tempSelected.value)
  }
  userQ.value = ''
  tempSelected.value = null
  modalCustomer.value = false
}

async function handleDownloadInvoice() {
  try {
    await downloadInvoice.mutateAsync({ orderId: detailOrder.value?.orderId })
  } catch (e: any) {
    toast.add({
      title: 'Gagal mengunduh invoice',
      description: e?.data?.message ?? e?.message ?? '',
      color: 'error',
    })
  }
}

function formatCustomerStatus(item: any) {
  return item === 'wholesaler' ? 'Sales' : item === 'retail' ? 'Retail' : ''
}
</script>
