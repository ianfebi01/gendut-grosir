<template>
  <v-container fluid class="full-width-height bg-gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium text-gray_900">
        Stock Opname
      </span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!mode.add"
        color="primary"
        height="44"
        density="compact"
        variant="flat"
        @click="handleAdd"
      >
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Tambah Stock Opname
      </v-btn>
      <div v-else>
        <v-btn
          class="mr-2"
          variant="outlined"
          height="44"
          density="compact"
          @click="handleCancel"
        >
          Batal
        </v-btn>
        <v-btn
          color="primary"
          height="44"
          density="compact"
          variant="flat"
          :loading="loading.save"
          @click="saveStockOpname"
        >
          Simpan Stock Opname
        </v-btn>
      </div>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal text-gray_500">
        Kelola stock opmane Anda
      </span>
    </v-row>
    <v-row class="px-6 pt-4">
      <Search
        v-if="!mode.add"
        v-model="params.q"
        style="max-width: 400px"
        @input="handleSearch($event)"
      />
      <template v-else>
        <InputDate :value="dayjs(payload.date).format('DD/MM/YYYY')" />
      </template>
    </v-row>
    <v-row class="px-6 pt-4">
      <StockOpnameDataTable
        v-if="!mode.add"
        :headers="headers"
        :paginator="paginator"
        :datas="datas"
        :loading="loading.datas"
        :loading-apply="loading.apply"
        @next="params.page++"
        @previous="params.page--"
        @clickProduct="handleOpenModalProduct($event)"
        @apply="handleApplyStockOpname($event)"
      />

      <v-card
        v-else-if="mode.add"
        width="100%"
        variant="outlined"
        class="border-8"
      >
        <v-list-item class="mt-4">
          <v-list-item-title class="font-weight-bold text-gray_900 text-20">
            Tambah Produk
          </v-list-item-title>
        </v-list-item>

        <v-card-text>
          <v-row>
            <v-col>
              <div
                class="font-weight-medium mb-1 text-gray_700 mt-2"
                style="font-size: 14px"
              >
                Product
                <span style="color: red !important">*</span>
              </div>
              <v-autocomplete
                v-model="form.product"
                :items="productData"
                item-title="name"
                item-value="_id"
                bg-color="#fff"
                variant="outlined"
                density="compact"
                height="44"
                placeholder="Select Product"
                :loading="loading.product"
                :error-messages="error_message('product')"
                @blur="v$.form.product.$touch()"
                @focus="getProduct()"
                @keyup="autocompleteProduct($event)"
              >
              </v-autocomplete>
            </v-col>
            <v-col>
              <div
                class="font-weight-medium mb-1 text-gray_700 mt-2"
                style="font-size: 14px"
              >
                Stock Sistem
              </div>
              <v-text-field
                :value="systemQty"
                type="number"
                bg-color="#fff"
                variant="outlined"
                density="compact"
                height="44"
                placeholder="Stock Sistem"
                disabled
              >
              </v-text-field>
            </v-col>

            <v-col>
              <div
                class="font-weight-medium mb-1 text-gray_700 mt-2"
                style="font-size: 14px"
              >
                Stock Sesungguhnya
                <span style="color: red !important">*</span>
              </div>
              <v-text-field
                v-model.number="form.realQty"
                v-types="'number'"
                bg-color="#fff"
                variant="outlined"
                density="compact"
                height="44"
                placeholder="Stock Sesungguhnya"
                :disabled="!form.product"
                :error-messages="error_message('realQty')"
                @blur="v$.form.realQty.$touch()"
              >
                <template #append>
                  <v-icon
                    v-if="v$.form.realQty.$invalid && v$.form.realQty.$dirty"
                    color="red"
                  >
                    mdi-alert-circle-outline
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="auto" sm="auto" xl="auto" lg="auto">
              <v-btn
                color="primary"
                :style="$vuetify.display.smAndUp && 'margin-top: 34px'"
                variant="flat"
                height="44"
                block
                :disabled="v$.form.realQty.$invalid"
                @click="addProduct"
                >Tambahkan</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <product-table
                :headers="headersAddProduct"
                :datas="payload.product"
                @deleteProduct="deleteProduct($event)"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <Modal
      v-model="modal.detailProduct"
      width="1024"
      title="Produk"
      subtitle="Detail product stock opname"
    >
      <template #content>
        <product-table
          :headers="headersPreview"
          :datas="payload.product"
          :read-only="true"
          @deleteProduct="deleteProduct($event)"
        />
      </template>
      <template #action>
        <v-col class="px-0 pr-1 d-flex justify-end">
          <v-btn
            variant="outlined"
            height="44"
            density="compact"
            @click="modal.detailProduct = false"
          >
            Tutup
          </v-btn>
        </v-col>
      </template>
    </Modal>
  </v-container>
