<template>
  <v-card
    class="card"
    variant="outlined"
    style="overflow: hidden"
    :loading="loading === item?.id"
    :disabled="loading === item?.id || item?.stock <= 0"
    @click="$emit('handleClick', item)"
  >
    <template #progress>
      <v-progress-circular
        indeterminate
        size="35"
        color="primary"
        class="loader"
      ></v-progress-circular>
    </template>
    <v-container class="pa-0 d-flex flex-column" style="height: 100%">
      <v-img
        lazy-src="/lazy-loader.svg"
        :src="
          $vuetify.display.mdAndUp
            ? $changeImageSize(item?.image, 'md')
            : $changeImageSize(item?.image, 'sm')
        "
        height="150px"
        width="100%"
        class=""
      >
        <v-card-actions class="d-flex justify-end">
          <v-btn
            icon
            size="small"
            active-class="color:primary !important"
            class="pa-2"
            variant="flat"
            color="primary"
          >
            <span class="text-white font-weight-bold">{{ item?.stock }}</span>
          </v-btn>
        </v-card-actions>
      </v-img>

      <v-list-item-title
        class="text-title mt-2 font-weight-medium letter-spacing-normal text-14 text-gray_900 px-3"
        style="width: 100%"
      >
        {{ item?.name }}
      </v-list-item-title>
      <div class="flex-grow-1"></div>
      <v-card-actions class="px-0 text-body-2 mx-3">
        <div
          style="width: 100%"
          class="px-0 d-flex align-center justify-space-between"
        >
          <div class="d-flex flex-column justify-center">
            <span class="text-secondary text-subtitle-2">Price:</span>
            <span class="text-gray_900 font-weight-bold">
              {{
                customerStatus === 'retail'
                  ? formatRupiah(item?.retailPrice)
                  : customerStatus === 'wholesaler'
                  ? formatRupiah(item?.wholesalerPrice)
                  : ''
              }}
            </span>
          </div>
        </div>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
import { formatRupiah } from '~/utils/formatRupiah'

export default {
  name: 'Product',
  props: {
    item: { type: Object, default: () => {} },
    loading: {
      type: Boolean,
      default: false,
    },
    customerStatus: {
      type: String,
      default: '',
    },
  },
  emits: ['handleClick'],
  data() {
    return {
      favorite: 'false',
    }
  },
  computed: {
    //get windows size height
    windowWidth() {
      return window.innerHeight
    },
    widthScreen() {
      return this.$vuetify.display.xs
    },
  },
  methods: {
    formatRupiah(item) {
      return formatRupiah(item)
    },
  },
}
</script>

<script setup>
const { $changeImageSize } = useNuxtApp()
</script>

<style lang="scss" scoped>
:deep(.v-btn:not(.v-btn--icon)) {
  border-radius: 8px !important;
}

.card {
  border: 1px solid #eaecf0;
  height: 100%;

  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px !important;
  .img {
    border-radius: 8px;
  }
}

:deep(.v-list-item) {
  padding: 0;
}

.text-title {
  max-height: 60px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px !important;

  @supports (-webkit-line-clamp: 2) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
}
</style>
