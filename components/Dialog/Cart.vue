<template>
  <Modal
    v-model="model"
    title="Keranjang"
    subtitle="Tambahkan produk untuk membeli"
    :error-message="orderErrorMessage"
    icon="$cart"
    min-height="542"
    save-text="Beli"
    :disable="!datas.length"
    :loading="loading?.loadingCheckout || loading?.barcode"
    :fullscreen="$vuetify.display.xs"
    @save="handleCheckout"
    @clearErrorMessage="clearOrderError"
  >
    <template #content>
      <Barcode
        ref="barcode"
        v-model="barcode"
        class="mt-2"
        label="Barcode"
        placeholder="Tambahkan dengan barcode"
        :loading="loading.barcode"
        :error-message="errorMessage.barcode"
        @handleBarcodeinput="handleBarcodeinput"
      />
      <template v-if="datas.length">
        <v-list lines="two">
          <v-list-item
            v-for="item in datas"
            :key="item?._id"
            class="border mb-2"
          >
            <template #prepend>
              <v-avatar height="50" width="50" style="border-radius: 8px">
                <v-img
                  lazy-src="/lazy-loader.svg"
                  :src="$changeImageSize(item?.image, 'xs')"
                ></v-img>
              </v-avatar>
            </template>

            <v-list-item-title
              class="text-gray_900 text-16 font-weight-medium mb-2"
              >{{ item?.name }}</v-list-item-title
            >
            <div class="action">
              <v-btn
                size="small"
                icon
                variant="outlined"
                color="primary_300"
                @click="handleMinus(item?._id)"
              >
                <v-icon class="qty" size="15">mdi-minus</v-icon>
              </v-btn>

              <span class="font-weight-bold mx-2 text-16">{{ item?.qty }}</span>

              <v-btn
                size="small"
                icon
                variant="outlined"
                color="primary_300"
                @click="handlePlus(item?._id)"
              >
                <v-icon class="qty" size="15">mdi-plus</v-icon>
              </v-btn>
            </div>
            <template #append>
              <v-btn
                variant="text"
                size="small"
                icon
                @click="handleDelete(item?._id)"
              >
                <v-icon size="15">$trash</v-icon>
              </v-btn>
              <v-list-item-title class="font-weight-bold text-14">
                {{
                  customer?.status === 'retail'
                    ? formatRupiah(item?.retailPrice)
                    : formatRupiah(item?.wholesalerPrice)
                }}
              </v-list-item-title>
            </template>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item class="border">
            <v-list-item-title class="font-weight-bold text-14">
              Total
            </v-list-item-title>
            <template #append>
              <span class="font-weight-bold text-14 text-gray_900">
                {{ customer?.status === 'retail' ? totalRetail : totalSales }}
              </span>
            </template>
          </v-list-item>
        </v-list>
      </template>
      <Empty
        v-else
        img="/girl-shop.svg"
        title="Keranjang Kosong"
        description="Tambahkan produk terlebih dahulu!"
        gap-bottom="mb-0"
      />
    </template>
  </Modal>
</template>

<script>
import debounce from 'lodash/debounce'
import directive from '~/utils/directive'
import replaceChar from '~/utils/mixins/replaceChar'
import { formatRupiah } from '~/utils/formatRupiah'
import { useOrderStore } from '~/stores/order'
import { useProductStore } from '~/stores/product'
import Empty from '../Layout/Empty.vue'
import Modal from './Modal.vue'
import Barcode from '~/components/Input/Barcode.vue'

export default {
  name: 'Cart',
  components: { Empty, Modal, Barcode },
  mixins: [directive, replaceChar],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    customer: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['update:model-value', 'successCheckout'],
  data() {
    return {
      params: {
        user: '',
        details: [],
        total: null,
      },
      loading: {
        loadingCheckout: false,
        barcode: false,
      },
      barcode: null,
      errorMessage: {
        barcode: '',
      },
    }
  },
  computed: {
    model: {
      get: function () {
        return this.modelValue
      },
      set: function (newValue) {
        this.$emit('update:model-value', newValue)
      },
    },
    datas: {
      get() {
        return useOrderStore().cart
      },
      set(newValue) {
        useOrderStore().setCart(newValue)
      },
    },
    detailOrder() {
      return useOrderStore().detailOrder
    },
    orderErrorMessage() {
      return useOrderStore().errorMessage
    },
    totalRetail() {
      const tmp = this.datas.map((item) => {
        return item.qty * item.retailPrice
      })
      const total = tmp.reduce((a, c) => a + c, 0)
      return this.formatRupiah(total)
    },
    totalSales() {
      const tmp = this.datas.map((item) => {
        return item.qty * item.wholesalerPrice
      })
      const total = tmp.reduce((a, c) => a + c, 0)
      return this.formatRupiah(total)
    },
  },
  watch: {
    model(val) {
      if (val) {
        this.focusBarcode()
      }
    },
  },
  methods: {
    clearOrderError() {
      useOrderStore().errorMessage = ''
    },
    async focusBarcode() {
      await this.$nextTick()
      this.$refs.barcode.$refs.barcode.focus()
    },
    formatRupiah(item) {
      return formatRupiah(item)
    },
    handlePlus(id) {
      useOrderStore().plus(id)
    },
    handleMinus(id) {
      useOrderStore().minus(id)
    },
    handleDelete(id) {
      useOrderStore().delete(id)
    },
    async handleCheckout() {
      this.loading.loadingCheckout = true
      const details = this.datas.map((item) => ({
        product: item?._id,
        qty: item?.qty,
        buyPrice: item?.buyPrice,
        price:
          this.customer?.status === 'retail'
            ? item?.retailPrice
            : item?.wholesalerPrice,
      }))
      this.params = {
        user: this.customer?._id || '',
        details,
      }
      const res = await useOrderStore().postOrder(this.params)
      if (res) {
        this.datas = []
        // const
        useProductStore().orderSuccess(this.detailOrder?.details)
        this.loading.loadingCheckout = false
        this.model = false
        this.$emit('successCheckout')
      } else {
        this.loading.loadingCheckout = false
      }
    },
    handleBarcodeinput: debounce(async function () {
      this.loading.barcode = true
      this.barcode = this.onlyNumber(this.barcode)
      const res = await useProductStore().getProductByBarcode(this.barcode)
      const product = useProductStore().productDetails

      // if success get product
      if (res) {
        this.errorMessage.barcode = ''
        const payload = {
          ...product,
          qty: 1,
        }
        useOrderStore().addCart(payload)
        this.successAddCart = true
        this.barcode = null
      } else {
        this.errorMessage.barcode = useProductStore().errorMessage
      }
      this.loading.barcode = false
    }, 500),
    handleClickSelect(item) {
      const payload = {
        ...item,
        qty: 1,
      }
      useOrderStore().addCart(payload)
      this.successAddCart = true
      setTimeout(() => {
        /**
         * Close the Snackbar.
         */
        this.successAddCart = false
      }, 3000)
    },
  },
}
</script>

<script setup>
const { $changeImageSize } = useNuxtApp()
</script>

<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  background: v.$primary_100;
  width: 58px;
  height: 58px;
  border: 8px solid v.$primary_50;
}
.border {
  border: 1px solid v.$primary_300;
  border-radius: 8px !important;
}
:deep(.action .v-btn) {
  min-width: unset !important;
  min-height: unset !important;
  height: unset !important;
  width: unset !important;
}
:deep(.v-label.v-label--active) {
  background: #fff;
  padding: 0 5px;
}
</style>
