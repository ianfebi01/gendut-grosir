<template>
  <v-container fluid class="full-width-height bg-gray_100">
    <v-row class=" pt-4">
      <div class="d-flex flex-column">
        <span class="text-30 font-weight-medium text-gray_900"> Produk </span>
        <span class="text-14 font-weight-normal text-gray_500">
          Kelola produk anda
        </span>
      </div>
      <v-spacer></v-spacer>
      <barcode
        v-model="barcode"
        style="max-width: 200px"
        class="mr-4"
        placeholder="Tambah stok"
        :success-message="successMessage.barcode"
        :loading="loading.barcode"
        :error-message="barcodeErrorMessage"
        @handleBarcodeinput="handleBarcodeinput"
      />
      <v-btn
        color="primary"
        height="44"
        density="compact"
        variant="flat"
        @click="modal = true"
      >
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Tambah Produk
      </v-btn>
    </v-row>

    <v-row class=" pt-4">
      <Search
        v-model="search"
        style="max-width: 400px"
        @input="handleSearch($event)"
      />
    </v-row>

    <v-row class=" py-4">
      <v-data-table
        :headers="headers"
        :items="datas"
        :loading="loading.datas"
        :items-per-page="paginator?.limit"
        hide-default-footer
        no-data-text="No Data"
        disable-sort
        class="data-table fixed-non-select-col"
      >
        <template #[`item.image`]="item">
          <v-img
            lazy-src="/lazy-loader.svg"
            height="40"
            width="40"
            :src="$changeImageSize(item?.item?.image, 'xs')"
          />
        </template>
        <template #[`item.retailPrice`]="item">
          <p>{{ $formatRupiah(item.item?.retailPrice) }}</p>
        </template>
        <template #[`item.wholesalerPrice`]="item">
          <p>{{ $formatRupiah(item.item?.wholesalerPrice) }}</p>
        </template>
        <template #[`item.action`]="item">
          <div>
            <v-btn
              icon
              variant="text"
              size="small"
              color="gray_500"
              :loading="item?.item._id === loading.edit"
              @click="openEditModal(item?.item)"
              ><v-icon size="small">$edit</v-icon></v-btn
            >
            <v-btn
              icon
              variant="text"
              size="small"
              color="gray_500"
              @click="openDeleteModal(item?.item)"
            >
              <v-icon size="small">$trash</v-icon>
            </v-btn>
          </div>
        </template>
        <template #bottom>
          <div class="d-flex align-center text-14 my-4 mx-4">
            <span class="text-gray_700 font-weight-medium">{{
              'Page ' + page + ' of ' + paginator?.totalPages
            }}</span>
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              height="36"
              density="compact"
              :disabled="!paginator.hasPrevPage || loading.datas"
              @click="page--"
              >Previous</v-btn
            >
            <v-btn
              class="ml-2"
              variant="outlined"
              height="36"
              density="compact"
              :disabled="!paginator.hasNextPage || loading.datas"
              @click="page++"
              >Next</v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-row>

    <!-- Add -->
    <Modal
      v-model="modal"
      title="Tambahkan Produk"
      width="800px"
      subtitle="Tambahkan produk untuk toko anda"
      :loading="loading.add"
      :error-message="errorMessage"
      :modal-prop="modal"
      :disable="v$.form.$invalid"
      :fullscreen="$vuetify.display.xs"
      @cancel="clearAll"
      @save="handleAdd"
      @clearErrorMessage="clearProductError"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="12" md="6">
            <div
              class="font-weight-medium mb-1 text-gray_700"
              style="font-size: 14px"
            >
              Gambar
            </div>
            <v-card
              class="input-image"
              variant="outlined"
              width="432"
              height="201"
              style="overflow: hidden"
              @click="''"
            >
              <v-btn
                v-if="imageFile"
                density="compact"
                size="small"
                icon
                variant="text"
                class="clear-image"
                @click="clearImage"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>

              <div
                v-if="!imageFile"
                class="d-flex flex-column align-center justify-center"
                style="width: 100%; height: 100%"
                @click="$refs.inputImage.$refs.input.click()"
              >
                <div class="icon">
                  <v-icon size="18">$upload</v-icon>
                </div>

                <span class="text-primary font-weight-bold pa-0">
                  Klik untuk upload foto
                </span>
                <span class="text-gray_500 text-12 font-weight-normal pa-0">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </span>
              </div>
              <v-img
                v-else-if="imageFile"
                :src="imageFile"
                width="432"
                height="123"
              ></v-img>
            </v-card>
            <v-file-input
              ref="inputImage"
              accept="image/*"
              class="d-none"
              type="file"
              @change="imageInput"
            ></v-file-input>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Nama
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.name"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Product name"
              :hide-details="v$.form.name.$error ? false : true"
              :error-messages="
                v$.form.name.required.$invalid && v$.form.name.$dirty
                  ? 'Name is required'
                  : v$.form.name.minLength.$invalid && v$.form.name.$dirty
                  ? 'Minimum length is 2 characters'
                  : v$.form.name.maxLength.$invalid && v$.form.name.$dirty
                  ? 'Maximum length is 20 characters'
                  : []
              "
              @blur="v$.form.name.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="v$.form.name.$invalid && v$.form.name.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Kategori
              <span style="color: red !important">*</span>
            </div>
            <v-autocomplete
              v-model="form.category"
              :items="category"
              item-title="name"
              item-value="_id"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              :hide-details="v$.form.category.$error ? false : true"
              placeholder="Select Category"
              :error-messages="
                v$.form.category.required.$invalid && v$.form.category.$dirty
                  ? 'Category is required'
                  : []
              "
              @keyup="autocompleteCategories($event)"
              @focus="getCategory()"
              @blur="v$.form.category.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="v$.form.category.$invalid && v$.form.category.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <div
              class="font-weight-medium mb-1 text-gray_700"
              style="font-size: 14px"
            >
              Stok
            </div>
            <v-text-field
              v-model="form.stock"
              bg-color="#fff"
              variant="outlined"
              type="number"
              density="compact"
              height="44"
              placeholder="Enter Buy Price"
              hide-details
            >
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Harga modal
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.buyPrice"
              bg-color="#fff"
              variant="outlined"
              type="number"
              density="compact"
              height="44"
              placeholder="Enter Buy Price"
              :hide-details="v$.form.buyPrice.$error ? false : true"
              :error-messages="
                v$.form.buyPrice.required.$invalid && v$.form.buyPrice.$dirty
                  ? 'Buy Price is required'
                  : v$.form.buyPrice.maxLength.$invalid && v$.form.buyPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : v$.form.buyPrice.numeric.$invalid && v$.form.buyPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="v$.form.buyPrice.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="v$.form.buyPrice.$invalid && v$.form.buyPrice.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Jual ke sales
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.wholesalerPrice"
              type="number"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Sales Price"
              :hide-details="v$.form.wholesalerPrice.$error ? false : true"
              :error-messages="
                v$.form.wholesalerPrice.required.$invalid &&
                v$.form.wholesalerPrice.$dirty
                  ? 'Sales Price is required'
                  : v$.form.wholesalerPrice.maxLength.$invalid &&
                    v$.form.wholesalerPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : v$.form.wholesalerPrice.numeric.$invalid &&
                    v$.form.wholesalerPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="v$.form.wholesalerPrice.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="
                    v$.form.wholesalerPrice.$invalid &&
                    v$.form.wholesalerPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Jual ke retail
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.retailPrice"
              type="number"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Retail Price"
              :hide-details="v$.form.retailPrice.$error ? false : true"
              :error-messages="
                v$.form.retailPrice.required.$invalid && v$.form.retailPrice.$dirty
                  ? 'Retail Price is required'
                  : v$.form.retailPrice.maxLength.$invalid && v$.form.retailPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : v$.form.retailPrice.numeric.$invalid && v$.form.retailPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="v$.form.retailPrice.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="
                    v$.form.retailPrice.$invalid && v$.form.retailPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Barcode
            </div>
            <v-text-field
              v-model="form.barcode"
              v-barcode
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Barcode"
            >
            </v-text-field>
          </v-col>
          <v-col v-if="uploadProgress" cols="12">
            <v-progress-linear
              :model-value="uploadProgress"
              color="primary"
              height="25"
            >
              <template #default="{ value }">
                <strong class="text-white">{{ value }}%</strong>
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>
      </template>
    </Modal>

    <!-- Edit -->
    <Modal
      v-model="editModal"
      title="Edit Product"
      width="800px"
      subtitle="Edit Product on your store"
      :loading="loading.add"
      :error-message="errorMessage"
      :modal-prop="editModal"
      :disable="v$.form.$invalid"
      :fullscreen="$vuetify.display.xs"
      @cancel="clearAll"
      @save="handleEdit"
      @clearErrorMessage="clearProductError"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="12" sm="6">
            <div
              class="font-weight-medium mb-1 text-gray_700"
              style="font-size: 14px"
            >
              Gambar
            </div>
            <v-card
              class="input-image"
              variant="outlined"
              width="432"
              height="201"
              style="overflow: hidden"
              @click="''"
            >
              <v-btn
                v-if="imageFile"
                density="compact"
                size="small"
                icon
                variant="text"
                class="clear-image"
                @click="clearImageEdit"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>

              <div
                v-if="!imageFile"
                class="d-flex flex-column align-center justify-center"
                style="width: 100%; height: 100%"
                @click="$refs.inputImage.$refs.input.click()"
              >
                <div class="icon">
                  <v-icon size="18">$upload</v-icon>
                </div>

                <span class="text-primary font-weight-bold pa-0">
                  Click to upload
                </span>
                <span class="text-gray_500 text-12 font-weight-normal pa-0">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </span>
              </div>
              <v-img
                v-else-if="imageFile"
                :src="imageFile"
                width="432"
                height="123"
              ></v-img>
            </v-card>
            <v-file-input
              ref="inputImage"
              accept="image/*"
              class="d-none"
              type="file"
              @change="imageInput"
            ></v-file-input>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Nama
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.name"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Product name"
              :hide-details="v$.form.name.$error ? false : true"
              :error-messages="
                v$.form.name.required.$invalid && v$.form.name.$dirty
                  ? 'Name is required'
                  : v$.form.name.minLength.$invalid && v$.form.name.$dirty
                  ? 'Minimum length is 2 characters'
                  : v$.form.name.maxLength.$invalid && v$.form.name.$dirty
                  ? 'Maximum length is 20 characters'
                  : []
              "
              @blur="v$.form.name.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="v$.form.name.$invalid && v$.form.name.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Kategori
              <span style="color: red !important">*</span>
            </div>
            <v-autocomplete
              v-model="form.category"
              :items="category"
              item-title="name"
              item-value="_id"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              :hide-details="v$.form.category.$error ? false : true"
              placeholder="Select Category"
              :error-messages="
                v$.form.category.required.$invalid && v$.form.category.$dirty
                  ? 'Category is required'
                  : []
              "
              @keyup="autocompleteCategories($event)"
              @focus="getCategory()"
              @blur="v$.form.category.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="v$.form.category.$invalid && v$.form.category.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <div
              class="font-weight-medium mb-1 text-gray_700"
              style="font-size: 14px"
            >
              Stok
            </div>
            <v-text-field
              v-model="form.stock"
              bg-color="#fff"
              variant="outlined"
              type="number"
              density="compact"
              height="44"
              placeholder="Enter Buy Price"
              hide-details
            >
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Harga modal
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.buyPrice"
              bg-color="#fff"
              variant="outlined"
              type="number"
              density="compact"
              height="44"
              placeholder="Enter Buy Price"
              :hide-details="v$.form.buyPrice.$error ? false : true"
              :error-messages="
                v$.form.buyPrice.required.$invalid && v$.form.buyPrice.$dirty
                  ? 'Buy Price is required'
                  : v$.form.buyPrice.maxLength.$invalid && v$.form.buyPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : v$.form.buyPrice.numeric.$invalid && v$.form.buyPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="v$.form.buyPrice.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="v$.form.buyPrice.$invalid && v$.form.buyPrice.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Jual ke sales
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.wholesalerPrice"
              type="number"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Sales Price"
              :hide-details="v$.form.wholesalerPrice.$error ? false : true"
              :error-messages="
                v$.form.wholesalerPrice.required.$invalid &&
                v$.form.wholesalerPrice.$dirty
                  ? 'Sales Price is required'
                  : v$.form.wholesalerPrice.maxLength.$invalid &&
                    v$.form.wholesalerPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : v$.form.wholesalerPrice.numeric.$invalid &&
                    v$.form.wholesalerPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="v$.form.wholesalerPrice.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="
                    v$.form.wholesalerPrice.$invalid &&
                    v$.form.wholesalerPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Jual ke retail
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.retailPrice"
              type="number"
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Retail Price"
              :hide-details="v$.form.retailPrice.$error ? false : true"
              :error-messages="
                v$.form.retailPrice.required.$invalid && v$.form.retailPrice.$dirty
                  ? 'Retail Price is required'
                  : v$.form.retailPrice.maxLength.$invalid && v$.form.retailPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : v$.form.retailPrice.numeric.$invalid && v$.form.retailPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="v$.form.retailPrice.$touch()"
            >
              <template #append>
                <v-icon
                  v-if="
                    v$.form.retailPrice.$invalid && v$.form.retailPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 text-gray_700 mt-2"
              style="font-size: 14px"
            >
              Barcode
            </div>
            <v-text-field
              v-model="form.barcode"
              v-barcode
              bg-color="#fff"
              variant="outlined"
              density="compact"
              height="44"
              placeholder="Enter Barcode"
            >
            </v-text-field>
          </v-col>
          <v-col v-if="uploadProgress" cols="12">
            <v-progress-linear
              :model-value="uploadProgress"
              color="primary"
              height="25"
            >
              <template #default="{ value }">
                <strong class="text-white">{{ value }}%</strong>
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>
      </template>
    </Modal>
    <Delete
      v-model="deleteModal"
      icon="$warning_delete"
      :loading="loading.delete"
      @ok="handleDelete()"
    />
  </v-container>
