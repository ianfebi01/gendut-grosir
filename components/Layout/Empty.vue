<template>
  <v-layout
    :class="`d-flex flex-column justify-center align-center ${padding}`"
  >
    <v-img :src="img" :max-height="maxHeightImage" :max-width="maxWidthImage" />
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
    maxHeightImage: {
      type: String,
      default: '305',
    },
    maxWidthImage: {
      type: String,
      default: '355',
    },
  },
}
</script>
