<template>
  <div class="pb-8">
    <PageHeader
      title="Analitik"
      subtitle="Ringkasan penjualan toko Anda"
      :actions="false"
      :search-bar="false"
    />

    <!-- Filters: one row, scoping everything below -->
    <div class="flex flex-wrap items-center gap-2 pt-4">
      <UButton
        v-for="preset in presets"
        :key="preset.key"
        size="md"
        :variant="activePreset === preset.key ? 'solid' : 'outline'"
        :color="activePreset === preset.key ? 'primary' : 'neutral'"
        @click="applyPreset(preset)"
        >{{ preset.label }}</UButton
      >
      <DateRangePicker v-model="range" />
    </div>

    <LayoutEmpty v-if="!isPending && !hasSales" class="pt-10" />

    <div
      v-else
      class="space-y-4 pt-6 transition-opacity"
      :class="{ 'opacity-60': isFetching && !isPending }"
    >
      <!-- Stat tiles -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <UCard
          v-for="tile in tiles"
          :key="tile.label"
          :ui="{ body: 'p-4 sm:p-5' }"
        >
          <p class="text-sm text-ink-600">{{ tile.label }}</p>
          <USkeleton v-if="isPending" class="mt-2 h-8 w-32" />
          <template v-else>
            <p
              class="mt-1 text-2xl font-semibold text-ink-900 tabular-nums"
              :title="tile.full"
            >
              {{ tile.value }}
            </p>
            <p class="mt-1 text-xs text-ink-500">{{ tile.hint }}</p>
          </template>
        </UCard>
      </div>

      <div class="grid gap-4 xl:grid-cols-3">
        <UCard class="xl:col-span-2">
          <h2 class="text-base font-semibold text-ink-900">
            Omset &amp; keuntungan
          </h2>
          <p class="text-sm text-ink-500">Per hari, {{ rangeLabel }}</p>
          <USkeleton v-if="isPending" class="mt-4 h-[280px] w-full" />
          <ChartSalesTrend v-else :data="points" class="mt-4" />
        </UCard>

        <UCard>
          <h2 class="text-base font-semibold text-ink-900">Produk terjual</h2>
          <p class="text-sm text-ink-500">Jumlah item per hari</p>
          <USkeleton v-if="isPending" class="mt-4 h-[280px] w-full" />
          <ChartQtyBar v-else :data="points" :height="304" class="mt-4" />
        </UCard>
      </div>

      <!-- Table view: every charted value, reachable without hovering -->
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <div class="flex items-center gap-2 px-4 py-4 sm:px-6">
          <h2 class="flex-1 text-base font-semibold text-ink-900">
            Rincian harian
          </h2>
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            :trailing-icon="
              showTable ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
            "
            @click="showTable = !showTable"
            >{{ showTable ? 'Sembunyikan' : 'Tampilkan' }}</UButton
          >
        </div>
        <UTable
          v-if="showTable"
          :data="tableRows"
          :columns="columns"
          class="border-t border-(--ui-border-muted)"
          :ui="{ td: 'tabular-nums text-ink-900', th: 'text-ink-900!' }"
        />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import PageHeader from '~/components/Layout/PageHeader.vue'
import DateRangePicker from '~/components/DateRangePicker.vue'
import LayoutEmpty from '~/components/Layout/Empty.vue'
import ChartSalesTrend from '~/components/Chart/SalesTrend.vue'
import ChartQtyBar from '~/components/Chart/QtyBar.vue'
import {
  formatDay,
  numberFull,
  rupiahCompact,
  rupiahFull,
  type DailyPoint,
} from '~/components/Chart/types'
import { useAnalytics } from '@/composables/queries/useLibrary'

definePageMeta({ layout: 'dashboard', title: 'Analitik' })
useHead({ title: 'Gendut Grosir | Dashboard' })

type Preset = { key: string; label: string; range: () => [Date, Date] }
const presets: Preset[] = [
  {
    key: '7d',
    label: '7 hari',
    range: () => [
      dayjs().subtract(6, 'day').startOf('day').toDate(),
      new Date(),
    ],
  },
  {
    key: '30d',
    label: '30 hari',
    range: () => [
      dayjs().subtract(29, 'day').startOf('day').toDate(),
      new Date(),
    ],
  },
  {
    key: 'month',
    label: 'Bulan ini',
    range: () => [dayjs().startOf('month').toDate(), new Date()],
  },
  {
    key: 'lastMonth',
    label: 'Bulan lalu',
    range: () => {
      const last = dayjs().subtract(1, 'month')
      return [last.startOf('month').toDate(), last.endOf('month').toDate()]
    },
  },
]

