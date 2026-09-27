<template>
  <UTable
    :data="datas"
    :columns="tableColumns"
    :loading="loading"
    class="data-table"
    :ui="{ th: 'text-ink-900! border-b-0!', td: 'text-ink-900' }"
  >
    <template #user-cell="{ row }">
      <span>{{ row.original?.user?.name ?? '-' }}</span>
    </template>
    <template #date-cell="{ row }">
      <span>{{ formatDate(row.original?.createdAt) }}</span>
    </template>
    <template #product-cell="{ row }">
      <UButton
        size="xs"
        variant="outline"
        color="neutral"
        @click="$emit('clickProduct', row.original?.product ?? [])"
      >
        {{ (row.original?.product?.length ?? 0) + ' Produk' }}
      </UButton>
    </template>
    <template #apply-cell="{ row }">
      <div class="flex items-center gap-2">
        <UBadge
          :color="row.original?.apply ? 'success' : 'warning'"
          variant="soft"
          size="sm"
        >
          {{ row.original?.apply ? 'Diterapkan' : 'Belum' }}
        </UBadge>
        <UButton
          size="xs"
          color="primary"
          :disabled="!!row.original?.apply"
          :loading="loadingApply === row.original?._id"
          @click="$emit('apply', row.original?._id)"
        >
          Sesuaikan
        </UButton>
      </div>
    </template>
  </UTable>
  <div class="my-4 flex items-center text-sm">
    <span class="font-medium text-gray-700"
      >Halaman {{ paginator?.page }} dari {{ paginator?.totalPages }}</span
    >
    <div class="flex-1" />
    <UButton
      variant="outline"
      color="neutral"
      size="sm"
      :disabled="!paginator?.hasPrevPage"
      @click="$emit('previous')"
      >Sebelumnya</UButton
    >
    <UButton
      variant="outline"
      color="neutral"
      size="sm"
      class="ml-2"
      :disabled="!paginator?.hasNextPage"
      @click="$emit('next')"
      >Selanjutnya</UButton
    >
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'StockOpnameDataTable' })

defineProps({
  datas: { type: Array as PropType<any[]>, default: () => [] },
  paginator: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  loading: { type: Boolean, default: false },
  loadingApply: { type: String, default: '' },
})
defineEmits(['next', 'previous', 'clickProduct', 'apply'])

const { $formatDate } = useNuxtApp()

const tableColumns = [
  { accessorKey: 'opnameId', header: 'Id Stock Opname' },
  { accessorKey: 'user', header: 'Pengguna' },
  { accessorKey: 'date', header: 'Tanggal' },
  { accessorKey: 'product', header: 'Detail' },
  { id: 'apply', header: 'Aksi' },
]

function formatDate(date: string | Date) {
  if (!date) return '-'
  try {
    return ($formatDate as any)?.(date, 'with-clock') ?? String(date)
  } catch {
    return String(date)
  }
}
</script>
