<template>
  <UTable
    :data="datas"
    :columns="tableColumns"
    class="data-table"
    :ui="{ th: 'text-ink-900! border-b-0!', td: 'text-ink-900' }"
  >
    <template #productName-cell="{ row }">
      <span>{{
        row.original?.productName ?? row.original?.product?.name ?? '-'
      }}</span>
    </template>
    <template #difference-cell="{ row }">
      <span>{{ differenceOf(row.original) }}</span>
    </template>
    <template #action-cell="{ row }">
      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        @click="$emit('deleteProduct', row.original?.product)"
      >
        <template #leading
          ><UIcon name="i-heroicons-trash-20-solid" class="size-4"
        /></template>
      </UButton>
    </template>
  </UTable>
</template>

<script setup lang="ts">
defineOptions({ name: 'StockOpnameProductTable' })

const props = defineProps({
  datas: { type: Array as PropType<any[]>, default: () => [] },
  readOnly: { type: Boolean, default: false },
})
defineEmits(['deleteProduct'])

const tableColumns = computed(() => {
  const cols = [
    { accessorKey: 'productName', header: 'Produk' },
    { accessorKey: 'systemQty', header: 'Stok Sistem' },
    { accessorKey: 'realQty', header: 'Stok Sebenarnya' },
    { accessorKey: 'difference', header: 'Perbedaan' },
  ]
  if (!props.readOnly)
    cols.push({ accessorKey: 'action', header: 'Aksi' } as any)
  return cols
})

function differenceOf(item: any) {
  if (item?.difference !== undefined && item?.difference !== null)
    return item.difference
  if (item?.realQty != null && item?.systemQty != null)
    return Number(item.realQty) - Number(item.systemQty)
  return '-'
}
</script>
