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
import Delete from '~/components/Dialog/Delete.vue'
import Search from '~/components/Input/Search.vue'

export default {
  name: 'Customers',
  components: { Search, Delete },
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
      params: {
        q: '',
        page: 1,
        limit: 25,
      },
      headers: [
        {
          text: 'ID Order',
          value: '_id',
        },
        {
          text: 'Nama',
          value: 'user.name',
        },
        { text: 'Total Order', value: 'details.length' },
        { text: 'Status', value: 'user.status' },
        { text: 'Tanggal', value: 'createdAt' },
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
      return this.$store.get('order/order')
    },
    paginator() {
      return this.$store.get('order/paginator')
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
      this.loading = true

      const res = await this.$store.dispatch('order/getOrder', this.params)
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
