<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <v-list
        width="100%"
        class="py-0 ml-2 d-flex flex-column justify-center align-center"
      >
        <v-list-item-group
          class="d-flex align-center"
          style="gap: 8px; width: 100%; max-width: 800px"
        >
          <Search v-model="search" @input="handleSearch($event)" />
          <v-btn
            color="gray_500"
            outlined
            height="44"
            dense
            style="background-color: #fff"
            @click="modalPrice = true"
          >
            <v-icon size="15">$money</v-icon>
            <span v-if="price === 'wholesalerPrice'" class="ml-2"> Sales </span>
            <span v-else-if="price === 'retailPrice'" class="ml-2">
              Retail
            </span>
          </v-btn>
        </v-list-item-group>
      </v-list></v-row
    >
    <v-row v-if="datas?.length && !loading" class="px-6 pt-4">
      <v-col
        v-for="item in datas"
        :key="item?.id"
        class="pa-1"
        :cols="cardPerPage($vuetify.breakpoint)"
      >
        <Product
          :item="item"
          :loading="loadingSelected"
          :customer-status="price"
          @handleClick="handleClickSelect($event)"
        />
      </v-col>
    </v-row>
    <v-row v-else-if="!datas?.length && !loading" style="height: 90%">
      <v-col align-self="center" style="height: 100%">
        <Empty />
      </v-col>
    </v-row>
    <v-row v-else-if="loading" style="height: 90%">
      <v-col
        align-self="center"
        style="height: 100%"
        class="d-flex align-center justify-center"
      >
        <Loading />
      </v-col>
    </v-row>
    <Modal
      title="Who's your Customer?"
      subtitle="Select Sales or Retail"
      :modal-prop="modalPrice"
      :error-message="''"
    >
      <template #action>
        <v-col class="px-0 pr-1">
          <v-btn
            block
            outlined
            height="44"
            depressed
            dense
            @click="handleClickSales"
          >
            Sales
          </v-btn>
        </v-col>
        <v-col class="px-0 pl-1">
          <v-btn
            block
            depressed
            height="44"
            color="primary"
            @click="handleClickRetail"
          >
            Retail
          </v-btn>
        </v-col>
      </template>
    </Modal>
    <!-- Cart -->
    <Cart
      title="Cart"
      subtitle="Add product to cart to checkout"
      :customer-status="price"
      :modal-prop="modalCart"
      :error-message="''"
      :datas="cart"
      @cancel="modalCart = false"
    />
  </v-container>
</template>

<script>
import Empty from '~/components/Layout/Empty.vue'
import Loading from '~/components/Layout/Loading'
import Search from '~/components/Input/Search.vue'
import Product from '~/components/Card/Product.vue'
import Modal from '~/components/Dialog/Modal.vue'
import Cart from '~/components/Dialog/Cart.vue'

export default {
  name: 'IndexPage',
  components: { Product, Search, Empty, Modal, Loading, Cart },
  layout: 'dashboard',
  data() {
    return {
      loadingSelected: false,
      search: '',
      price: '',
      modalPrice: true,
      loading: false,
    }
  },
  computed: {
    datas() {
      return this.$store.get('product/product')
    },
    cart() {
      return this.$store.get('order/cart')
    },
    modalCart: {
      get() {
        return this.$store.get('order/modalCart')
      },
      set(event) {
        this.$store.set('order/modalCart', event)
      },
    },
  },
  mounted() {
    this.loginSuccess()
    this.getProduct()
  },
  methods: {
    async loginSuccess() {
      this.loading = true
      const res = await this.$store.dispatch('user/getMe')
      if (res) {
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async getProduct() {
      this.loading = true
      const params = {
        q: this.search,
        category: this.category,
        page: 1,
        limit: 24,
      }
      const res = await this.$store.dispatch('product/getProduct', params)
      if (res) {
        this.loading = false
      } else {
        this.loading = false
      }
    },
    cardPerPage(vss) {
      switch (true) {
        case vss.xs:
          return '6'
        case vss.sm:
          return '4'
        case vss.md:
          return '3'
        case vss.lg:
          return '2'
        default:
          return '2'
      }
    },
    handleSearch() {
      this.getProduct()
    },
    handleClickSales() {
      this.price = 'wholesalerPrice'
      this.modalPrice = false
    },
    handleClickRetail() {
      this.price = 'retailPrice'
      this.modalPrice = false
    },
    handleClickSelect(item) {
      const payload = {
        ...item,
        qty: 1,
      }
      this.$store.dispatch('order/addCart', payload)
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.theme--light.v-list) {
  background: transparent;
}
</style>
