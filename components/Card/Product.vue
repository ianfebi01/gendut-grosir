<template>
  <v-card
    class="pa-3 card-collumn-barista-card"
    text
    outlined
    height="auto"
    :loading="loading === item?.id"
    :disabled="loading === item?.id"
    @click="$emit('handleClick', item.id)"
  >
    <template #progress>
      <v-progress-circular
        indeterminate
        size="35"
        color="primary"
        class="loader"
      ></v-progress-circular>
    </template>
    <v-container class="pa-0">
      <v-img
        lazy-src="lazy-loader.svg"
        src="https://res.cloudinary.com/djyp9rr7s/image/upload/v1671439956/Pngtree_no_image_vector_illustration_isolated_4979075_ncvayj.png"
        height="150px"
        width="100%"
        class="img"
      >
        <v-card-actions class="d-flex justify-end">
          <v-btn
            fab
            small
            active-class="color:primary !important"
            class="pa-2"
            depressed
            :style="{
              color: favorite ? 'white !important' : '#F9F9F8',
            }"
            @click="$emit('handleClickFavorite', item?.id)"
          >
            <v-icon v-if="!item?.favorited" color="primary">
              mdi-heart-outline
            </v-icon>
            <v-icon v-else color="red">mdi-heart</v-icon>
          </v-btn>
        </v-card-actions>
      </v-img>

      <v-list-item-title
        class="text-title mt-2 font-weight-bold text-body-2 px-0 green-darken-1--text"
      >
        {{ item?.name }}
      </v-list-item-title>

      <v-card-actions class="px-0 text-body-2">
        <div
          style="width: 100%"
          class="px-0 d-flex align-center justify-space-between card-collumn-barista-btn"
        >
          <div class="d-flex flex-column justify-center">
            <span class="text-secondary text-subtitle-2">Price:</span>
            <span class="black--text font-weight-bold">
              {{
                customerStatus === 'retailPrice'
                  ? formatRupiah(item?.retailPrice)
                  : formatRupiah(item?.wholesalerPrice)
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
  name: 'CardColumnBarista',
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
  data() {
    return {
      favorite: 'false',
    }
  },
  computed: {
    //get value to activate order details components
    activator() {
      return this.$store.get('order/order_activator')
    },
    //get value to daily dose counter
    dailyDose() {
      return this.$store.get('barista.user/current_portion')
    },
    //get windows size height
    windowWidth() {
      return window.innerHeight
    },
    widthScreen() {
      return this.$vuetify.breakpoint.xs
    },
  },
  methods: {
    formatRupiah(item) {
      return formatRupiah(item)
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.v-btn:not(.v-btn--fab)) {
  border-radius: 8px !important;
}

.card-collumn-barista-card {
  border: 1px solid #d0d5dd !important;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05) !important;
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
  margin-right: 10px;
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