const range = ref({ start: dayjs().startOf('month').toDate(), end: new Date() })
const sameDay = (a?: Date, b?: Date) => !!a && !!b && dayjs(a).isSame(b, 'day')
const activePreset = computed(
  () =>
    presets.find((p) => {
      const [start, end] = p.range()
      return sameDay(range.value.start, start) && sameDay(range.value.end, end)
    })?.key,
)
function applyPreset(preset: Preset) {
  const [start, end] = preset.range()
  range.value = { start, end }
}

const rangeStart = computed(() =>
  dayjs(range.value.start ?? new Date()).startOf('day'),
)
const rangeEnd = computed(() =>
  dayjs(range.value.end ?? new Date()).startOf('day'),
)
const rangeLabel = computed(
  () =>
    `${formatDay(rangeStart.value, 'D MMM')} - ${formatDay(rangeEnd.value, 'D MMM YYYY')}`,
)

const params = computed(() => ({
  start: rangeStart.value.toISOString(),
  end: rangeEnd.value.toISOString(),
}))
const { data, isPending, isFetching } = useAnalytics(params)

// One point per calendar day in the range; the API omits days without sales
const points = computed<DailyPoint[]>(() => {
  const byDay = new Map((data.value ?? []).map((d) => [d._id, d]))
  const result: DailyPoint[] = []
  for (
    let day = rangeStart.value;
    !day.isAfter(rangeEnd.value);
    day = day.add(1, 'day')
  ) {
    const row = byDay.get(day.format('YYYY-MM-DD'))
    result.push({
      date: day.toDate(),
      qty: row?.totalQty ?? 0,
      turnover: row?.totalSalesTurnover ?? 0,
      buyPrice: row?.totalSalesBuyPrice ?? 0,
      profit: row?.totalProfit ?? 0,
    })
  }
  return result
})
const hasSales = computed(() => (data.value ?? []).length > 0)

const sum = (key: keyof Omit<DailyPoint, 'date'>) =>
  points.value.reduce((total, p) => total + p[key], 0)
const totals = computed(() => ({
  turnover: sum('turnover'),
  profit: sum('profit'),
  qty: sum('qty'),
  days: points.value.length || 1,
}))
const margin = computed(() =>
  totals.value.turnover
    ? (totals.value.profit / totals.value.turnover) * 100
    : 0,
)

const tiles = computed(() => [
  {
    label: 'Omset',
    value: rupiahCompact(totals.value.turnover),
    full: rupiahFull(totals.value.turnover),
    hint: `Rata-rata ${rupiahCompact(totals.value.turnover / totals.value.days)} / hari`,
  },
  {
    label: 'Keuntungan',
    value: rupiahCompact(totals.value.profit),
    full: rupiahFull(totals.value.profit),
    hint: `Rata-rata ${rupiahCompact(totals.value.profit / totals.value.days)} / hari`,
  },
  {
    label: 'Margin keuntungan',
    value: `${margin.value.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`,
    full: undefined,
    hint: 'Keuntungan dibagi omset',
  },
  {
    label: 'Produk terjual',
    value: numberFull(totals.value.qty),
    full: undefined,
    hint: `${totals.value.days} hari dalam rentang`,
  },
])

const showTable = ref(false)
const tableRows = computed(() =>
  points.value
    .filter((p) => p.qty || p.turnover)
    .map((p) => ({
      date: formatDay(p.date, 'ddd, D MMM YYYY'),
      qty: numberFull(p.qty),
      turnover: rupiahFull(p.turnover),
      buyPrice: rupiahFull(p.buyPrice),
      profit: rupiahFull(p.profit),
    })),
)
const columns = [
  { accessorKey: 'date', header: 'Tanggal' },
  { accessorKey: 'qty', header: 'Produk terjual' },
  { accessorKey: 'turnover', header: 'Omset' },
  { accessorKey: 'buyPrice', header: 'Modal' },
  { accessorKey: 'profit', header: 'Keuntungan' },
]
</script>
