<template>
  <div class="viz-root">
    <VisBulletLegend :items="legendItems" class="mb-3" />
    <VisXYContainer
      :data="data"
      :height="height"
      :margin="{ top: 8, right: 8 }"
      :y-domain-min-constraint="[0, 0]"
    >
      <VisArea
        :x="x"
        :y="yTurnover"
        :color="SERIES.turnover.color"
        :opacity="0.1"
        curve-type="monotoneX"
      />
      <VisArea
        :x="x"
        :y="yProfit"
        :color="SERIES.profit.color"
        :opacity="0.1"
        curve-type="monotoneX"
      />
      <VisLine
        :x="x"
        :y="[yTurnover, yProfit]"
        :color="[SERIES.turnover.color, SERIES.profit.color]"
        :line-width="2"
        curve-type="monotoneX"
      />
      <VisAxis
        type="x"
        :tick-format="xTick"
        :num-ticks="Math.min(data.length, 7)"
        :grid-line="false"
        :tick-line="false"
        :domain-line="false"
      />
      <VisAxis
        type="y"
        :tick-format="rupiahCompact"
        :num-ticks="4"
        :tick-line="false"
        :domain-line="false"
      />
      <VisCrosshair
        :template="tooltip"
        :color="[SERIES.turnover.color, SERIES.profit.color]"
        :circle-radius="4"
        :stroke-width="2"
        stroke-color="#ffffff"
      />
      <VisTooltip />
    </VisXYContainer>
  </div>
</template>

<script setup lang="ts">
import {
  VisArea,
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisTooltip,
  VisXYContainer,
} from '@unovis/vue'
import {
  SERIES,
  formatDay,
  rupiahCompact,
  rupiahFull,
  type DailyPoint,
} from './types'
import { tooltipHtml } from './tooltip'

const props = withDefaults(
  defineProps<{ data: DailyPoint[]; height?: number }>(),
  { height: 280 },
)

// Index on x keeps one slot per day (zero days included)
const x = (_: DailyPoint, i: number) => i
const yTurnover = (d: DailyPoint) => d.turnover
const yProfit = (d: DailyPoint) => d.profit
const xTick = (i: number | Date) => {
  const point = props.data[Number(i)]
  return point ? formatDay(point.date, 'D MMM') : ''
}

const legendItems = [
  {
    name: SERIES.turnover.label,
    color: SERIES.turnover.color,
    shape: 'line' as const,
  },
  {
    name: SERIES.profit.label,
    color: SERIES.profit.color,
    shape: 'line' as const,
  },
]

const tooltip = (d: DailyPoint) =>
  tooltipHtml(formatDay(d.date, 'dddd, D MMM YYYY'), [
    { ...SERIES.turnover, value: rupiahFull(d.turnover) },
    { ...SERIES.profit, value: rupiahFull(d.profit) },
  ])
</script>
