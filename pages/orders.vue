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
      <Search
        v-model="params.q"
        placeholder="Cari Id Order"
        style="max-width: 400px"
        @input="handleSearch($event)"
      />
    </v-row>
    <v-row class="px-6 pt-4 pb-4">
      <v-data-table
        :headers="headers"
        :items="datas"
        :loading="loading.data"
        :items-per-page="paginator?.limit"
        hide-default-footer
        no-data-text="No Data"
        disable-sort
        class="data-table fixed-non-select-col"
      >
        <template #[`item._id`]="index">
          <span>
            {{ (paginator.page - 1) * paginator.limit + index.index + 1 }}
          </span>
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
            {{ $formatDate(item?.item?.date, 'with-clock') }}
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
        <template #[`item.status`]="item">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                depressed
                :color="statusOrderButtonColor(item)"
                :class="`'text-12 rounded-full ${statusOrderButtonTextColor(
                  item
                )}`"
                small
                width="80px"
                :loading="loading.status === item?.item?.orderId"
                :disabled="
                  loading.status !== '' ||
                  loading.cancelOrder !== '' ||
                  loading.downloadInvoice !== ''
                "
                v-bind="attrs"
                v-on="on"
                @click="
                  changeStatusOrder(item?.item?.orderId, item?.item?.status)
                "
              >
                {{ capitalizeFirstLetter(item?.item?.status) }}
              </v-btn>
            </template>
            <span>{{ statusOrderTooltips(item) }}</span>
          </v-tooltip>
        </template>
        <template #[`item.invoice`]="item">
          <v-btn
            depressed
            outlined
            small
            :disabled="
              item?.item?.status !== 'complete' ||
              loading.downloadInvoice !== '' ||
              loading.cancelOrder !== '' ||
              loading.status !== ''
            "
            :class="`'text-12`"
            :loading="loading.downloadInvoice === item?.item?.orderId"
            @click="downloadInvoice(item?.item?.orderId)"
          >
            Unduh
          </v-btn>
        </template>
        <template #[`item.action`]="item">
          <v-btn
            depressed
            outlined
            small
            :disabled="
              item?.item?.status === 'complete' ||
              item?.item?.status === 'cancel' ||
              loading.cancelOrder !== '' ||
              loading.downloadInvoice !== '' ||
              loading.status !== ''
            "
            :class="`'text-12`"
            :loading="loading.cancelOrder === item?.item?.orderId"
            @click="cancelOrder(item?.item?.orderId)"
          >
            Batalkan
          </v-btn>
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
              :disabled="!paginator.hasPrevPage || loading.data"
              @click="params.page--"
              >Sebelumnya</v-btn
            >
            <v-btn
              class="ml-2"
              outlined
              height="36"
              depressed
              dense
              :disabled="!paginator.hasNextPage || loading.data"
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
            v-for="item in detailsProduct?.details"
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
              <v-list-item-subtitle>
                {{ 'Jumlah : ' + item?.qty }}
              </v-list-item-subtitle>
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
                {{ formatRupiah(detailsProduct.total) }}
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
import Search from '~/components/Input/Search.vue'
import { capitalizeFirstLetter } from '~/utils/capitalizeFirstLetter'
import { formatRupiah } from '~/utils/formatRupiah'

export default {
  name: 'Orders',
  components: { Modal, Search },
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
        status: '',
        cancelOrder: '',
        downloadInvoice: '',
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
          width: '75px',
        },
        {
          text: 'Nama',
          value: 'user.name',
          width: '202px',
        },
        {
          text: 'ID Order',
          value: 'orderId',
          width: '180px',
        },
        { text: 'Total Order', value: 'details.length', width: '150px' },
        { text: 'Total Harga', value: 'total', width: '130px' },
        { text: 'Status', value: 'user.status', width: '130px' },
        { text: 'Tanggal', value: 'createdAt', width: '200px' },
        { text: 'Status Order', value: 'status', width: '150px' },
        { text: 'Invoice', value: 'invoice' },
        { text: 'Aksi', value: 'action' },
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
    'params.page'() {
      this.getOrder()
    },
  },
  mounted() {
    this.getOrder()
  },
  methods: {
    async handleSearch() {
      this.params = {
        ...this.params,
        page: 1,
      }
      await this.getOrder()
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
      this.detailsProduct = item
    },
    capitalizeFirstLetter(string) {
      return capitalizeFirstLetter(string)
    },
    statusOrderButtonColor(item) {
      return item?.item?.status === 'complete'
        ? 'success_100'
        : item?.item?.status === 'process'
        ? 'blue-100'
        : 'orange-100'
    },
    statusOrderButtonTextColor(item) {
      return item?.item?.status === 'complete'
        ? 'success_600--text cursor-normal'
        : item?.item?.status === 'process'
        ? 'blue-600--text'
        : 'orange-600--text cursor-normal'
    },
    statusOrderTooltips(item) {
      return item?.item?.status === 'process'
        ? 'Klik untuk menyelesaikan pesanan'
        : item?.item?.status === 'complete'
        ? 'Pesanan telah selesai'
        : 'Pesanan telah dibatalkan'
    },

    async changeStatusOrder(orderId, status) {
      if (status === 'complete' || status === 'cancel') return

      this.loading.status = orderId
      await this.$store.dispatch('order/changeStatusOrder', orderId)
      this.loading.status = ''
    },
    async cancelOrder(orderId) {
      this.loading.cancelOrder = orderId
      await this.$store.dispatch('order/cancelOrder', orderId)
      this.loading.cancelOrder = ''
    },
    async downloadInvoice(orderId) {
      this.loading.downloadInvoice = orderId
      await this.$store.dispatch('order/downloadInvoice', {
        orderId,
      })
      this.loading.downloadInvoice = ''
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

:deep(.v-btn:is(.rounded-full)) {
  border-radius: 50px !important;
}
</style>
