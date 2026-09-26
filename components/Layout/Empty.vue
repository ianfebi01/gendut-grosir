<template>
  <v-row
    :class="`d-flex flex-column justify-center align-center ${padding}`"
    no-gutters
  >
    <img
      :src="img"
      alt="Empty"
      :style="{
        width: '100%',
        maxWidth: `${maxWidthImage}px`,
        maxHeight: `${maxHeightImage}px`,
      }"
    />
    <span class="text-gray_900 mt-4 font-weight-medium text-18">{{
      title
    }}</span>
    <p :class="`mt-2 ${gapBottom} text-center text-14 text-gray_500`">
      {{ description }}
    </p>
    <slot name="button"></slot>
  </v-row>
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
