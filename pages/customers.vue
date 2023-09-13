<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text"> Customer </span>
      <v-spacer></v-spacer>
      <v-btn color="primary" height="44" dense depressed @click="modal = true">
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Tambah Customer
      </v-btn>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
        Kelola Customer Anda
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
        :loading="loading.data"
        :items-per-page="paginator?.limit"
        hide-default-footer
        no-data-text="No Data"
        class="data-table"
      >
        <template #[`item.status`]="item">
          <span>{{
            item?.item?.status == 'retail'
              ? 'Retail'
              : item?.item?.status == 'wholesaler'
              ? 'Sales'
              : '-'
          }}</span>
        </template>
        <template #[`item.profilePicture`]="item">
          <v-avatar size="40px">
            <v-img
              alt="avatar"
              lazy-src="lazy-loader.svg"
              :src="item?.item?.profilePicture"
            />
          </v-avatar>
        </template>
        <template #[`item.role.roleName`]="item">{{
          convertRoleString(item.item?.role?.roleName)
        }}</template>
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
            <span class="gray_700--text font-weight-medium">
              {{ 'Halaman ' + page + ' dari ' + paginator?.totalPages }}
            </span>

            <v-spacer></v-spacer>
            <v-btn
              outlined
              height="36"
              depressed
              dense
              :disabled="!paginator.hasPrevPage"
              @click="page--"
              >Sebelumnya</v-btn
            >
            <v-btn
              class="ml-2"
              outlined
              height="36"
              depressed
              dense
              :disabled="!paginator.hasNextPage"
              @click="page++"
              >Selanjutnya</v-btn
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
      :disable="$v.form.$invalid"
      @cancel="clearAll"
      @save="handleAdd"
      @clearErrorMessage="$store.set('user/errorMessage', '')"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="12" class="py-0">
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
              width="100%"
              height="208"
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
              <div
                v-else-if="imageFile"
                class="border"
                style="width: 200px; height: 200px; overflow: hidden"
              >
                <v-img
                  :src="imageFile"
                  aspect-ratio="1/1"
                  height="200"
                  width="200"
                ></v-img>
              </div>
            </v-card>
            <v-file-input
              ref="inputImage"
              accept="image/*"
              class="d-none"
              type="file"
              @change="imageInput"
            ></v-file-input>
          </v-col>

          <v-col
            v-for="(item, i) in addCustomer"
            :key="i"
            class="py-0"
            cols="12"
            md="6"
            lg="6"
            xl="6"
            sm="12"
          >
            <DynamicField
              v-model="form[item.valueName]"
              :item="item"
              :error-messages="error_message(item?.valueName)"
              @blur="$v.form[item.valueName].$touch()"
            >
              <template #autocomplete="{ errorMessages }">
                <v-autocomplete
                  v-model="form[item.valueName]"
                  :items="roles"
                  item-text="roleName"
                  item-value="_id"
                  background-color="#fff"
                  outlined
                  dense
                  flat
                  height="44"
                  placeholder="Pilih Role"
                  :loading="loading.roles"
                  :error-messages="error_message(item?.valueName)"
                  @focus="getRoles()"
                  @blur="$v.form[item.valueName].$touch()"
                >
                  <template slot="append">
                    <v-icon v-if="errorMessages[0]" color="red">
                      mdi-alert-circle-outline
                    </v-icon>
                  </template>
                </v-autocomplete>
              </template>
            </DynamicField>
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
      :disable="$v.editForm.$invalid"
      @cancel="clearAll"
      @save="handleEdit"
      @clearErrorMessage="$store.set('product/errorMessage', '')"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="12" class="py-0">
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
              width="100%"
              height="208"
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

                <span
                  class="text-center gray_500--text text-12 font-weight-normal pa-0"
                >
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </span>
              </div>
              <div
                v-else-if="imageFile"
                class="border"
                style="width: 200px; height: 200px; overflow: hidden"
              >
                <v-img
                  :src="imageFile"
                  aspect-ratio="1/1"
                  height="200"
                  width="200"
                ></v-img>
              </div>
            </v-card>
            <v-file-input
              ref="inputImage"
              accept="image/*"
              class="d-none"
              type="file"
              @change="imageInput"
            ></v-file-input>
          </v-col>

          <v-col
            v-for="(item, i) in editCustomer"
            :key="i"
            class="py-0"
            cols="12"
            md="6"
            lg="6"
            xl="6"
            sm="12"
          >
            <DynamicField
              v-model="editForm[item.valueName]"
              :item="item"
              :error-messages="error_message(item?.valueName)"
              @blur="$v.editForm[item.valueName].$touch()"
            >
              <template #autocomplete="{ errorMessages }">
                <v-autocomplete
                  v-model="editForm[item.valueName]"
                  :items="roles"
                  item-text="roleName"
                  item-value="_id"
                  background-color="#fff"
                  outlined
                  dense
                  flat
                  height="44"
                  placeholder="Pilih Role"
                  :loading="loading.roles"
                  :error-messages="error_message(item?.valueName)"
                  @focus="getRoles()"
                  @blur="$v.editForm[item.valueName].$touch()"
                >
                  <template slot="append">
                    <v-icon v-if="errorMessages[0]" color="red">
                      mdi-alert-circle-outline
                    </v-icon>
                  </template>
                </v-autocomplete>
              </template>
            </DynamicField>
          </v-col>
        </v-row>
      </template>
    </Modal>
    <Delete
      icon="$warning_delete"
      :loading="loadingDelete"
      :modal-prop="deleteModal"
      @modalProp="deleteModal = false"
      @ok="handleDelete()"
    />
  </v-container>
