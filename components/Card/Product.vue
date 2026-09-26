<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        v-bind="props"
        variant="flat"
        style="overflow: hidden; transition: all 150ms"
        class="border h-100"
        :style="!isHovering && 'border-color: transparent'"
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
            cover
          />

          <v-card-title
            class="text-title mt-2 letter-spacing-normal text-18 text-gray_900 px-3"
            style="width: 100%"
          >
            {{ item?.name }}
          </v-card-title>
          <div class="flex-grow-1"></div>
          <v-card-actions class="px-0 text-body-2 mx-3">
            <div
              style="width: 100%"
              class="px-0 d-flex align-center justify-space-between"
            >
              <div class="d-flex flex-column justify-center">
                <span class="font-weight-bold text-20 text-primary">
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
    </template></v-hover
  >
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
.text-title {
  max-height: 60px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

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
