<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text"> Analitik </span>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
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
          :chart-options="chartOptions"
          :chart-data="chartData"
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
          :chart-options="chartOptionsBar"
          :chart-data="chartDataPendapatan"
          :style="myStyles"
        />
        <div class="d-flex justify-center gap-12 text-14 mt-4 white--text">
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

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    DateRangePicker,
    Empty,
    Bar,
  },
  layout: 'dashboard',
  data() {
    return {
      range: {
        start: new Date(this.$moment().startOf('month').toISOString()),
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
  head() {
    return {
      title: 'Gendut Grosir | Dashboard',
    }
  },
  computed: {
    datas() {
      return this.$store.get('analytic/analytic')
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
        height: this.$vuetify.breakpoint.smAndUp ? '300px' : '250px',
        width: '100%',
        // position: 'relative',
        // border: '1px solid red',
        // backgroundColor: '#FFFFFF',
      }
    },
    chartData() {
      return {
        labels: this.datas.map((item) =>
          this.$moment(item._id).format('MMM D')
        ),
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
        labels: this.datas.map((item) =>
          this.$moment(item._id).format('MMM D')
        ),
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
      const res = await this.$store.dispatch(
        'analytic/getAnalytic',
        this.params
      )
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
<style lang="scss" scoped>
.card-small {
}
</style>
