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
          <Search v-model="params.q" @input="handleSearch($event)" />
          <v-btn
            color="gray_500"
            outlined
            height="44"
            dense
            style="background-color: #fff"
            :loading="loading.loadingUsers"
            @click="handleClickUsers"
          >
            <v-icon size="15">$customers</v-icon>
            <span v-if="!customer?.name" class="ml-2"> Pilih Pelanggan </span>
            <span v-else class="ml-2"> {{ customer?.name }} </span>
          </v-btn>
        </v-list-item-group>
      </v-list></v-row
    >
    <v-row
      v-if="datas?.length && !loading.loadingProduct"
      class="px-6 pt-4"
      justify="center"
    >
      <v-col
        v-for="item in datas"
        :key="item?.id"
        class="pa-1"
        :cols="cardPerPage($vuetify.breakpoint)"
      >
        <Product
          :item="item"
          :loading="loading.loadingSelected"
          :customer-status="customer?.status"
          @handleClick="handleClickSelect($event)"
        />
      </v-col>
      <div
        v-if="paginator.hasNextPage"
        v-intersect.quiet="productOnIntersect"
        class="pa-4 primary--text"
      >
        Sedang memuat ...
      </div>
    </v-row>
    <v-row
      v-else-if="!datas?.length && !loading.loadingProduct"
      style="height: 90%"
    >
      <v-col align-self="center" style="height: 100%">
        <Empty />
      </v-col>
    </v-row>
    <v-row v-else-if="loading.loadingProduct" style="height: 90%">
      <v-col
        align-self="center"
        style="height: 100%"
        class="d-flex align-center justify-center"
      >
        <Loading />
      </v-col>
    </v-row>
    <!-- Customer -->
    <Modal
      v-model="modalCustomer"
      title="Siapa Pelanggan Anda?"
      subtitle="Pilih salah satu pelanggan Anda"
      :error-message="''"
      min-height="642"
      icon="$customers"
    >
      <template #content>
        <Search
          v-model="paramsUser.q"
          class="my-2"
          @input="handleUserSearch($event)"
        />
        <v-list v-if="loading.searchUser">
          <v-skeleton-loader
            v-for="item in 5"
            :key="item"
            type="list-item-avatar"
            class="border mb-2 py-2"
          ></v-skeleton-loader>
        </v-list>
        <v-list v-else-if="users?.length && !loading.searchUser">
          <v-list-item-group v-model="selectedUser">
            <v-list-item
              v-for="item in users"
              :id="`scroll-${item?._id}`"
              :key="item?._id"
              :value="item"
              active-class=" border-active "
              class="border mb-2"
            >
              <v-list-item-avatar height="50" width="50">
                <v-img lazy-src="lazy-loader.svg" :src="item?.profilePicture" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-medium letter-spacing-normal"
                >
                  {{ item?.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item?.status === 'wholesaler' ? 'Sales' : 'Retail' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <div
              v-if="userPaginator.hasNextPage"
              v-intersect.quiet="onIntersect"
              class="pa-4 primary--text"
            >
              Sedang memuat ...
            </div>
          </v-list-item-group>
        </v-list>
        <Empty
          v-else
          img="/girl-shop.svg"
          title="Cart is Empty"
          description="Please add Product to cart first!"
          padding="px-0"
          gap-bottom="mb-0"
          max-height-image="200"
        />
      </template>
      <template #action>
        <v-col class="px-0 pr-1">
          <v-btn
            block
            outlined
            height="44"
            depressed
            dense
            @click="handleClickCancel"
          >
            Batal
          </v-btn>
        </v-col>
        <v-col class="px-0 pl-1">
          <v-btn
            block
            depressed
            height="44"
            color="primary"
            @click="handleClickSelectUser"
          >
            Pilih
          </v-btn>
        </v-col>
      </template>
    </Modal>
    <!-- Cart -->
    <Cart v-model="modalCart" :customer="customer" />
  </v-container>
</template>

<script>
import Empty from '~/components/Layout/Empty.vue'
import Loading from '~/components/Layout/Loading'
import Search from '~/components/Input/Search.vue'
import Product from '~/components/Card/Product.vue'
import Modal from '~/components/Dialog/Modal.vue'
import Cart from '~/components/Dialog/Cart.vue'
import debounce from 'lodash/debounce'

export default {
  name: 'IndexPage',
  components: { Product, Search, Empty, Modal, Loading, Cart },
  layout: 'dashboard',
  data() {
    return {
      search: '',
      price: '',
      modalCustomer: false,
      selectedUser: {},
      loading: {
        loadingSelected: false,
        loadingProduct: false,
        loadingUsers: false,
        searchUser: false,
      },
      params: {
        q: '',
        category: '',
        page: 1,
        limit: 24,
      },
      paramsUser: {
        q: '',
        category: '',
        page: 1,
        limit: 8,
      },
    }
  },
  computed: {
    datas() {
      return this.$store.get('product/product')
    },
    modalCart: {
      get() {
        return this.$store.get('order/modalCart')
      },
      set(event) {
        this.$store.set('order/modalCart', event)
      },
    },
    users() {
      return this.$store.get('user/user')
    },
    userPaginator() {
      return this.$store.get('user/paginator')
    },
    customer() {
      return this.$store.get('user/selectedUser')
    },
    paginator() {
      return this.$store.get('product/paginator')
    },
  },
  mounted() {
    this.loginSuccess()
  },
  methods: {
    loginSuccess() {
      this.loading.loadingProduct = true
      Promise.all([
        this.$store.dispatch('user/getMe'),
        this.$store.dispatch('product/getProduct', this.params),
      ])
        .then(() => {
          this.loading.loadingProduct = false
        })
        .catch(() => {
          this.loading.loadingProduct = false
        })
    },
    async getProduct() {
      this.loading.loadingProduct = true

      const res = await this.$store.dispatch('product/getProduct', this.params)
      if (res) {
        this.loading.loadingProduct = false
      } else {
        this.loading.loadingProduct = false
      }
    },
    async getProductIntersect() {
      await this.$store.dispatch('product/getProductIntersect', this.params)
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
    handleClickCancel() {
      this.$store.set('user/user', [])
      this.paramsUser = {
        q: '',
        category: '',
        page: 1,
        limit: 8,
      }
      this.modalCustomer = false
    },
    handleClickSelectUser() {
      this.$store.set('user/selectedUser', this.selectedUser)
      this.$store.set('user/user', [])

      this.paramsUser = {
        q: '',
        category: '',
        page: 1,
        limit: 8,
      }
      this.modalCustomer = false
    },
    handleClickSelect(item) {
      const payload = {
        ...item,
        qty: 1,
      }
      this.$store.dispatch('order/addCart', payload)
    },
    async getAllUser() {
      this.loading.loadingUsers = true
      const res = await this.$store.dispatch(
        'user/getAllUser2',
        this.paramsUser
      )
      if (res) {
        this.loading.loadingUsers = false
      } else {
        this.loading.loadingUsers = false
      }
    },
    async handleClickUsers() {
      await this.getAllUser()
      this.modalCustomer = true
    },
    async handleUserSearch() {
      this.paramsUser.page = 1
      this.loading.searchUser = true
      await this.$store.dispatch('user/getAllUser', this.paramsUser)
      this.loading.searchUser = false
    },
    onIntersect: debounce(async function () {
      this.paramsUser.page++
      console.log(this.paramsUser.page)
      await this.getAllUser()
    }, 500),
    productOnIntersect: debounce(async function () {
      this.params.page++
      await this.getProductIntersect()
    }, 500),
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;
:deep(.theme--light.v-list) {
  background: transparent;
}
:deep(.v-list-item--active::before) {
  border-radius: 8px;
  background-color: v.$primary_50;
}
</style>
