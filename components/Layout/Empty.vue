<template>
  <v-layout
    :class="`d-flex flex-column justify-center align-center ${padding}`"
    style="width: 100%; height: 100%"
  >
    <v-img :src="img" max-height="305" max-width="355" />
    <span class="gray_900--text mt-4 font-weight-medium text-18">{{
      title
    }}</span>
    <p :class="`mt-2 ${gapBottom} text-center text-14 gray_500--text`">
      {{ description }}
    </p>
    <slot name="button"></slot>
  </v-layout>
</template>
<script>
export default {
  name: 'Empty',
  props: {
    title: {
      type: String,
      default: 'No data found',
    },
    description: {
      type: String,
      default: 'Please clear filter or add new data',
    },
    img: {
      type: String,
      default: '/empty.svg',
    },
    padding: {
      type: String,
      default: 'pa-8',
    },
    gapBottom: {
      type: String,
      default: 'mb-6',
    },
  },
}
</script>
