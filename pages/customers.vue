<template>
  <v-container fluid class="full-width-height bg-gray_100">
    <v-row class=" pt-4">
      <span class="text-30 font-weight-medium text-gray_900"> Customer </span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        height="44"
        density="compact"
        variant="flat"
        @click="modal = true"
      >
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Tambah Customer
      </v-btn>
    </v-row>
    <v-row class="">
      <span class="text-14 font-weight-normal text-gray_500">
        Kelola Customer Anda
      </span>
    </v-row>
    <v-row class=" pt-4">
      <Search
        v-model="search"
        style="max-width: 400px"
        @update:model-value="handleSearch"
      />
    </v-row>
    <v-row class=" pt-4">
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
              lazy-src="/lazy-loader.svg"
              :src="item?.item?.profilePicture"
            />
          </v-avatar>
        </template>
        <template #[`item.role.roleName`]="item">{{
          item.item?.role?.title
        }}</template>
        <template #[`item.action`]="item">
          <div>
            <v-btn
              icon
              variant="text"
              size="small"
              color="gray_500"
              :loading="item?.item._id === loadingEdit"
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
            <span class="text-gray_700 font-weight-medium">
              {{ 'Halaman ' + page + ' dari ' + paginator?.totalPages }}
            </span>

            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              height="36"
              density="compact"
              :disabled="!paginator.hasPrevPage"
              @click="page--"
              >Sebelumnya</v-btn
            >
            <v-btn
              class="ml-2"
              variant="outlined"
              height="36"
              density="compact"
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
      :disable="v$.form.$invalid"
      @cancel="clearAll"
      @save="handleAdd"
      @clearErrorMessage="clearUserError"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="12" class="py-0">
            <div
              class="font-weight-medium mb-1 text-gray_700"
              style="font-size: 14px"
            >
              Image
            </div>
            <v-card
              class="input-image"
              variant="outlined"
              width="100%"
              height="208"
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
                  Click to upload
                </span>
                <span class="text-gray_500 text-12 font-weight-normal pa-0">
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
              @blur="v$.form[item.valueName].$touch()"
            >
              <template #autocomplete="{ errorMessages }">
                <v-autocomplete
                  v-model="form[item.valueName]"
                  :items="roles"
                  item-title="roleName"
                  item-value="_id"
                  bg-color="#fff"
                  variant="outlined"
                  density="compact"
                  height="44"
                  placeholder="Pilih Role"
                  :loading="loading.roles"
                  :error-messages="error_message(item?.valueName)"
                  @focus="getRoles()"
                  @blur="v$.form[item.valueName].$touch()"
                >
                  <template #append>
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
      :disable="v$.editForm.$invalid"
      @cancel="clearAll"
      @save="handleEdit"
      @clearErrorMessage="clearUserError"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="12" class="py-0">
            <div
              class="font-weight-medium mb-1 text-gray_700"
              style="font-size: 14px"
            >
              Image
            </div>
            <v-card
              class="input-image"
              variant="outlined"
              width="100%"
              height="208"
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
                  Click to upload
                </span>

                <span
                  class="text-center text-gray_500 text-12 font-weight-normal pa-0"
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
              @blur="v$.editForm[item.valueName].$touch()"
            >
              <template #autocomplete="{ errorMessages }">
                <v-autocomplete
                  v-model="editForm[item.valueName]"
                  :items="roles"
                  item-title="roleName"
                  item-value="_id"
                  bg-color="#fff"
                  variant="outlined"
                  density="compact"
                  height="44"
                  placeholder="Pilih Role"
                  :loading="loading.roles"
                  :error-messages="error_message(item?.valueName)"
                  @focus="getRoles()"
                  @blur="v$.editForm[item.valueName].$touch()"
                >
                  <template #append>
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
      v-model="deleteModal"
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
} from '@vuelidate/validators'
import { computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import DynamicField from '~/components/Input/DynamicField.vue'
import { addCustomer, editCustomer } from '~/utils/fields'
import { useUserStore } from '~/stores/user'
import { useRoleStore } from '~/stores/role'
import { useUploadImagesStore } from '~/stores/uploadImages'

export default {
  name: 'Customers',
  components: { Search, Modal, Delete, DynamicField },
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
      v$: null,
      headers: [
        {
          title: 'Image',
          value: 'profilePicture',
        },
        {
          title: 'Name',
          value: 'name',
        },
        { title: 'Email', value: 'email' },
        { title: 'Role', value: 'role.roleName' },
        { title: 'Status', value: 'status' },
        { title: 'Activate', value: 'activate' },
        { title: 'Action', value: 'action' },
      ],

      page: 1,
    }
  },
  computed: {
    datas() {
      return useUserStore().user
    },
    paginator() {
      return useUserStore().paginator
    },
    errorMessage() {
      return useUserStore().errorMessage
    },
    imageUrl() {
      return useUploadImagesStore().imageUrl
    },
    userDetail() {
      return useUserStore().userDetail
    },
    addCustomer() {
      return addCustomer
    },
    editCustomer() {
      return editCustomer
    },
    roles() {
      return useRoleStore().roles
    },
  },
  watch: {
    page() {
      this.getAllUser()
    },
  },
  created() {
    // Explicit useVuelidate args: the watcher runs immediately, so the
    // validation tree exists during SSR (the no-arg + validations() path
    // only populates in onBeforeMount, which never runs on the server).
    const buildRules = (fields, getState) => {
      const rules = {}
      fields.forEach((item) => {
        const rule = {}
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
          rule.sameAs = sameAs(
            computed(() => getState()?.[validations.sameAs]),
            validations.sameAs
          )
        }
        rules[valueName] = rule
      })
      return rules
    }
    this.v$ = useVuelidate(
      {
        form: buildRules(addCustomer, () => this.form),
        editForm: buildRules(editCustomer, () => this.editForm),
      },
      { form: this.form, editForm: this.editForm }
    )
  },
  mounted() {
    this.getAllUser()
  },
  methods: {
    clearUserError() {
      useUserStore().errorMessage = ''
    },
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
      const res = await useUserStore().getAllUser(params)
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
        const res = await useUploadImagesStore().uploadImages(formData)
        if (res) {
          this.form.profilePicture = this.imageUrl[0].url
        }
      }
      const body = { ...this.form }

      const res = await useUserStore().addUser(body)
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

      const res = await useUserStore().deleteUser(this.id)
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
      const res = await useUserStore().getUserbyId(item?._id)

      if (res) {
        this.imageFile = this.userDetail.profilePicture
        Object.keys(this.editForm).forEach((k) => delete this.editForm[k])
        Object.assign(this.editForm, {
          ...this.userDetail,
          id: this.userDetail._id,
          role: this.userDetail.role?._id,
        })

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
        await useUploadImagesStore().deleteImages(this.publicId)
      }

      // Upload Image
      if (this.image) {
        const formData = new FormData()
        formData.append('image', this.image)
        formData.append('path', 'gendut-grosir')
        const res = await useUploadImagesStore().uploadImages(formData)
        if (res) {
          this.editForm.profilePicture = this.imageUrl[0].url
        }
      }
      // Make body
      const body = {
        ...this.editForm,
      }
      const res = await useUserStore().editUser(body)
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
      Object.keys(this.form).forEach((k) => delete this.form[k])
      Object.assign(this.form, {
        id: null,
        name: '',
        email: '',
        role: '',
        status: '',
        activate: false,
        image: null,
      })
      this.v$.form.$reset()
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
      const file = Array.isArray(event) ? event[0] : event
      this.image = file

      if (file) {
        this.imageFile = file ? URL.createObjectURL(file) : undefined // untuk nampilin di frontend
      }
    },
    error_message(param) {
      const errors = []
      const field = this.editModal
        ? this.v$.editForm[param]
        : this.v$.form[param]

      if (!field || !field.$dirty) return errors
      // required
      field.required?.$invalid && errors.push('Field Tidak Boleh Kosong')
      // email
      field.email?.$invalid && errors.push(`Format email tidak valid`)
      // minLength
      field.minLength?.$invalid &&
        errors.push(`Input minimal ${field.minLength.$params.min} karakter`)
      // numeric
      field.numeric?.$invalid && errors.push(`Input hanya boleh angka`)
      // sameAs
      field.sameAs?.$invalid &&
        errors.push(
          `Input harus sama dengan ${field.sameAs.$params.otherName}`
        )
      return errors
    },
    async getRoles(q) {
      this.loading.roles = true
      const params = {
        q,
        page: this.page,
        limit: 25,
      }
      const res = await useRoleStore().getRoles(params)
      if (res) {
        this.loading.roles = false
      } else {
        this.loading.roles = false
      }
    },
  },
}
</script>

<script setup>
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Gendut Grosir | Customers' })
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
