<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text"> Orders </span>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
        Lihat orderan yang masuk
      </span>
    </v-row>
    <v-row class="px-6 pt-4">
      <!-- <Search
        v-model="params.q"
        style="max-width: 400px"
        @input="handleSearch($event)"
      /> -->
    </v-row>
    <v-row class="px-6 pt-4">
      <v-data-table
        :headers="headers"
        :items="datas"
        :loading="loading.data"
        :items-per-page="paginator?.perPage"
        hide-default-footer
        no-data-text="No Data"
        class="data-table"
      >
        <template #[`item._id`]="index">
          <span>{{ index?.index + 1 }}</span>
        </template>
        <template #[`item.user.status`]="item">
          <span>{{
            item?.item?.user?.status == 'retail'
              ? 'Retail'
              : item?.item?.user?.status == 'wholesaler'
              ? 'Sales'
              : '-'
          }}</span>
        </template>
        <template #[`item.total`]="item">
          <span>{{ formatRupiah(item?.item?.total) }}</span>
        </template>

        <template #[`item.createdAt`]="item">
          <span>
            {{ $moment(item?.item?.createdAt).format('DD MMM YYYY') }}
          </span>
        </template>
        <template #[`item.details.length`]="item">
          <div>
            <v-btn
              outlined
              depressed
              small
              @click="openDetailProductModal(item?.item)"
            >
              {{ item?.item?.details?.length + ' Produk' }}
            </v-btn>
          </div>
        </template>
        <template #footer>
          <div class="d-flex align-center text-14 my-4 mx-4">
            <span class="gray_700--text font-weight-medium">
              {{ 'Halaman ' + params.page + ' dari ' + paginator?.totalPages }}
            </span>

            <v-spacer></v-spacer>
            <v-btn
              outlined
              height="36"
              depressed
              dense
              :disabled="!paginator.hasPrevPage"
              @click="params.page--"
              >Sebelumnya</v-btn
            >
            <v-btn
              class="ml-2"
              outlined
              height="36"
              depressed
              dense
              :disabled="!paginator.hasNextPage"
              @click="params.page++"
              >Selanjutnya</v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-row>
    <Modal
      v-model="modal.product"
      error-message=""
      title="Detail Produk"
      subtitle="Detail produk yang di pesan"
    >
      <template #content>
        <v-list>
          <v-list-item
            v-for="item in detailsProduct"
            :key="item?._id"
            class="border mb-2"
          >
            <v-list-item-avatar height="50" width="50" class="border-radius-8">
              <v-img lazy-src="lazy-loader.svg" :src="item?.product?.image" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-medium letter-spacing-normal"
              >
                {{ item?.product?.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text
                class="font-weight-bold text-14 gray_900--text"
              >
                {{ formatRupiah(item?.price) }}
              </v-list-item-action-text>
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
                  formatRupiah(detailsProduct.reduce((a, c) => a + c.price, 0))
                }}
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
    </Modal>
  </v-container>
</template>

<script>
import Modal from '~/components/Dialog/Modal.vue'
import { formatRupiah } from '~/utils/formatRupiah'

export default {
  name: 'Customers',
  components: { Modal },
  layout: 'dashboard',
  data() {
    return {
      modal: {
        product: false,
      },
      detailsProduct: [],
      loading: {
        delete: false,
        add: false,
        edit: false,
        data: false,
      },
      params: {
        q: '',
        page: 1,
        limit: 25,
      },
      headers: [
        {
          text: 'No.',
          value: '_id',
        },
        {
          text: 'ID Order',
          value: 'orderId',
        },
        {
          text: 'Nama',
          value: 'user.name',
        },
        { text: 'Total Order', value: 'details.length' },
        { text: 'Total Harga', value: 'total' },
        { text: 'Status', value: 'user.status' },
        { text: 'Tanggal', value: 'createdAt' },
      ],
    }
  },
  head() {
    return {
      title: 'Gendut Grosir | Category',
    }
  },
  computed: {
    datas() {
      return this.$store.get('order/order')
    },
    paginator() {
      return this.$store.get('order/paginator')
    },
    errorMessage() {
      return this.$store.get('order/errorMessage')
    },
  },
  watch: {
    page() {
      this.getOrder()
    },
  },
  mounted() {
    this.getOrder()
  },
  methods: {
    async handleSearch() {
      await this.getAllUser()
    },
    async getOrder() {
      this.loading.data = true

      const res = await this.$store.dispatch('order/getOrder', this.params)
      if (res) {
        this.loading.data = false
      } else {
        this.loading.data = false
      }
    },
    formatRupiah(item) {
      return formatRupiah(item)
    },
    openDetailProductModal(item) {
      this.modal.product = true
      this.detailsProduct = item?.details
      console.log(this.detailsProduct)
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;
.input-image {
  border-radius: 8px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  color: v.$gray_500;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  background: v.$gray_100;
  width: 40px;
  height: 40px;
  border: 8px solid v.$gray_50;
}
.clear-image {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
}
.border {
  border: 1px solid v.$primary_300;
  border-radius: 8px !important;
}
</style>
