<template>
  <v-container
    fluid
    class="full-width-height bg-gray_100 d-flex flex-column align-center justify-start"
  >
    <transition name="fade">
      <Snackbar
        v-if="successAddCart"
        width="330px"
        position="fixed"
        text="Sukses menambahkan ke keranjang"
        :visibility="true"
        @set="successAddCart = false"
      />
    </transition>
    <transition name="fade">
      <Snackbar
        v-if="cartErrorMessage"
        color="error"
        position="fixed"
        width="330px"
        :visibility="true"
        :text="cartErrorMessage"
        @set="clearOrderError"
      />
    </transition>
    <v-row
      class="pt-4"
      style="width: 100%; max-width: 960px; height: fit-content; flex-grow: 0"
    >
        <div
          class="d-flex align-center flex-wrap"
          style="gap: 8px; width: 100%"
        >
          <Search
            v-model="params.q"
            @update:model-value="handleSearch"
          />

          <v-btn
            :loading="loading.loadingUsers"
            @click="handleClickUsers"
          >
            <v-icon size="15">$customers</v-icon>
            <span v-if="!customer?.name" class="ml-2"> Pilih Pelanggan </span>
            <span v-else class="ml-2"> {{ customer?.name }} </span>
          </v-btn>
          <!-- <v-btn
            :class="{
              'flex-grow-0': smAndUp,
              'flex-grow-1': xs,
            }"
            disabled
          >
            {{
              formatCustomerStatus(
                customer?.status ? customer?.status : profile?.status
              )
            }}
          </v-btn> -->
        </div>
    </v-row>

    <v-row
      v-if="datas?.length && !loading.loadingProduct"
      class="pt-4 py-6 align-self-center"
      justify="left"
      style="width: 100%; max-width: 960px; flex-grow: 0"
    >
      <v-col
        v-for="item in datas"
        :key="item?.id"
        :cols="cardPerPage()"
        style="height: 280px"
      >
        <Product
          :item="item"
          :loading="loading.loadingSelected"
          :customer-status="
            customer?.status ? customer?.status : profile?.status
          "
          @handleClick="handleClickSelect($event)"
        />
      </v-col>

      <div
        v-if="paginator.hasNextPage"
        v-intersect.quiet="productOnIntersect"
        class="pa-4 text-primary"
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
      v-model="modal.customer"
      title="Siapa Pelanggan Anda?"
      subtitle="Pilih salah satu pelanggan Anda"
      :error-message="''"
      min-height="642"
      :fullscreen="xs"
      icon="$customers"
    >
      <template #content>
        <Search
          v-model="paramsUser.q"
          class="my-2"
          @update:model-value="handleUserSearch"
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
          <v-list-item
            v-for="item in users"
            :id="`scroll-${item?._id}`"
            :key="item?._id"
            :value="item"
            :active="selectedUser?._id === item?._id"
            active-class=" border-active "
            class="border mb-2"
            @click="selectedUser = item"
          >
            <template #prepend>
              <v-avatar size="50">
                <v-img lazy-src="/lazy-loader.svg" :src="item?.profilePicture" />
              </v-avatar>
            </template>
            <v-list-item-title
              class="font-weight-medium letter-spacing-normal"
            >
              {{ item?.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ formatCustomerStatus(item?.status) }}
            </v-list-item-subtitle>
          </v-list-item>
          <div
            v-if="userPaginator.nextPage"
            v-intersect.quiet="onIntersect"
            class="pa-4 text-primary"
          >
            Sedang memuat ...
          </div>
        </v-list>

        <Empty
          v-else
          img="/family.svg"
          title="Pelanggan tidak ditemukan"
          description="Tambahkan pelanggan terlebih dahulu."
          padding="px-0 py-4"
          gap-bottom="mb-0"
          max-height-image="200"
          max-width-image="300"
        />
      </template>
      <template #action>
        <v-col class="px-0 pr-1">
          <v-btn
            block
            variant="outlined"
            height="44"
            density="compact"
            @click="handleClickCancel"
          >
            Batal
          </v-btn>
        </v-col>
        <v-col class="px-0 pl-1">
          <v-btn
            block
            variant="flat"
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
    <Cart
      v-model="modalCart"
      :customer="customer"
      @successCheckout="handleModalSumary(true)"
    />
    <!-- Sumary Modal -->
    <Modal
      v-model="modal.sumary"
      icon="$success_600"
      type="oke"
      title="Order Sukses"
      subtitle="Berikut adalah detail order Anda."
      save-text="Print Invoice"
      cancel-text="Tutup"
      :fullscreen="xs"
      :loading="loading.downloadInvoice"
      @save="downloadInvoice"
    >
      <template v-if="detailsProduct" #content>
        <v-list>
          <v-list-item
            v-for="item in detailsProduct?.details"
            :key="item?._id"
            class="border mb-2"
          >
            <template #prepend>
              <v-avatar size="50" class="border-radius-8">
                <v-img lazy-src="/lazy-loader.svg" :src="item?.product?.image" />
              </v-avatar>
            </template>
            <v-list-item-title
              class="font-weight-medium letter-spacing-normal"
            >
              {{ item?.product?.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ 'Jumlah : ' + item?.qty }}
            </v-list-item-subtitle>
            <template #append>
              <span
                class="font-weight-bold text-14 text-gray_900"
              >
                {{ formatRupiah(item?.price) }}
              </span>
            </template>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item class="border">
            <v-list-item-title class="font-weight-bold text-14">
              Total
            </v-list-item-title>
            <template #append>
              <span
                class="font-weight-bold text-14 text-gray_900"
              >
                {{ formatRupiah(detailsProduct.total) }}
              </span>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </Modal>
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
import Snackbar from '~/components/Snackbar/Snackbar.vue'
import { formatRupiah } from '~/utils/formatRupiah'
import { useProductStore } from '~/stores/product'
import { useUserStore } from '~/stores/user'
import { useOrderStore } from '~/stores/order'

