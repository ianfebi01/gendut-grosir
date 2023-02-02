<template>
  <v-container fluid class="full-width-height gray_100">
    <span>gg</span>

    <LineChartGenerator
      :chart-options="chartOptions"
      :chart-data="chartData"
      :styles="myStyles"
    />
  </v-container>
</template>
<script>
import { Line as LineChartGenerator } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)
export default {
  name: 'Dashboard',
  components: {
    LineChartGenerator,
  },
  layout: 'dashboard',
  data() {
    return {
      chartData: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  computed: {
    myStyles() {
      return {
        // ==== temporary comment ====
        // minHeight: '350px',
        position: 'relative',
      }
    },
  },
}
</script>
