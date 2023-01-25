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
        :loading="loading"
        :items-per-page="paginator?.perPage"
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
              Nama
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.name"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Masukkan nama"
              :hide-details="$v.form.name.$error ? false : true"
              :error-messages="
                !$v.form.name.required && $v.form.name.$dirty
                  ? 'Nama tidak boleh kosong'
                  : !$v.form.name.maxLength && $v.form.name.$dirty
                  ? 'Maximal 20 karakter'
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
              Email
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.email"
              background-color="#fff"
              outlined
              type="text"
              dense
              flat
              height="44"
              placeholder="Masukkan alamat email"
              :hide-details="$v.form.email.$error ? false : true"
              :error-messages="
                !$v.form.email.required && $v.form.email.$dirty
                  ? 'Email tidak boleh kosong'
                  : !$v.form.email.email && $v.form.email.$dirty
                  ? 'Format email salah'
                  : []
              "
              @blur="$v.form.email.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.email.$invalid && $v.form.email.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Role
              <span style="color: red !important">*</span>
            </div>
            <v-select
              v-model="form.role"
              :items="role"
              item-text="name"
              item-value="value"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Pilih Role"
              :hide-details="$v.form.role.$error ? false : true"
              :error-messages="
                !$v.form.role.required && $v.form.role.$dirty
                  ? 'Role tidak boleh kosong'
                  : []
              "
              @blur="$v.form.role.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.role.$invalid && $v.form.role.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-select>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Status
            </div>
            <v-select
              v-model="form.status"
              :items="status"
              item-text="name"
              item-value="value"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Pilih Status"
              hide-details
            >
            </v-select>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Password
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.password"
              outlined
              type="password"
              dense
              flat
              height="44"
              placeholder="Masukkan Password"
              :hide-details="$v.form.password.$error ? false : true"
              :error-messages="
                !$v.form.password.required && $v.form.password.$dirty
                  ? 'Password tidak boleh kosong'
                  : !$v.form.password.minLength && $v.form.password.$dirty
                  ? 'Minimum 6 karakter'
                  : []
              "
              @blur="$v.form.password.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.form.password.$invalid && $v.form.password.$dirty"
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
              Konfirmasi Password
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="form.confirmPassword"
              outlined
              type="password"
              dense
              flat
              height="44"
              placeholder="Masukkan Konfirmasi Password"
              :hide-details="$v.form.confirmPassword.$error ? false : true"
              :error-messages="
                !$v.form.confirmPassword.required &&
                $v.form.confirmPassword.$dirty
                  ? 'Password tidak boleh kosong'
                  : !$v.form.confirmPassword.minLength &&
                    $v.form.confirmPassword.$dirty
                  ? 'Minimum 6 karakter'
                  : !$v.form.confirmPassword.sameAsPassword &&
                    $v.form.confirmPassword.$dirty
                  ? 'Konfirmasi Password harus sama'
                  : []
              "
              @blur="$v.form.confirmPassword.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="
                    $v.form.confirmPassword.$invalid &&
                    $v.form.confirmPassword.$dirty
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
              Aktifkan Akun?
            </div>
            <v-switch
              v-model="form.activate"
              class="mt-3 ml-1"
              inset
              :label="form.activate ? 'Aktif' : 'Tidak Aktif'"
            ></v-switch>
          </v-col>
        </v-row>
      </template>
    </Modal>

    <!-- Edit -->
    <Modal
      title="Edit Product"
      width="800px"
      subtitle="Edit Product on your store"
      :loading="loadingAdd"
      :error-message="errorMessage"
      :modal-prop="editModal"
      :disable="$v.editForm.$invalid"
      @cancel="clearAll"
      @modalProp="editModal = false"
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
              Nama
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="editForm.name"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Masukkan nama"
              :hide-details="$v.editForm.name.$error ? false : true"
              :error-messages="
                !$v.editForm.name.required && $v.editForm.name.$dirty
                  ? 'Nama tidak boleh kosong'
                  : !$v.editForm.name.maxLength && $v.editForm.name.$dirty
                  ? 'Maximal 20 karakter'
                  : []
              "
              @blur="$v.editForm.name.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.editForm.name.$invalid && $v.editForm.name.$dirty"
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
              Email
              <span style="color: red !important">*</span>
            </div>
            <v-text-field
              v-model="editForm.email"
              background-color="#fff"
              outlined
              type="text"
              dense
              flat
              height="44"
              placeholder="Masukkan alamat email"
              :hide-details="$v.editForm.email.$error ? false : true"
              :error-messages="
                !$v.editForm.email.required && $v.editForm.email.$dirty
                  ? 'Email tidak boleh kosong'
                  : !$v.editForm.email.email && $v.editForm.email.$dirty
                  ? 'Format email salah'
                  : []
              "
              @blur="$v.editForm.email.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.editForm.email.$invalid && $v.editForm.email.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Role
              <span style="color: red !important">*</span>
            </div>
            <v-select
              v-model="editForm.role"
              :items="role"
              item-text="name"
              item-value="value"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Pilih Role"
              :hide-details="$v.editForm.role.$error ? false : true"
              :error-messages="
                !$v.editForm.role.required && $v.editForm.role.$dirty
                  ? 'Role tidak boleh kosong'
                  : []
              "
              @blur="$v.editForm.role.$touch()"
            >
              <template slot="append">
                <v-icon
                  v-if="$v.editForm.role.$invalid && $v.editForm.role.$dirty"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-select>
            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Status
            </div>
            <v-select
              v-model="editForm.status"
              :items="status"
              item-text="name"
              item-value="value"
              background-color="#fff"
              outlined
              dense
              flat
              height="44"
              placeholder="Pilih Status"
              hide-details
            >
            </v-select>

            <div
              class="font-weight-medium mb-1 gray_700--text mt-2"
              style="font-size: 14px"
            >
              Aktifkan Akun?
            </div>
            <v-switch
              v-model="editForm.activate"
              class="mt-3 ml-1"
              inset
              :label="editForm.activate ? 'Aktif' : 'Tidak Aktif'"
            ></v-switch>
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
  maxLength,
  email,
  sameAs,
} from 'vuelidate/lib/validators'

