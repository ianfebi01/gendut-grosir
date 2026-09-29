<template>
  <div class="">
    <h1 class="pt-4 text-[30px] font-medium text-gray-900">Analitik</h1>
    <p class="text-sm font-normal text-gray-500">Lihat grafik penjualan Anda</p>

    <div class="pt-4">
      <DateRangePicker v-model="range" @apply="refetch()" />
    </div>

    <div class="pt-6">
      <UCard>
        <template v-if="datas?.length && !isPending">
          <LineChart
            :options="chartOptions"
            :data="chartData"
            :style="{ height: '300px', width: '100%' }"
          />
        </template>
        <LayoutEmpty v-else-if="!datas?.length && !isPending" />
        <div v-else class="w-full space-y-4">
          <USkeleton class="h-6 w-[200px]" />
          <USkeleton class="h-[300px] w-full" />
        </div>
      </UCard>

      <UCard v-if="datas?.length && !isPending" class="my-4">
        <BarChart
          :options="chartOptionsBar"
          :data="chartDataPendapatan"
          :style="{ height: '300px', width: '100%' }"
        />
        <div class="mt-4 flex justify-center gap-12 text-sm text-white">
          <div
            class="flex flex-col items-center rounded-lg bg-blue-600 px-4 py-2"
          >
            <span class="text-[20px] font-bold">{{
              formatRupiah(totalOmsetOnRange)
            }}</span>
            <span>Total Omset</span>
          </div>
          <div
            class="flex flex-col items-center rounded-lg bg-orange-600 px-4 py-2"
          >
            <span class="text-[20px] font-bold">{{
              formatRupiah(totalProfitOnRange)
            }}</span>
            <span>Total Keuntungan</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
import { Chart as ChartJS, Filler } from 'chart.js'
import dayjs from 'dayjs'
import DateRangePicker from '~/components/DateRangePicker.vue'
import LayoutEmpty from '~/components/Layout/Empty.vue'
import { formatRupiah } from '~/utils/formatRupiah'
import { useAnalytics } from '@/composables/queries/useLibrary'

definePageMeta({ layout: 'dashboard', title: 'Analitik' })
useHead({ title: 'Gendut Grosir | Dashboard' })

ChartJS.register(Filler)

const range = ref({ start: dayjs().startOf('month').toDate(), end: new Date() })
const params = computed(() => ({
  start: range.value.start.toISOString(),
  end: range.value.end.toISOString(),
}))

const { data, isPending, refetch } = useAnalytics(params)
const datas = computed<any[]>(() => (data.value as any[]) ?? [])

const totalOmsetOnRange = computed(() =>
  datas.value.reduce((a: number, c: any) => a + (c.totalSalesTurnover || 0), 0),
)
const totalProfitOnRange = computed(() =>
  datas.value.reduce((a: number, c: any) => a + (c.totalProfit || 0), 0),
)

const baseLegend = {
  align: 'end' as const,
  labels: {
    font: { family: 'Inter', size: 14, weight: 'medium' },
    usePointStyle: true,
    pointStyle: 'Rounded',
    padding: 15,
    boxWidth: 8,
    boxHeight: 8,
  },
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    bar: { borderRadius: 8, borderSkipped: false },
    line: {
      tension: 0.5,
      borderJoinStyle: 'round' as const,
      borderCapStyle: 'round' as const,
      fill: true,
    },
  },
  plugins: {
    filler: { propagate: true },
    legend: baseLegend,
    title: {
      align: 'start' as const,
      display: true,
      text: 'Grafik Penjualan',
      color: '#101828',
      padding: { top: 10 },
      font: { size: 25, family: 'Inter', weight: 'normal' },
    },
  },
  scales: { x: { grid: { display: false } }, y: { grid: { display: true } } },
}

const chartOptionsBar = { ...chartOptions, indexAxis: 'y' as const }

const chartData = computed(() => ({
  labels: datas.value.map((item: any) => dayjs(item._id).format('MMM D')),
  datasets: [
    {
      label: 'Jumlah Penjualan Semua Produk',
      backgroundColor: '#0a0a0a',
      borderColor: '#0a0a0a',
      data: datas.value.map((item: any) => item.totalQty),
      fill: true,
    },
  ],
}))

const chartDataPendapatan = computed(() => ({
  labels: datas.value.map((item: any) => dayjs(item._id).format('MMM D')),
  datasets: [
    {
      label: 'Omset',
      backgroundColor: '#1570EF',
      borderColor: '#1570EF',
      data: datas.value.map((item: any) => item.totalSalesTurnover),
      fill: true,
    },
    {
      label: 'Laba',
      backgroundColor: '#EC4A0A',
      borderColor: '#EC4A0A',
      data: datas.value.map((item: any) => item.totalProfit),
      fill: true,
    },
  ],
}))
</script>
