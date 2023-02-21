<template>
  <Modal
    v-model="model"
    title="Cart"
    subtitle="Add product to cart to checkout"
    :error-message="$store.get('order/errorMessage')"
    icon="$cart"
    min-height="542"
    save-text="Beli"
    :loading="loading?.loadingCheckout"
    @save="handleCheckout"
  >
    <template #content>
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
                {{
                  customer?.status === 'retail'
                    ? formatRupiah(datas.reduce((a, c) => a + c.retailPrice, 0))
                    : formatRupiah(
                        datas.reduce((a, c) => a + c.wholesalerPrice, 0)
                      )
                }}
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
      <Empty
        v-else
        img="/girl-shop.svg"
        title="Cart is Empty"
        description="Please add Product to cart first!"
        padding="px-0 pt-2"
        gap-bottom="mb-0"
      />
    </template>
  </Modal>
</template>

<script>
import { formatRupiah } from '~/utils/formatRupiah'
import Empty from '../Layout/Empty.vue'
import Modal from './Modal.vue'

export default {
  name: 'Cart',
  components: { Empty, Modal },
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
  },
  methods: {
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
</style>
