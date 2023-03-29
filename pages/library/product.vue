<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text"> Product </span>
      <v-spacer></v-spacer>
      <v-btn color="primary" height="44" dense depressed @click="modal = true">
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Add Product
      </v-btn>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
        Manage all your prroducts
      </span>
    </v-row>
    <v-row class="px-6 pt-4">
      <Search
        v-model="search"
        style="max-width: 400px"
        @input="handleSearch($event)"
      />
    </v-row>

    <v-row class="px-6 pt-4">
      <v-data-table
        :headers="headers"
        :items="datas"
        :loading="loading"
        :items-per-page="paginator?.limit"
        hide-default-footer
        no-data-text="No Data"
        class="data-table"
      >
        <template #[`item.image`]="item">
          <v-img
            lazy-src="lazy-loader.svg"
            height="40"
            width="40"
            :src="item?.item?.image"
          />
        </template>
        <template #[`item.action`]="item">
          <div>
            <v-btn
              fab
              text
              depressed
              small
              color="gray_500"
              :loading="item?.item._id === loadingEdit"
              @click="openEditModal(item?.item)"
              ><v-icon small>$edit</v-icon></v-btn
            >
            <v-btn
              fab
              text
              depressed
              small
              color="gray_500"
              @click="openDeleteModal(item?.item)"
            >
              <v-icon small>$trash</v-icon>
            </v-btn>
          </div>
        </template>
        <template #footer>
          <div class="d-flex align-center text-14 my-4 mx-4">
            <span class="gray_700--text font-weight-medium">{{
              'Page ' + page + ' of ' + paginator?.totalPages
            }}</span>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              height="36"
              depressed
              dense
              :disabled="!paginator.hasPrevPage"
              @click="page--"
              >Previous</v-btn
            >
            <v-btn
              class="ml-2"
              outlined
              height="36"
              depressed
              dense
              :disabled="!paginator.hasNextPage"
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
      title="Add Product"
      width="800px"
      subtitle="Add new Product for your store"
      :loading="loadingAdd"
      :error-message="errorMessage"
      :modal-prop="modal"
      :disable="$v.form.$invalid"
      @cancel="clearAll"
      @save="handleAdd"
      @clearErrorMessage="$store.set('product/errorMessage', '')"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="6">
            <div
              class="font-weight-medium mb-1 gray_700--text"
              style="font-size: 14px"
            >
              Image
            </div>
            <v-card
              class="input-image"
              outlined
              flat
              width="432"
              height="201"
              style="overflow: hidden"
              @click="''"
            >
              <v-btn
                v-if="imageFile"
                dense
                small
                fab
                text
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

                <span class="primary--text font-weight-bold pa-0">
                  Click to upload
                </span>
                <span class="gray_500--text text-12 font-weight-normal pa-0">
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
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Name
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.name"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Product name"
              :hide-details="$v.form.name.$error ? false : true"
              :error-messages="
                !$v.form.name.required && $v.form.name.$dirty
                  ? 'Name is required'
                  : !$v.form.name.minLength && $v.form.name.$dirty
                  ? 'Minimum length is 2 characters'
                  : !$v.form.name.maxLength && $v.form.name.$dirty
                  ? 'Maximum length is 20 characters'
                  : []
              "
              @blur="$v.form.name.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.name.$invalid && $v.form.name.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Category
              <span style="color: red !important">*</span>
            </div>
            <v-autocomplete
              v-model="form.category"
              :items="category"
              item-text="name"
              item-value="_id"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              :hide-details="$v.form.category.$error ? false : true"
              placeholder="Select Category"
              :error-messages="
                !$v.form.category.required && $v.form.category.$dirty
                  ? 'Category is required'
                  : []
              "
              @keyup="autocompleteCategories($event)"
              @focus="getCategory()"
              @blur="$v.form.category.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.category.$invalid && $v.form.category.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <div
              class="font-weight-medium mb-1 gray_700--text"
              style="font-size: 14px"
            >
              Stock
            </div>
            <v-text-field
              v-model="form.stock"
              background-color="#fff"
              outlined
              type="number"
              dense
              flat
              height="44"
              placeholder="Enter Buy Price"
              hide-details
            >
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Buy Price
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.buyPrice"
              background-color="#fff"
              outlined
              type="number"
              dense
              flat
              height="44"
              placeholder="Enter Buy Price"
              :hide-details="$v.form.buyPrice.$error ? false : true"
              :error-messages="
                !$v.form.buyPrice.required && $v.form.buyPrice.$dirty
                  ? 'Buy Price is required'
                  : !$v.form.buyPrice.maxLength && $v.form.buyPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : !$v.form.buyPrice.Number && $v.form.buyPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="$v.form.buyPrice.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.buyPrice.$invalid && $v.form.buyPrice.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Sales Price
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.wholesalerPrice"
              type="number"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Sales Price"
              :hide-details="$v.form.wholesalerPrice.$error ? false : true"
              :error-messages="
                !$v.form.wholesalerPrice.required &&
                $v.form.wholesalerPrice.$dirty
                  ? 'Sales Price is required'
                  : !$v.form.wholesalerPrice.maxLength &&
                    $v.form.wholesalerPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : !$v.form.wholesalerPrice.Number &&
                    $v.form.wholesalerPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="$v.form.wholesalerPrice.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="
                    $v.form.wholesalerPrice.$invalid &&
                    $v.form.wholesalerPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Retail Price
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.retailPrice"
              type="number"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Retail Price"
              :hide-details="$v.form.retailPrice.$error ? false : true"
              :error-messages="
                !$v.form.retailPrice.required && $v.form.retailPrice.$dirty
                  ? 'Retail Price is required'
                  : !$v.form.retailPrice.maxLength && $v.form.retailPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : !$v.form.retailPrice.Number && $v.form.retailPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="$v.form.retailPrice.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="
                    $v.form.retailPrice.$invalid && $v.form.retailPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Barcode
            </div>
            <v-text-field
              v-model="form.barcode"
              type="number"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Barcode"
            >
            </v-text-field>
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
      :loading="loadingAdd"
      :error-message="errorMessage"
      :modal-prop="editModal"
      :disable="$v.form.$invalid"
      @cancel="clearAll"
      @save="handleEdit"
      @clearErrorMessage="$store.set('product/errorMessage', '')"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="6">
            <div
              class="font-weight-medium mb-1 gray_700--text"
              style="font-size: 14px"
            >
              Image
            </div>
            <v-card
              class="input-image"
              outlined
              flat
              width="432"
              height="201"
              style="overflow: hidden"
              @click="''"
            >
              <v-btn
                v-if="imageFile"
                dense
                small
                fab
                text
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

                <span class="primary--text font-weight-bold pa-0">
                  Click to upload
                </span>
                <span class="gray_500--text text-12 font-weight-normal pa-0">
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
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Name
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.name"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Product name"
              :hide-details="$v.form.name.$error ? false : true"
              :error-messages="
                !$v.form.name.required && $v.form.name.$dirty
                  ? 'Name is required'
                  : !$v.form.name.minLength && $v.form.name.$dirty
                  ? 'Minimum length is 2 characters'
                  : !$v.form.name.maxLength && $v.form.name.$dirty
                  ? 'Maximum length is 20 characters'
                  : []
              "
              @blur="$v.form.name.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.name.$invalid && $v.form.name.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Category
              <span style="color: red !important">*</span>
            </div>
            <v-autocomplete
              v-model="form.category"
              :items="category"
              item-text="name"
              item-value="_id"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              :hide-details="$v.form.category.$error ? false : true"
              placeholder="Select Category"
              :error-messages="
                !$v.form.category.required && $v.form.category.$dirty
                  ? 'Category is required'
                  : []
              "
              @keyup="autocompleteCategories($event)"
              @focus="getCategory()"
              @blur="$v.form.category.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.category.$invalid && $v.form.category.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <div
              class="font-weight-medium mb-1 gray_700--text"
              style="font-size: 14px"
            >
              Stock
            </div>
            <v-text-field
              v-model="form.stock"
              background-color="#fff"
              outlined
              type="number"
              dense
              flat
              height="44"
              placeholder="Enter Buy Price"
              hide-details
            >
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Buy Price
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.buyPrice"
              background-color="#fff"
              outlined
              type="number"
              dense
              flat
              height="44"
              placeholder="Enter Buy Price"
              :hide-details="$v.form.buyPrice.$error ? false : true"
              :error-messages="
                !$v.form.buyPrice.required && $v.form.buyPrice.$dirty
                  ? 'Buy Price is required'
                  : !$v.form.buyPrice.maxLength && $v.form.buyPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : !$v.form.buyPrice.Number && $v.form.buyPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="$v.form.buyPrice.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.buyPrice.$invalid && $v.form.buyPrice.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Sales Price
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.wholesalerPrice"
              type="number"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Sales Price"
              :hide-details="$v.form.wholesalerPrice.$error ? false : true"
              :error-messages="
                !$v.form.wholesalerPrice.required &&
                $v.form.wholesalerPrice.$dirty
                  ? 'Sales Price is required'
                  : !$v.form.wholesalerPrice.maxLength &&
                    $v.form.wholesalerPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : !$v.form.wholesalerPrice.Number &&
                    $v.form.wholesalerPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="$v.form.wholesalerPrice.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="
                    $v.form.wholesalerPrice.$invalid &&
                    $v.form.wholesalerPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Retail Price
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.retailPrice"
              type="number"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Retail Price"
              :hide-details="$v.form.retailPrice.$error ? false : true"
              :error-messages="
                !$v.form.retailPrice.required && $v.form.retailPrice.$dirty
                  ? 'Retail Price is required'
                  : !$v.form.retailPrice.maxLength && $v.form.retailPrice.$dirty
                  ? 'Maximum length is 20 characters'
                  : !$v.form.retailPrice.Number && $v.form.retailPrice.$dirty
                  ? 'Must be a number'
                  : []
              "
              @blur="$v.form.retailPrice.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="
                    $v.form.retailPrice.$invalid && $v.form.retailPrice.$dirty
                  "
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Barcode
            </div>
            <v-text-field
              v-model="form.barcode"
              type="number"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Enter Barcode"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </template>
    </Modal>
    <Delete
      v-model="deleteModal"
      icon="$warning_delete"
      :loading="loadingDelete"
      @ok="handleDelete()"
    />
  </v-container>