</template>

<script>
import Modal from '~/components/Dialog/Modal.vue'
import Delete from '~/components/Dialog/Delete.vue'
import Search from '~/components/Input/Search.vue'
import { required, minLength, maxLength, numeric } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import debounce from 'lodash/debounce'
import directive from '~/utils/directive'
import replaceChar from '~/utils/mixins/replaceChar'
import Barcode from '~/components/Input/Barcode.vue'
import { useProductStore } from '~/stores/product'
import { useCategoryStore } from '~/stores/category'
import { useUploadImagesStore } from '~/stores/uploadImages'

export default {
  name: 'Product',
  components: { Search, Modal, Delete, Barcode },
  mixins: [directive, replaceChar],
  data() {
    return {
      image: null,
      imageFile: null,
      form: {
        id: null,
        name: '',
        category: '',
        stock: null,
        buyPrice: null,
        wholesalerPrice: null,
        retailPrice: null,
        barcode: null,
      },
      v$: null,
      loading: {
        barcode: false,
        category: false,
        edit: false,
        add: false,
        delete: false,
        datas: false,
      },
      successMessage: {
        barcode: '',
      },
      barcodeErrorMessage: '',
      barcode: null,
      id: '',
      editModal: false,
      publicId: null,
      deleteModal: false,
      modal: false,
      search: '',
      name: '',
      headers: [
        {
          title: 'Gambar',
          value: 'image',
          width: '120px',
        },
        {
          title: 'Nama',
          value: 'name',
          width: '200px',
          sort: false,
        },
        { title: 'Stok', value: 'stock', width: '100px' },
        {
          title: 'Kategori',
          value: 'category.name',
          width: '150px',
        },
        {
          title: 'Harga Retail',
          value: 'retailPrice',
          width: '150px',
        },
        {
          title: 'Harga Sales',
          value: 'wholesalerPrice',
          width: '150px',
          sort: false,
        },
        { title: 'Aksi', value: 'action', width: '150px', sort: false },
      ],
      page: 1,
    }
  },
  computed: {
    datas() {
      return useProductStore().product
    },
    paginator() {
      return useProductStore().paginator
    },
    errorMessage() {
      return useProductStore().errorMessage
    },
    uploadProgress() {
      return useProductStore().uploadProgress
    },
    category() {
      return useCategoryStore().category
    },
    imageUrl() {
      return useUploadImagesStore().imageUrl
    },
    productDetails() {
      return useProductStore().productDetails
    },
  },
  watch: {
    page() {
      this.getProduct()
    },
  },
  created() {
    // Explicit useVuelidate args: the watcher runs immediately, so the
    // validation tree exists during SSR (the no-arg + validations() path
    // only populates in onBeforeMount, which never runs on the server).
    this.v$ = useVuelidate(
      {
        form: {
          name: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(50),
          },
          category: {
            required,
          },
          buyPrice: {
            required,
            maxLength: maxLength(50),
            numeric,
          },
          wholesalerPrice: {
            required,
            maxLength: maxLength(50),
            numeric,
          },
          retailPrice: {
            required,
            maxLength: maxLength(50),
            numeric,
          },
        },
      },
      { form: this.form }
    )
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    clearProductError() {
      useProductStore().errorMessage = ''
    },
    async handleSearch() {
      await this.getProduct()
    },
    async getProduct() {
      this.loading.datas = true
      const params = {
        q: this.search,
        page: this.page,
        limit: 25,
      }
      const res = await useProductStore().getProduct(params)
      if (res) {
        this.loading.datas = false
      } else {
        this.loading.datas = false
      }
    },
    async handleAdd() {
      this.loading.add = true

      const formData = new FormData()
      if (this.image) {
        formData.append('image', this.image)
      }
      Object.keys(this.form).forEach((key) => {
        if (this.form[key] !== null) {
          formData.append(key, this.form[key])
        }
      })
      const res = await useProductStore().addProduct(formData)
      // const body = { ...this.form }

      // const res = await useProductStore().addProduct(body)
      if (res) {
        this.loading.add = false
        this.modal = false
        this.clearAll()
      } else {
        this.loading.add = false
      }
    },
    openDeleteModal(item) {
      this.id = item._id
      this.publicId = item.image?.match(
        /(gendut-grosir)\/([a-zA-Z0-9]*)/gm
      )?.[0]
      this.deleteModal = true
    },
    async handleDelete() {
      this.loading.delete = true
      const res = await useProductStore().deleteProduct(this.id)
      await useUploadImagesStore().deleteImages(this.publicId)
      if (res) {
        this.loading.delete = false
        this.deleteModal = false
      } else {
        this.loading.delete = false
      }
    },
    async openEditModal(item) {
      this.loading.edit = item?._id
      const res = await useProductStore().getProductById(item?._id)

      if (res) {
        this.imageFile = this.productDetails.image
        Object.keys(this.form).forEach((k) => delete this.form[k])
        Object.assign(this.form, {
          ...this.productDetails,
          category: this.productDetails.category._id,
        })
        await this.getCategory(this.productDetails.category.name)
        this.editModal = true
        this.loading.edit = ''
      } else {
        this.loading.edit = ''
      }
    },
    async handleEdit() {
      this.loading.add = true

      // Upload Image
      const formData = new FormData()
      if (this.image) {
        formData.append('image', this.image)
      }
      Object.keys(this.form).forEach((key) => {
        if (this.form[key] !== null) {
          formData.append(key, this.form[key])
        }
      })
      const res = await useProductStore().editProduct(formData)

      if (res) {
        this.loading.add = false
        this.editModal = false
        this.clearAll()
      } else {
        this.loading.add = false
      }
    },
    async getCategory(q) {
      this.loading.category = true
      const params = {
        q: q,
        page: 1,
        limit: 25,
      }
      const res = await useCategoryStore().getCategory(params)
      if (res) {
        this.loading.category = false
      } else {
        this.loading.category = false
      }
    },
    autocompleteCategories: debounce(function (event) {
      this.getCategory(event.target._value)
    }, 500),
    async imageInput(event) {
      this.image = event
      if (event) {
        this.imageFile = event ? URL.createObjectURL(event) : undefined // untuk nampilin di frontend
      }
    },
    clearImage() {
      this.imageFile = null
      this.image = null
    },
    async clearImageEdit() {
      this.publicId = this.productDetails.image.match(
        /(gendut-grosir)\/([a-zA-Z0-9]*)/gm
      )?.[0]
      this.imageFile = null
      this.image = null
    },
    clearAll() {
      this.clearImage()
      this.publicId = ''
      Object.keys(this.form).forEach((k) => delete this.form[k])
      Object.assign(this.form, {
        name: '',
        category: '',
        buyPrice: null,
        wholesalerPrice: null,
        retailPrice: null,
        barcode: null,
        image: null,
      })
      this.v$.form.$reset()
    },
    handleBarcodeinput: debounce(async function () {
      this.successMessage.barcode = ''
      this.loading.barcode = true
      this.barcode = this.onlyNumber(this.barcode)
      const res = await useProductStore().addStockById(this.barcode)
      // if success get product
      if (res) {
        this.successMessage.barcode = 'Stock produk ' + res + ' ditambahkan 1'
        this.barcodeErrorMessage = ''
        this.barcode = null
      } else {
        this.barcodeErrorMessage = useProductStore().errorMessage
      }
      this.loading.barcode = false
    }, 500),
  },
}
</script>

<script setup>
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Gendut Grosir | Produk' })

const { $formatRupiah, $changeImageSize } = useNuxtApp()
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
</style>
