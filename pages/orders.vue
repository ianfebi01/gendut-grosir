<template>
  <div>
    <PageHeader
      title="Orders"
      subtitle="Lihat orderan yang masuk"
      :actions="false"
      :model-value="search"
      @update:model-value="search = $event"
    />

    <div class="pt-4">
      <UTable
        :data="items"
        :columns="columns"
        :loading="isPending"
        class="data-table"
        :ui="{ th: 'text-ink-900! border-b-0!', td: 'text-ink-900' }"
      >
        <template #no-cell="{ row }">
          <span>{{
            (paginator.page - 1) * paginator.limit + row.index + 1
          }}</span>
        </template>
        <template #userName-cell="{ row }">
          <span>{{ row.original?.user?.name ?? '-' }}</span>
        </template>
        <template #totalProducts-cell="{ row }">
          <UButton
            variant="outline"
            color="neutral"
            size="xs"
            @click="openDetail(row.original)"
          >
            {{ (row.original?.details?.length ?? 0) + ' Produk' }}
          </UButton>
        </template>
        <template #total-cell="{ row }">
          <span>{{ formatRupiah(row.original?.total) }}</span>
        </template>
        <template #userStatus-cell="{ row }">
          <span>{{ userStatusLabel(row.original?.user?.status) }}</span>
        </template>
        <template #date-cell="{ row }">
          <span>{{ $formatDate(row.original?.date, 'with-clock') }}</span>
        </template>
        <template #status-cell="{ row }">
          <UButton
            variant="soft"
            :color="statusColor(row.original?.status)"
            size="xs"
            :title="statusHint(row.original?.status)"
            :loading="
              isBusy(row.original?.orderId) && changeStatus.isPending.value
            "
            :disabled="
              isBusy(row.original?.orderId) ||
              row.original?.status !== 'process'
            "
            @click="handleChangeStatus(row.original)"
          >
            {{ capitalizeFirstLetter(row.original?.status) }}
          </UButton>
        </template>
        <template #invoice-cell="{ row }">
          <UButton
            variant="outline"
            color="neutral"
            size="xs"
            icon="i-lucide-printer"
            :disabled="
              row.original?.status !== 'complete' ||
              isBusy(row.original?.orderId)
            "
            @click="handlePrint(row.original)"
          >
            Cetak
          </UButton>
        </template>
        <template #action-cell="{ row }">
          <UButton
            variant="outline"
            color="neutral"
            size="xs"
            :disabled="
              row.original?.status === 'complete' ||
              row.original?.status === 'cancel' ||
              isBusy(row.original?.orderId)
            "
            :loading="
              isBusy(row.original?.orderId) && cancelOrder.isPending.value
            "
            @click="handleCancel(row.original?.orderId)"
          >
            Batalkan
          </UButton>
        </template>
      </UTable>
      <div class="my-4 flex items-center text-sm">
        <span class="font-medium text-gray-700"
          >Halaman {{ page }} dari {{ paginator?.totalPages }}</span
        >
        <div class="flex-1" />
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          :disabled="!paginator?.hasPrevPage"
          @click="page--"
          >Sebelumnya</UButton
        >
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          class="ml-2"
          :disabled="!paginator?.hasNextPage"
          @click="page++"
          >Selanjutnya</UButton
        >
      </div>
    </div>

    <UModal
      v-model:open="detailModal"
      :ui="{ content: 'rounded-xl max-w-lg w-full' }"
    >
      <template #content>
        <div class="px-6 pt-6">
          <h3 class="mb-1 text-[18px] font-bold text-gray-900">
            Detail Produk
          </h3>
          <p class="text-sm font-normal text-gray-500">
            Detail produk yang di pesan
          </p>
        </div>
        <div class="space-y-2 px-6 py-4">
          <div
            v-for="item in detailsProduct?.details"
            :key="item?._id"
            class="flex items-center gap-3 rounded-lg border border-primary-300 p-2"
          >
            <UAvatar
              :src="$changeImageSize(item?.product?.image, 'sm')"
              size="lg"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-900">
                {{ item?.product?.name }}
              </p>
              <p class="text-xs text-gray-500">{{ 'Jumlah : ' + item?.qty }}</p>
            </div>
            <span class="text-sm font-bold text-gray-900">{{
              formatRupiah(item?.price)
            }}</span>
          </div>
          <div
            class="flex items-center justify-between rounded-lg border border-primary-300 p-3"
          >
            <span class="text-sm font-bold">Total</span>
            <span class="text-sm font-bold text-gray-900">{{
              formatRupiah(detailsProduct?.total)
            }}</span>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import PageHeader from '~/components/Layout/PageHeader.vue'