</template>

<script>
import Modal from '~/components/Dialog/Modal.vue'
import Delete from '~/components/Dialog/Delete.vue'
import Search from '~/components/Input/Search.vue'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import debounce from 'lodash/debounce'

export default {
  name: 'Product',
  components: { Search, Modal, Delete },
  layout: 'dashboard',
  data() {
    return {
      imageFile: null,
      loadingCategory: false,
      form: {
        id: null,
        name: '',
        category: '',
        stock: null,
        buyPrice: null,
        wholesalerPrice: null,
        retailPrice: null,
        barcode: null,
        image: null,
      },
      loadingEdit: false,
      id: '',
      editModal: false,
      publicId: null,
      deleteModal: false,
      modal: false,
      loadingDelete: false,
      loadingAdd: false,
      search: '',
      name: '',
      headers: [
        {
          text: 'Image',
          value: 'image',
        },
        {
          text: 'Name',
          value: 'name',
        },
        { text: 'Stock', value: 'stock' },
        { text: 'Category', value: 'category.name' },
        { text: 'Retail Price', value: 'retailPrice' },
        { text: 'Sales Price', value: 'wholesalerPrice' },
        { text: 'Action', value: 'action' },
      ],
      loading: false,
      page: 1,
    }
  },
  head() {
    return {
      title: 'Gendut Grosir | Product',
    }
  },
  computed: {
    datas() {
      return this.$store.get('product/product')
    },
    paginator() {
      return this.$store.get('product/paginator')
    },
    errorMessage() {
      return this.$store.get('product/errorMessage')
    },
    category() {
      return this.$store.get('category/category')
    },
    imageUrl() {
      return this.$store.get('uploadImages/imageUrl')
    },
    productDetails() {
      return this.$store.get('product/productDetails')
    },
  },
  watch: {
    page() {
      this.getProduct()
    },
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    async handleSearch() {
      await this.getProduct()
    },
    async getProduct() {
      this.loading = true
      const params = {
        q: this.search,
        page: this.page,
        limit: 25,
      }
      const res = await this.$store.dispatch('product/getProduct', params)
      if (res) {
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async handleAdd() {
      this.loadingAdd = true

      if (this.image) {
        const formData = new FormData()
        formData.append('image', this.image)
        formData.append('path', 'gendut-grosir')
        const res = await this.$store.dispatch(
          'uploadImages/uploadImages',
          formData
        )
        if (res) {
          this.form.image = this.imageUrl[0].url
        }
      }
      const body = { ...this.form }

      const res = await this.$store.dispatch('product/addProduct', body)
      if (res) {
        this.loadingAdd = false
        this.modal = false
        this.clearAll()
      } else {
        this.loadingAdd = false
      }
    },
    openDeleteModal(item) {
      this.id = item._id
      this.publicId = item.image?.match(
        /(gendut-grosir)\/([a-zA-Z0-9]*)/gm
      )?.[0]
      console.log(item.image)
      this.deleteModal = true
    },
    async handleDelete() {
      this.loadingDelete = true
      const res = await this.$store.dispatch('product/deleteProduct', this.id)
      await this.$store.dispatch('uploadImages/deleteImages', this.publicId)
      if (res) {
        this.loadingDelete = false
        this.deleteModal = false
      } else {
        this.loadingDelete = false
      }
    },
    async openEditModal(item) {
      this.loadingEdit = item?._id
      const res = await this.$store.dispatch(
        'product/getProductById',
        item?._id
      )

      if (res) {
        this.imageFile = this.productDetails.image
        this.form = {
          ...this.productDetails,
          category: this.productDetails.category._id,
        }
        await this.getCategory(this.productDetails.category.name)
        this.editModal = true
        this.loadingEdit = ''
      } else {
        this.loadingEdit = ''
      }
    },
    async handleEdit() {
      this.loadingAdd = true
      await this.$store.dispatch('uploadImages/deleteImages', this.publicId)

      // Upload Image
      if (this.image) {
        const formData = new FormData()
        formData.append('image', this.image)
        formData.append('path', 'gendut-grosir')
        const res = await this.$store.dispatch(
          'uploadImages/uploadImages',
          formData
        )
        if (res) {
          this.form.image = this.imageUrl[0].url
        }
      }
      // Make body
      const body = {
        ...this.form,
      }
      const res = await this.$store.dispatch('product/editProduct', body)
      if (res) {
        this.loadingAdd = false
        this.editModal = false
        this.clearAll()
      } else {
        this.loadingAdd = false
      }
    },
    async getCategory(q) {
      this.loadingCategory = true
      const params = {
        q: q,
        page: this.page,
        limit: 25,
      }
      const res = await this.$store.dispatch('category/getCategory', params)
      if (res) {
        this.loadingCategory = false
      } else {
        this.loadingCategory = false
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
      this.form = {
        name: '',
        category: '',
        buyPrice: null,
        wholesalerPrice: null,
        retailPrice: null,
        barcode: null,
        image: null,
      }
      this.$v.form.$reset()
    },
  },
  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20),
        },
        category: {
          required,
        },
        buyPrice: {
          required,
          maxLength: maxLength(20),
          Number,
        },
        wholesalerPrice: {
          required,
          maxLength: maxLength(20),
          Number,
        },
        retailPrice: {
          required,
          maxLength: maxLength(20),
          Number,
        },
      },
    }
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
</style>
