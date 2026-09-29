<template>
  <UModal
    v-model:open="open"
    :title="
      opname?.opnameId ? `Stock Opname #${opname.opnameId}` : 'Stock Opname'
    "
    :description="meta"
    :ui="{ content: 'max-w-3xl', footer: 'justify-end gap-2' }"
  >
    <template #body>
      <!-- Summary -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-(--radius-card) bg-ink-50 px-3 py-2.5"
        >
          <p class="text-xs text-ink-500">{{ stat.label }}</p>
          <p class="mt-0.5 text-base font-semibold text-ink-900 tabular-nums">
            <template v-if="stat.badge">
              <UBadge
                :color="opname?.apply ? 'success' : 'warning'"
                variant="soft"
                :icon="opname?.apply ? 'i-lucide-check' : 'i-lucide-clock'"
                :label="stat.value"
              />
            </template>
            <template v-else>{{ stat.value }}</template>
          </p>
        </div>
      </div>

      <!-- Lines -->
      <div
        class="mt-4 overflow-hidden rounded-(--radius-card) border border-(--ui-border-muted)"
      >
        <UTable
          :data="lines"
          :columns="columns"
          :ui="{
            th: 'bg-ink-50 text-ink-700 font-medium',
            td: 'text-ink-900',
          }"
        >
          <template #systemQty-header>
            <span class="block text-right">Stok Sistem</span>
          </template>
          <template #realQty-header>
            <span class="block text-right">Stok Fisik</span>
          </template>
          <template #difference-header>
            <span class="block text-right">Selisih</span>
          </template>
          <template #name-cell="{ row }">
            <span class="font-medium">{{ row.original.name }}</span>
          </template>
          <template #systemQty-cell="{ row }">
            <span class="block text-right tabular-nums">{{
              row.original.systemQty
            }}</span>
          </template>
          <template #realQty-cell="{ row }">
            <span class="block text-right tabular-nums">{{
              row.original.realQty
            }}</span>
          </template>
          <template #difference-cell="{ row }">
            <div class="flex justify-end">
              <UBadge
                :color="toneOf(row.original.difference)"
                variant="soft"
                class="tabular-nums"
                :label="signed(row.original.difference)"
              />
            </div>
          </template>
        </UTable>
      </div>
    </template>

    <template #footer>
      <UButton variant="outline" color="neutral" @click="open = false"
        >Tutup</UButton
      >
      <UButton
        v-if="opname && !opname.apply"
        color="primary"
        icon="i-lucide-check"
        :loading="loadingApply"
        @click="opname._id && $emit('apply', opname._id)"
        >Sesuaikan Stok</UButton
      >
    </template>
  </UModal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import type { StockOpname } from '~/api/generated/gendutGrosirAPI.schemas'

defineOptions({ name: 'StockOpnameDetailDialog' })

const props = defineProps<{
  opname: StockOpname | null
  loadingApply?: boolean
}>()
defineEmits<{ apply: [id: string] }>()

const open = defineModel<boolean>({ default: false })

const meta = computed(() => {
  const o = props.opname
  if (!o) return undefined
  const date = o.date ?? o.createdAt
  return [
    date ? dayjs(date).locale('id').format('dddd, D MMMM YYYY · HH:mm') : null,
    o.user?.name ? `oleh ${o.user.name}` : null,
  ]
    .filter(Boolean)
    .join(' · ')
})

const lines = computed(() =>
  (props.opname?.product ?? []).map((line) => ({
    name: line.product?.name ?? '-',
    systemQty: line.systemQty,
    realQty: line.realQty,
    difference: line.difference ?? line.realQty - line.systemQty,
  })),
)

const stats = computed(() => {
  const totalDiff = lines.value.reduce((sum, l) => sum + l.difference, 0)
  const mismatched = lines.value.filter((l) => l.difference !== 0).length
  return [
    {
      label: 'Status',
      value: props.opname?.apply ? 'Diterapkan' : 'Belum diterapkan',
      badge: true,
    },
    { label: 'Produk', value: String(lines.value.length) },
    { label: 'Produk selisih', value: String(mismatched) },
    { label: 'Total selisih', value: signed(totalDiff) },
  ]
})

const columns = [
  { accessorKey: 'name', header: 'Produk' },
  { accessorKey: 'systemQty', header: 'Stok Sistem' },
  { accessorKey: 'realQty', header: 'Stok Fisik' },
  { accessorKey: 'difference', header: 'Selisih' },
]

function signed(n: number) {
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0'
}
function toneOf(n: number) {
  return n > 0 ? 'success' : n < 0 ? 'error' : 'neutral'
}
</script>