export default {
  name: 'Customers',
  components: { Search, Modal, Delete },
  layout: 'dashboard',
  data() {
    return {
      image: null,
      imageFile: null,
      loadingCategory: false,
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
      form: {
        id: null,
        name: '',
        email: '',
        role: '',
        status: '',
        activate: false,
        profilePicture: null,
        password: '',
        confirmPassword: '',
      },
      editForm: {
        id: null,
        name: '',
        email: '',
        role: '',
        status: '',
        activate: false,
        profilePicture: null,
      },
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
        { text: 'Role', value: 'role' },
        { text: 'Status', value: 'status' },
        { text: 'Activate', value: 'activate' },
        { text: 'Action', value: 'action' },
      ],
      role: [
        { name: 'Super Admin', value: 'super_admin' },
        { name: 'Admin', value: 'admin' },
        { name: 'Customer', value: 'customer' },
      ],
      status: [
        { name: 'Sales', value: 'wholesaler' },
        { name: 'Retail', value: 'retail' },
      ],
      loading: false,
      page: 1,
    }
  },
  head() {
    return {
      title: 'Gendut Grosir | Category',
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
      this.loading = true
      const params = {
        q: this.search,
        page: this.page,
        limit: 25,
      }
      const res = await this.$store.dispatch('user/getAllUser', params)
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
      const res = await this.$store.dispatch('user/getUserbyId', item?._id)

      if (res) {
        this.imageFile = this.userDetail.profilePicture
        this.editForm = {
          ...this.userDetail,
          id: this.userDetail._id,
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
  },
  validations() {
    return {
      form: {
        name: { required, maxLength: maxLength(20) },
        email: { required, email },
        role: { required },
        password: { required, minLength: minLength(6) },
        confirmPassword: {
          required,
          minLength: minLength(6),
          sameAsPassword: sameAs('password'),
        },
      },
      editForm: {
        name: { required, maxLength: maxLength(20) },
        email: { required, email },
        role: { required },
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