</template>

<script>
import Modal from '~/components/Dialog/Modal.vue'
import Delete from '~/components/Dialog/Delete.vue'
import Search from '~/components/Input/Search.vue'
import {
  required,
  minLength,
  numeric,
  email,
  sameAs,
} from 'vuelidate/lib/validators'
import DynamicField from '~/components/Input/DynamicField.vue'
import { addCustomer, editCustomer } from '~/utils/fields'
import { convertRoleString } from '@/utils/convertRoleString.js'

export default {
  name: 'Customers',
  components: { Search, Modal, Delete, DynamicField },
  layout: 'dashboard',
  data() {
    return {
      image: null,
      imageFile: null,
      loadingCategory: false,
      loadingEdit: false,
      loading: {
        roles: false,
        data: false,
      },
      id: '',
      editModal: false,
      publicId: null,
      deleteModal: false,
      modal: false,
      loadingDelete: false,
      loadingAdd: false,
      search: '',
      name: '',
      form: {},
      editForm: {},
      headers: [
        {
          text: 'Image',
          value: 'profilePicture',
        },
        {
          text: 'Name',
          value: 'name',
        },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role.roleName' },
        { text: 'Status', value: 'status' },
        { text: 'Activate', value: 'activate' },
        { text: 'Action', value: 'action' },
      ],

      page: 1,
    }
  },
  head() {
    return {
      title: 'Gendut Grosir | Customers',
    }
  },
  computed: {
    datas() {
      return this.$store.get('user/user')
    },
    paginator() {
      return this.$store.get('user/paginator')
    },
    errorMessage() {
      return this.$store.get('user/errorMessage')
    },
    imageUrl() {
      return this.$store.get('uploadImages/imageUrl')
    },
    userDetail() {
      return this.$store.get('user/userDetail')
    },
    addCustomer() {
      return addCustomer
    },
    editCustomer() {
      return editCustomer
    },
    roles() {
      return this.$store.get('role/roles')
    },
  },
  watch: {
    page() {
      this.getAllUser()
    },
  },
  mounted() {
    this.getAllUser()
  },
  methods: {
    async handleSearch() {
      await this.getAllUser()
    },
    async getAllUser() {
      this.loading.data = true
      const params = {
        q: this.search,
        page: this.page,
        limit: 25,
      }
      const res = await this.$store.dispatch('user/getAllUser', params)
      if (res) {
        this.loading.data = false
      } else {
        this.loading.data = false
      }
    },
    async handleAdd() {
      this.loadingAdd = true

      if (this.image) {
        const formData = new FormData()
        formData.append('image', this.image)
        formData.append('path', 'gendut-grosir/profile-picture')
        const res = await this.$store.dispatch(
          'uploadImages/uploadImages',
          formData
        )
        if (res) {
          this.form.profilePicture = this.imageUrl[0].url
        }
      }
      const body = { ...this.form }

      const res = await this.$store.dispatch('user/addUser', body)
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
      this.deleteModal = true
    },
    async handleDelete() {
      this.loadingDelete = true

      let res = await this.$store.dispatch('user/deleteUser', this.id)
      if (res) {
        this.loadingDelete = false
        this.deleteModal = false
        this.id = ''
      } else {
        this.loadingDelete = false
      }
    },
    async openEditModal(item) {
      this.loadingEdit = item?._id
      await this.getRoles()
      const res = await this.$store.dispatch('user/getUserbyId', item?._id)

      if (res) {
        this.imageFile = this.userDetail.profilePicture
        this.editForm = {
          ...this.userDetail,
          id: this.userDetail._id,
          role: this.userDetail.role?._id,
        }

        this.editModal = true
        this.loadingEdit = ''
      } else {
        this.loadingEdit = ''
      }
    },
    async handleEdit() {
      this.loadingAdd = true
      // delete Images
      if (this.publicId) {
        await this.$store.dispatch('uploadImages/deleteImages', this.publicId)
      }

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
          this.editForm.profilePicture = this.imageUrl[0].url
        }
      }
      // Make body
      const body = {
        ...this.editForm,
      }
      const res = await this.$store.dispatch('user/editUser', body)
      if (res) {
        this.loadingAdd = false
        this.editModal = false
        this.clearAll()
      } else {
        this.loadingAdd = false
      }
    },
    clearAll() {
      this.clearImage()
      this.publicId = ''
      this.form = {
        id: null,
        name: '',
        email: '',
        role: '',
        status: '',
        activate: false,
        image: null,
      }
      this.$v.form.$reset()
    },
    clearImage() {
      this.imageFile = null
      this.image = null
    },
    async clearImageEdit() {
      this.publicId = this.userDetail.image.match(
        /(gendut-grosir)\/([a-zA-Z0-9]*)/gm
      )[0]
      this.imageFile = null
      this.image = null
    },
    async imageInput(event) {
      this.image = event

      if (event) {
        this.imageFile = event ? URL.createObjectURL(event) : undefined // untuk nampilin di frontend
      }
    },
    error_message(param) {
      const errors = []

      Object.entries(this.editModal ? this.$v.editForm : this.$v.form).forEach(
        (entry) => {
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
            } = this.editModal ? this.$v.editForm[key] : this.$v.form[key]
            if (!$dirty) return errors
            // required
            required === false && errors.push('Field Tidak Boleh Kosong')
            // email
            email === false && errors.push(`Format email tidak valid`)
            // minLength
            minLength === false &&
              errors.push(`Input minimal ${$params.minLength.min} karakter`)
            // minLength
            numeric === false && errors.push(`Input hanya boleh angka`)
            // sameAs
            sameAs === false &&
              errors.push(`Input harus sama dengan ${$params?.sameAs?.eq}`)
          }
        }
      )
      return errors
    },
    async getRoles(q) {
      this.loading.roles = true
      const params = {
        q: q,
        page: this.page,
        limit: 25,
      }
      const res = await this.$store.dispatch('role/getRoles', params)
      if (res) {
        this.loading.roles = false
      } else {
        this.loading.roles = false
      }
    },
    convertRoleString(role) {
      return convertRoleString(role)
    },
  },
  validations() {
    const form = {}
    const editForm = {}
    let rule = {}
    this.addCustomer.forEach((item) => {
      rule = {}
      const { validations, valueName } = item
      if (validations?.required === true) rule.required = required
      if (validations?.email) rule.email = email
      if (validations?.minLength) {
        rule.minLength = minLength(validations.minLength)
      }
      if (validations?.numeric) {
        rule.numeric = numeric
      }
      if (validations?.sameAs) {
        rule.sameAs = sameAs(validations?.sameAs)
      }
      form[valueName] = rule
    })
    this.editCustomer.forEach((item) => {
      rule = {}
      const { validations, valueName } = item
      if (validations?.required === true) rule.required = required
      if (validations?.email) rule.email = email
      if (validations?.minLength) {
        rule.minLength = minLength(validations.minLength)
      }
      if (validations?.numeric) {
        rule.numeric = numeric
      }
      if (validations?.sameAs) {
        rule.sameAs = sameAs(validations?.sameAs)
      }
      editForm[valueName] = rule
    })
    return { form, editForm }
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
