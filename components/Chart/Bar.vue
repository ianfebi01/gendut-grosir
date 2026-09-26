<template>
  <Bar id="my-chart-id" :options="options" :data="data" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      labels: ['January', 'February', 'March'],
      datasets: [{ data: [40, 20, 12] }],
    }),
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
    }),
  },
})
</script>
