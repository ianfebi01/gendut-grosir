<template>
  <div class="viz-root">
    <VisXYContainer
      :data="data"
      :height="height"
      :margin="{ top: 8, right: 8 }"
      :y-domain-min-constraint="[0, 0]"
    >
      <VisStackedBar
        :x="x"
        :y="y"
        :color="SERIES.qty.color"
        :bar-max-width="24"
        :bar-padding="0.25"
        :rounded-corners="4"
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
        :tick-format="yTick"
        :num-ticks="3"
        :tick-line="false"
        :domain-line="false"
      />
      <VisTooltip :triggers="triggers" />
    </VisXYContainer>
  </div>
</template>

<script setup lang="ts">
import { StackedBar } from '@unovis/ts'
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import { SERIES, formatDay, numberFull, type DailyPoint } from './types'
import { tooltipHtml } from './tooltip'

const props = withDefaults(
  defineProps<{ data: DailyPoint[]; height?: number }>(),
  { height: 220 },
)

const x = (_: DailyPoint, i: number) => i
const y = (d: DailyPoint) => d.qty
const xTick = (i: number | Date) => {
  const point = props.data[Number(i)]
  return point ? formatDay(point.date, 'D MMM') : ''
}
const yTick = (v: number | Date) => numberFull(Number(v))

// The bar is the hit target: per-bar tooltip, no crosshair. Bars are bound
// to a record wrapping the original point in `datum`.
const triggers = {
  [StackedBar.selectors.bar]: ({ datum: d }: { datum: DailyPoint }) =>
    tooltipHtml(formatDay(d.date, 'dddd, D MMM YYYY'), [
      { ...SERIES.qty, value: `${numberFull(d.qty)} pcs` },
    ]),
}
</script>