export default {
  name: 'HomePage',
  components: { Product, Search, Empty, Modal, Loading, Cart, Snackbar },
  data() {
    return {
      successAddCart: false,
      price: '',
      modal: {
        customer: false,
        sumary: false,
      },
      selectedUser: {},
      loading: {
        loadingSelected: false,
        loadingProduct: false,
        loadingUsers: false,
        searchUser: false,
        downloadInvoice: false,
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
      paramsDownloadInvoice: {
        orderId: '',
      },
    }
  },
  computed: {
    datas() {
      return useProductStore().product
    },
    modalCart: {
      get() {
        return useOrderStore().modalCart
      },
      set(event) {
        useOrderStore().modalCart = event
      },
    },
    users() {
      return useUserStore().user
    },
    profile() {
      return useUserStore().profile
    },
    userPaginator() {
      return useUserStore().paginator
    },
    customer() {
      return useUserStore().selectedUser
    },
    paginator() {
      return useProductStore().paginator
    },
    detailsProduct() {
      return useOrderStore().detailOrder
    },
    cartErrorMessage() {
      return useOrderStore().errorMessage
    },
  },
  mounted() {
    this.loginSuccess()
    // this.$axios.get('/api2/test')
  },

  methods: {
    clearOrderError() {
      useOrderStore().errorMessage = ''
    },
    // First render
    loginSuccess() {
      this.loading.loadingProduct = true
      Promise.all([useProductStore().getProduct(this.params)])
        .then(() => {
          this.loading.loadingProduct = false
        })
        .catch(() => {
          this.loading.loadingProduct = false
        })
    },
    // Get Product
    async getProduct() {
      this.loading.loadingProduct = true

      const res = await useProductStore().getProduct(this.params)
      if (res) {
        this.loading.loadingProduct = false
      } else {
        this.loading.loadingProduct = false
      }
    },
    // card per page
    // NOTE: use this.$vuetify.display.* here (not the useDisplay() setup
    // bindings): setup bindings are not reachable via `this` in Options
    // methods, while $vuetify.display refs are unwrapped booleans.
    cardPerPage() {
      const display = this.$vuetify.display
      switch (true) {
        case display.xs:
          return '6'
        case display.sm:
          return '4'
        case display.md:
          return '3'
        case display.lg:
          return '3'
        default:
          return '3'
      }
    },
    // Handle search product
    handleSearch() {
      this.getProduct()
    },
    // Handle button cancel on customer Modal
    handleClickCancel() {
      useUserStore().user = []
      this.paramsUser = {
        q: '',
        category: '',
        page: 1,
        limit: 8,
      }
      this.modal.customer = false
    },
    // Select user on Customer modal
    handleClickSelectUser() {
      useUserStore().selectedUser = this.selectedUser
      useUserStore().user = []

      this.paramsUser = {
        q: '',
        category: '',
        page: 1,
        limit: 8,
      }
      this.modal.customer = false
    },
    // Click product and add to chart
    handleClickSelect(item) {
      const payload = {
        ...item,
        qty: 1,
      }
      useOrderStore().addCart(payload)
      if (!this.cartErrorMessage) {
        this.successAddCart = true
      }
      setTimeout(() => {
        /**
         * Close the Snackbar.
         */
        this.successAddCart = false
      }, 3000)
    },
    // Get Data User
    async getAllUser() {
      this.loading.loadingUsers = true
      const res = await useUserStore().getAllUser2(this.paramsUser)
      if (res) {
        this.loading.loadingUsers = false
      } else {
        this.loading.loadingUsers = false
      }
    },
    // Open Modal Customers
    async handleClickUsers() {
      await this.getAllUser()
      this.modal.customer = true
    },
    // Search User function
    async handleUserSearch() {
      this.paramsUser.page = 1
      this.loading.searchUser = true
      await useUserStore().getAllUser(this.paramsUser)
      this.loading.searchUser = false
    },
    // When User intersect
    onIntersect: debounce(async function () {
      this.paramsUser.page++
      await this.getAllUser()
    }, 500),
    // When Product intersect
    productOnIntersect: debounce(async function () {
      this.params.page++
      await this.getProductIntersect()
    }, 500),
    // Get Product when intersect
    async getProductIntersect() {
      await useProductStore().getProductIntersect(this.params)
    },
    handleModalSumary(val) {
      this.modal.sumary = val
    },
    async downloadInvoice() {
      this.loading.downloadInvoice = true
      this.paramsDownloadInvoice.orderId = this.detailsProduct.orderId
      await useOrderStore().downloadInvoice(this.paramsDownloadInvoice)
      this.loading.downloadInvoice = false
    },
    formatRupiah(item) {
      return formatRupiah(item)
    },
    formatCustomerStatus(item) {
      return item === 'wholesaler' ? 'Sales' : item === 'retail' ? 'Retail' : ''
    },
  },
}
</script>

<script setup>
import { useDisplay } from 'vuetify'

definePageMeta({ layout: 'dashboard' })

const { xs, smAndUp } = useDisplay()
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
// Component <transition>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
