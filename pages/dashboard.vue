<template>
  <v-container fluid class="full-width-height bg-gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium text-gray_900"> Analitik </span>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal text-gray_500">
        Lihat grafik penjualan Anda
      </span>
    </v-row>
    <v-row class="px-6 pt-4">
      <!-- DatePicker -->
      <v-col cols="auto" class="pa-0">
        <DateRangePicker v-model="range" @apply="getAnalytic()" />
      </v-col>
      <!-- End -->
    </v-row>
    <v-row class="px-6 pt-6">
      <div class="row-content pa-4">
        <LineChart
          v-if="datas?.length && !loading.firstLoad"
          :options="chartOptions"
          :data="chartData"
          :style="myStyles"
        />

        <Empty v-else-if="!datas?.length && !loading.firstLoad" />
        <div v-else style="width: 100%; min-height: 300px">
          <v-skeleton-loader type="heading" width="200"></v-skeleton-loader>
          <v-skeleton-loader
            class="mt-8"
            type="image"
            width="100%"
            height="100%"
          ></v-skeleton-loader>
        </div>
      </div>
      <div
        v-if="datas?.length && !loading.firstLoad"
        class="row-content pa-4 my-4"
      >
        <Bar
          :options="chartOptionsBar"
          :data="chartDataPendapatan"
          :style="myStyles"
        />
        <div class="d-flex justify-center gap-12 text-14 mt-4 text-white">
          <div class="column--center blue-600 rounded-8 pa-2 px-4">
            <span class="text-20 font-weight-bold">{{
              formatRupiah(totalOmsetOnRange)
            }}</span>
            <span>Toal Omset</span>
          </div>
          <div class="column--center orange-600 rounded-8 pa-2 px-4">
            <span class="text-20 font-weight-bold">{{
              formatRupiah(totalProfitOnRange)
            }}</span>
            <span>Toal Keuntungan</span>
          </div>
        </div>
      </div>
    </v-row>
  </v-container>
</template>
<script>
import { Line as LineChart, Bar } from 'vue-chartjs'
import DateRangePicker from '~/components/DateRangePicker.vue'
import Empty from '~/components/Layout/Empty.vue'
import { formatRupiah } from '~/utils/formatRupiah'
import dayjs from 'dayjs'
import { useAnalyticStore } from '~/stores/analytic'

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    DateRangePicker,
    Empty,
    Bar,
  },
  data() {
    return {
      range: {
        start: dayjs().startOf('month').toDate(),
        end: new Date(),
      },
      loading: {
        firstLoad: true,
      },
      params: {
        start: '',
        end: '',
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          bar: {
            borderRadius: 8,
            borderSkipped: false,
          },
          line: {
            tension: 0.5,
            borderJoinStyle: 'round',
            borderCapStyle: 'round',
            fill: true,
            // borderColor: '#7f56d9',
          },
        },
        plugins: {
          filler: {
            propagate: true,
          },
          legend: {
            align: 'end',
            labels: {
              // This more specific font property overrides the global property
              font: {
                family: 'Inter',
                size: 14,
                weight: 'medium',
              },
              usePointStyle: true,
              pointStyle: 'Rounded',
              padding: 15,
              boxWidth: 8,
              boxHeight: 8,
            },
          },
          title: {
            align: 'start',
            display: true,
            text: 'Grafik Penjualan',
            color: '#101828',
            padding: {
              top: 10,
            },
            font: {
              size: 25,
              family: 'Inter',
              weight: 'normal',
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: true,
              // color: '#7f56d9',
            },
          },
        },
      },
      chartOptionsBar: {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,
        elements: {
          bar: {
            borderRadius: 8,
            borderSkipped: false,
          },
          line: {
            tension: 0.5,
            borderJoinStyle: 'round',
            borderCapStyle: 'round',
            fill: true,
            // borderColor: '#7f56d9',
          },
        },
        plugins: {
          filler: {
            propagate: true,
          },
          legend: {
            align: 'end',
            labels: {
              // This more specific font property overrides the global property
              font: {
                family: 'Inter',
                size: 14,
                weight: 'medium',
              },
              usePointStyle: true,
              pointStyle: 'Rounded',
              padding: 15,
              boxWidth: 8,
              boxHeight: 8,
            },
          },
          title: {
            align: 'start',
            display: true,
            text: 'Grafik Pendapatan',
            color: '#101828',
            padding: {
              top: 10,
            },
            font: {
              size: 25,
              family: 'Inter',
              weight: 'normal',
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: true,
              // color: '#7f56d9',
            },
          },
        },
      },
    }
  },
  computed: {
    datas() {
      return useAnalyticStore().analytic
    },
    totalOmsetOnRange() {
      const data = this.datas.map((item) => item.totalSalesTurnover)
      const sum = data.reduce((a, c) => a + c, 0)
      return sum
    },
    totalProfitOnRange() {
      const data = this.datas.map((item) => item.totalProfit)
      const sum = data.reduce((a, c) => a + c, 0)
      return sum
    },
    myStyles() {
      return {
        // ==== temporary comment ====
        // NOTE: $vuetify.display (unwrapped booleans) — the useDisplay()
        // setup bindings are not reachable via `this` in Options computed.
        height: this.$vuetify.display.smAndUp ? '300px' : '250px',
        width: '100%',
        // position: 'relative',
        // border: '1px solid red',
        // backgroundColor: '#FFFFFF',
      }
    },
    chartData() {
      return {
        labels: this.datas.map((item) => dayjs(item._id).format('MMM D')),
        datasets: [
          {
            label: 'Jumlah Penjualan Semua Produk',

            backgroundColor: '#7f56d9',
            borderColor: '#7f56d9',
            data: this.datas.map((item) => item.totalQty),
            fill: true,
          },
        ],
      }
    },
    chartDataPendapatan() {
      return {
        labels: this.datas.map((item) => dayjs(item._id).format('MMM D')),
        datasets: [
          {
            label: 'Omset',
            backgroundColor: '#1570EF',
            borderColor: '#1570EF',
            data: this.datas.map((item) => item.totalSalesTurnover),
            fill: true,
          },
          {
            label: 'Laba',
            backgroundColor: '#EC4A0A',
            borderColor: '#EC4A0A',
            data: this.datas.map((item) => item.totalProfit),
            fill: true,
          },
        ],
      }
    },
  },

  mounted() {
    this.getAnalytic()
  },
  methods: {
    async getAnalytic() {
      this.params = {
        ...this.params,
        ...this.range,
      }
      this.loading.firstLoad = true
      const res = await useAnalyticStore().getAnalytic(this.params)
      if (res) {
        this.loading.firstLoad = false
      } else {
        this.loading.firstLoad = false
      }
    },
    formatRupiah(item) {
      return formatRupiah(item)
    },
  },
}
</script>

<script setup>
import { Chart as ChartJS, Filler } from 'chart.js'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Gendut Grosir | Dashboard' })

// `fill: true` on the line dataset needs the Filler plugin, which the
// global chart plugin does not register.
ChartJS.register(Filler)
</script>
<style lang="scss" scoped>
.card-small {
}
</style>
