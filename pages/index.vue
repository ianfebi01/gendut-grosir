<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-1 pt-4">
      <v-col
        v-for="item in datas"
        :key="item?.id"
        class="pa-1"
        :cols="cardPerPage($vuetify.breakpoint)"
      >
        <Product
          :item="item"
          :loading="loadingSelected"
          customer-status="retailPrice"
          @handleClick="handleClickSelect($event)"
          @handleClickFavorite="handleClickFavorite($event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Product from '~/components/Card/Product.vue'

export default {
  name: 'IndexPage',
  components: { Product },
  layout: 'dashboard',
  data() {
    return {
      loadingSelected: false,
    }
  },
  computed: {
    datas() {
      return this.$store.get('product/product')
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
  },
}
</script>
