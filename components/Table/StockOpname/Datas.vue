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
  <TablePagination
    :page="paginator?.page ?? 1"
    :paginator="paginator"
    @update:page="$emit('update:page', $event)"
  />
</template>

<script setup lang="ts">
import TablePagination from '~/components/Table/Pagination.vue'
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
defineEmits(['update:page', 'clickProduct', 'apply'])

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