import { useOrders, useOrderMutations } from '@/composables/queries/useOrders'
import { printInvoice } from '~/utils/invoice'
import { formatRupiah } from '~/utils/formatRupiah'
import { capitalizeFirstLetter } from '~/utils/capitalizeFirstLetter'

definePageMeta({ layout: 'dashboard', title: 'Orders' })
useHead({ title: 'Gendut Grosir | Orders' })

const { $formatDate, $changeImageSize } = useNuxtApp()
const toast = useToast()

const search = ref('')
const debouncedSearch = refDebounced(search, 500)
const page = ref(1)

const params = computed(() => ({
  q: debouncedSearch.value,
  page: page.value,
  limit: 25,
}))
const { data, isPending } = useOrders(params)
const items = computed(() => data.value?.items ?? [])
const paginator = computed(() => data.value?.paginator ?? {})

const { changeStatus, cancelOrder } = useOrderMutations()
const busyId = ref('')

const detailModal = ref(false)
const detailsProduct = ref<any>(null)

const columns = [
  { id: 'no', header: 'No.' },
  { accessorKey: 'orderId', header: 'ID Order' },
  { id: 'userName', header: 'Nama' },
  { id: 'totalProducts', header: 'Total Order' },
  { id: 'total', header: 'Total Harga' },
  { id: 'userStatus', header: 'Status' },
  { id: 'date', header: 'Tanggal' },
  { id: 'status', header: 'Status Order' },
  { id: 'invoice', header: 'Invoice' },
  { id: 'action', header: 'Aksi' },
]

watch([search], () => {
  page.value = 1
})

function userStatusLabel(s: string) {
  return s === 'retail' ? 'Retail' : s === 'wholesaler' ? 'Sales' : '-'
}
function statusColor(s: string) {
  return s === 'complete' ? 'success' : s === 'process' ? 'info' : 'error'
}
function statusHint(s: string) {
  return s === 'process'
    ? 'Klik untuk menyelesaikan pesanan'
    : s === 'complete'
      ? 'Pesanan telah selesai'
      : 'Pesanan telah dibatalkan'
}
function isBusy(orderId: string) {
  return busyId.value !== '' && busyId.value === orderId
}

function openDetail(item: any) {
  detailsProduct.value = item
  detailModal.value = true
}

async function handleChangeStatus(order: any) {
  if (order?.status === 'complete' || order?.status === 'cancel') return
  if (!confirm('Selesaikan pesanan ini?')) return
  busyId.value = order.orderId
  try {
    await changeStatus.mutateAsync(order.orderId)
    toast.add({ title: 'Status pesanan diperbarui', color: 'success' })
  } catch {
    toast.add({ title: 'Gagal memperbarui status', color: 'error' })
  }
  busyId.value = ''
}

async function handleCancel(orderId: string) {
  if (!confirm('Batalkan pesanan ini?')) return
  busyId.value = orderId
  try {
    await cancelOrder.mutateAsync(orderId)
    toast.add({ title: 'Pesanan dibatalkan', color: 'success' })
  } catch {
    toast.add({ title: 'Gagal membatalkan pesanan', color: 'error' })
  }
  busyId.value = ''
}

async function handlePrint(order: any) {
  try {
    await printInvoice(order)
  } catch {
    toast.add({ title: 'Gagal membuka invoice', color: 'error' })
  }
}
</script>
