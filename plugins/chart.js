import Vue from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as Chartjs,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js'

Chartjs.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement
)
Vue.component('line-chart', { extends: Line })