</template>
<script>
import debounce from 'lodash/debounce'
import Search from '~/components/Input/Search.vue'
import directive from '~/utils/directive'
import { required, numeric, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import ProductTable from '~/components/Table/StockOpname/ProductTable.vue'
import StockOpnameDataTable from '~/components/Table/StockOpname/Datas.vue'
import InputDate from '~/components/Input/Date.vue'
import Modal from '~/components/Dialog/Modal.vue'
import { useProductStore } from '~/stores/product'
import { useStockOpnameStore } from '~/stores/stockOpname'

export default {
  components: { Search, ProductTable, InputDate, StockOpnameDataTable, Modal },
  mixins: [directive],
  data() {
    return {
      mode: {
        add: false,
      },
      headers: [
        {
          title: 'Id Stock Opname',
          value: 'opnameId',
        },
        {
          title: 'Pengguna',
          value: 'user.name',
        },
        {
          title: 'Tanggal',
          value: 'date',
        },
        { title: 'Detail', value: 'product' },
        { title: 'Aksi', value: 'action' },
      ],
      headersAddProduct: [
        {
          title: 'Product',
          value: 'productName',
        },
        {
          title: 'Stok Sistem',
          value: 'systemQty',
        },
        {
          title: 'Stok Sebenarnya',
          value: 'realQty',
        },
        { title: 'Perbedaan', value: 'difference' },
        { title: 'Aksi', value: 'action' },
      ],
      headersPreview: [
        {
          title: 'Product',
          value: 'productName',
        },
        {
          title: 'Stok Sistem',
          value: 'systemQty',
        },
        {
          title: 'Stok Sebenarnya',
          value: 'realQty',
        },
        { title: 'Perbedaan', value: 'difference' },
      ],
      form: {},
      v$: null,
      params: {
        q: '',
        limit: 25,
        page: 1,
      },
      paramsProduct: {
        q: this.search,
        page: this.page,
        limit: 25,
        product: [],
      },
      product: '',
      payload: { product: [] },
      loading: {
        save: false,
        product: false,
        datas: false,
        apply: '',
      },
      modal: {
        detailProduct: false,
      },
      test: true,
    }
  },
  computed: {
    productData() {
      const productData = JSON.parse(JSON.stringify(useProductStore().product))
      const product = this.payload.product.map((item) => item.product)
      const filter = productData.filter((item) => !product.includes(item._id))
      return filter
    },
    systemQty() {
      const tmp = JSON.parse(JSON.stringify(this.productData))
      const systemQty = tmp.find(
        (item) => item._id === this.form.product
      )?.stock
      return systemQty
    },
    productName() {
      const tmp = JSON.parse(JSON.stringify(this.productData))
      const productName = tmp.find(
        (item) => item._id === this.form.product
      )?.name
      return productName
    },
    datas() {
      return useStockOpnameStore().stockOpname
    },
    paginator() {
      return useStockOpnameStore().paginator
    },
  },
  watch: {
    'params.page'() {
      this.getDatas()
    },
  },
  created() {
    // Explicit useVuelidate args: the watcher runs immediately, so the
    // validation tree exists during SSR (the no-arg + validations() path
    // only populates in onBeforeMount, which never runs on the server).
    this.v$ = useVuelidate(
      {
        form: {
          realQty: {
            required,
            numeric,
            maxLength: maxLength(20),
          },
          product: {
            required,
          },
        },
      },
      { form: this.form }
    )
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    error_message(param) {
      const errors = []

      Object.entries(this.v$.form).forEach((entry) => {
        const [key] = entry
        if (key === param) {
          const {
            $dirty,
            $params,
            required,
            email,
            minLength,
            numeric,
            sameAs,
            maxLength,
          } = this.v$.form[key]
          if (!$dirty) return errors
          // required
          required === false && errors.push('Field Tidak Boleh Kosong')
          // email
          email === false && errors.push(`Format email tidak valid`)
          // minLength
          minLength === false &&
            errors.push(`Input minimal ${$params.minLength.min} karakter`)
          maxLength === false &&
            errors.push(`Input maximal ${$params.maxLength.max} karakter`)
          // minLength
          numeric === false && errors.push(`Input hanya boleh angka`)
          // sameAs
          sameAs === false &&
            errors.push(`Input harus sama dengan ${$params?.sameAs?.eq}`)
        }
      })
      return errors
    },
    handleAdd() {
      this.payload = { date: new Date(), product: [] }

      this.mode.add = true
    },
    async getProduct() {
      this.loading.product = true
      await useProductStore().getProduct(this.paramsProduct)
      this.loading.product = false
    },
    autocompleteProduct: debounce(async function (e) {
      this.paramsProduct.q = e.target._value
      await this.getProduct()
    }, 500),
    addProduct() {
      this.payload.product.push({
        systemQty: this.systemQty,
        productName: this.productName,
        ...this.form,
        difference: this.form.realQty - this.systemQty,
      })

      Object.keys(this.form).forEach((k) => delete this.form[k])
      this.v$.form.$reset()
    },
    deleteProduct(product) {
      const index = this.payload.product.findIndex(
        (item) => item.product === product
      )

      if (index != -1) {
        this.payload.product.splice(index, 1)
      }
    },
    async saveStockOpname() {
      this.loading.save = true
      await useStockOpnameStore().postStockOpname(this.payload)
      this.loading.save = false
      this.mode.add = false
    },
    async getDatas() {
      this.loading.datas = true
      await useStockOpnameStore().getStockOpname(this.params)
      this.loading.datas = false
    },
    handleSearch: debounce(async function () {
      this.getDatas()
    }, 500),
    handleOpenModalProduct(product) {
      this.modal.detailProduct = true
      this.payload.product = product
    },
    handleCancel() {
      this.payload = { product: [] }
      this.mode.add = false
    },
    async handleApplyStockOpname(id) {
      this.loading.apply = id
      await useStockOpnameStore().applyStockOpname(id)
      this.loading.apply = ''
    },
  },
}
</script>

<script setup>
import dayjs from 'dayjs'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Gendut Grosir | Stock Opname' })
</script>
