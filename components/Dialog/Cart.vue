<template>
  <Modal
    v-model="model"
    title="Keranjang"
    subtitle="Tambahkan produk untuk membeli"
    :error-message="$store.get('order/errorMessage')"
    icon="$cart"
    min-height="542"
    save-text="Beli"
    :disable="!datas.length"
    :loading="loading?.loadingCheckout || loading?.barcode"
    :fullscreen="$vuetify.breakpoint.xs"
    @save="handleCheckout"
    @clearErrorMessage="$store.set('order/errorMessage', '')"
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
        <v-list two-line>
          <v-list-item
            v-for="item in datas"
            :key="item?._id"
            class="border mb-2"
          >
            <v-list-item-avatar
              height="50"
              width="50"
              style="border-radius: 8px"
            >
              <v-img lazy-src="lazy-loader.svg" :src="item?.image"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="gray_900--text text-16 font-weight-medium mb-2"
                >{{ item?.name }}</v-list-item-title
              >
              <div class="action">
                <v-btn
                  small
                  fab
                  depressed
                  color="primary_300"
                  outlined
                  @click="handleMinus(item?._id)"
                >
                  <v-icon class="qty" size="15">mdi-minus</v-icon>
                </v-btn>

                <span class="font-weight-bold mx-2 text-16">{{
                  item?.qty
                }}</span>

                <v-btn
                  small
                  fab
                  depressed
                  color="primary_300"
                  outlined
                  @click="handlePlus(item?._id)"
                >
                  <v-icon class="qty" size="15">mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn depressed small fab text @click="handleDelete(item?._id)">
                <v-icon size="15">$trash</v-icon>
              </v-btn>
              <v-list-item-title class="font-weight-bold text-14">
                {{
                  customer?.status === 'retail'
                    ? formatRupiah(item?.retailPrice)
                    : formatRupiah(item?.wholesalerPrice)
                }}
              </v-list-item-title>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item class="border">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold text-14">
                Total
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text
                class="font-weight-bold text-14 gray_900--text"
              >
                {{ customer?.status === 'retail' ? totalRetail : totalSales }}
              </v-list-item-action-text>
            </v-list-item-action>
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
import Empty from '../Layout/Empty.vue'
import Modal from './Modal.vue'
import Barcode from '~/components/Input/Barcode.vue'

export default {
  name: 'Cart',
  components: { Empty, Modal, Barcode },
  mixins: [directive, replaceChar],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    customer: {
      type: Object,
      default: () => {},
    },
  },
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
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      },
    },
    datas: {
      get() {
        return this.$store.get('order/cart')
      },
      set(newValue) {
        this.$store.set('order/cart', newValue)
      },
    },
    detailOrder() {
      return this.$store.get('order/detailOrder')
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
    async focusBarcode() {
      await this.$nextTick()
      this.$refs.barcode.$refs.barcode.focus()
    },
    formatRupiah(item) {
      return formatRupiah(item)
    },
    handlePlus(id) {
      this.$store.dispatch('order/plus', id)
    },
    handleMinus(id) {
      this.$store.dispatch('order/minus', id)
    },
    handleDelete(id) {
      this.$store.dispatch('order/delete', id)
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
      const res = await this.$store.dispatch('order/postOrder', this.params)
      if (res) {
        this.datas = []
        // const
        this.$store.dispatch('product/orderSuccess', this.detailOrder?.details)
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
      const res = await this.$store.dispatch(
        'product/getProductByBarcode',
        this.barcode
      )
      const product = this.$store.get('product/productDetails')

      // if success get product
      if (res) {
        this.errorMessage.barcode = ''
        const payload = {
          ...product,
          qty: 1,
        }
        this.$store.dispatch('order/addCart', payload)
        this.successAddCart = true
        this.barcode = null
      } else {
        this.errorMessage.barcode = this.$store.get('product/errorMessage')
      }
      this.loading.barcode = false
    }, 500),
    handleClickSelect(item) {
      const payload = {
        ...item,
        qty: 1,
      }
      this.$store.dispatch('order/addCart', payload)
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
