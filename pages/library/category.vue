<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text"> Kategori </span>
      <v-spacer></v-spacer>
      <v-btn color="primary" height="44" dense depressed @click="modal = true">
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Tambah Kategori
      </v-btn>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
        Lihat semua kategori uyntuk produk Anda
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
        :items="category"
        :loading="loading"
        :items-per-page="paginator?.limit"
        hide-default-footer
        no-data-text="No Data"
        class="data-table"
      >
        <template #[`item.action`]="item">
          <div>
            <v-btn
              fab
              text
              depressed
              small
              color="gray_500"
              @click="openEditModal(item?.item)"
              ><v-icon small>$edit</v-icon></v-btn
            >
            <v-btn
              fab
              text
              depressed
              small
              color="gray_500"
              @click="openDeleteModal(item?.item?._id)"
            >
              <v-icon small>$trash</v-icon>
            </v-btn>
          </div>
        </template>
        <template #footer>
          <div class="d-flex align-center text-14 my-4 mx-4">
            <span class="gray_700--text font-weight-medium">{{
              'Halaman ' + page + ' dari ' + paginator?.totalPages
            }}</span>
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
      title="Tambah Kategori"
      subtitle="Masukkan nama kategori"
      :loading="loadingCategory"
      :error-message="errorMessage"
      @cancel="name = ''"
      @save="handleAddCategory"
      @clearErrorMessage="$store.set('category/errorMessage', '')"
    >
      <template #content>
        <div
          class="font-weight-medium mb-1 gray_700--text"
          style="font-size: 14px"
        >
          Nama
        </div>
        <v-text-field
          v-model="name"
          background-color="#fff"
          outlined
          dense
          flat
          height="44"
          hide-details
          placeholder="Masukkan nama"
        >
        </v-text-field>
      </template>
    </Modal>

    <!-- Edit -->
    <Modal
      v-model="editModal"
      title="Edit Nama Kategori"
      subtitle="Masukkan nama kategori"
      :loading="loadingEdit"
      :error-message="errorMessage"
      @cancel="name = ''"
      @save="handleEdit()"
      @clearErrorMessage="$store.set('category/errorMessage', '')"
    >
      <template #content>
        <div
          class="font-weight-medium mb-1 gray_700--text"
          style="font-size: 14px"
        >
          Nama
        </div>
        <v-text-field
          v-model="name"
          background-color="#fff"
          outlined
          dense
          flat
          height="44"
          hide-details
          placeholder="Masukkan nama"
        >
        </v-text-field>
      </template>
    </Modal>
    <!-- DeleteModal -->
    <Delete
      v-model="deleteModal"
      icon="$warning_delete"
      :loading="loadingDeleteCategory"
      @ok="handleDelete()"
    />
  </v-container>
</template>

<script>
import Modal from '~/components/Dialog/Modal.vue'
import Delete from '~/components/Dialog/Delete.vue'
import Search from '~/components/Input/Search.vue'

export default {
  name: 'Category',
  components: { Search, Modal, Delete },
  layout: 'dashboard',
  data() {
    return {
      loadingEdit: false,
      id: '',
      editModal: false,
      deleteModal: false,
      modal: false,
      loadingDeleteCategory: false,
      loadingCategory: false,
      search: '',
      name: '',
      headers: [
        {
          text: 'Nama',
          value: 'name',
        },
        { text: 'Total Produk', value: 'totalProducts' },
        { text: 'Aksi', value: 'action', width: '150px' },
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
    category() {
      return this.$store.get('category/category')
    },
    paginator() {
      return this.$store.get('category/paginator')
    },
    errorMessage() {
      return this.$store.get('category/errorMessage')
    },
  },
  watch: {
    page() {
      this.getCategory()
    },
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    async handleSearch() {
      await this.getCategory()
    },
    async getCategory() {
      this.loading = true
      const params = {
        q: this.search,
        page: this.page,
        limit: 25,
      }
      const res = await this.$store.dispatch('category/getCategory', params)
      if (res) {
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async handleAddCategory() {
      this.loadingCategory = true
      const res = await this.$store.dispatch('category/postCategory', this.name)
      if (res) {
        this.loadingCategory = false
        this.modal = false
        this.name = ''
      } else {
        this.loadingCategory = false
      }
    },
    openDeleteModal(id) {
      this.id = id
      this.deleteModal = true
    },
    async handleDelete() {
      this.loadingDeleteCategory = true
      const res = await this.$store.dispatch('category/deleteCategory', this.id)
      if (res) {
        this.loadingDeleteCategory = false
        this.deleteModal = false
      } else {
        this.loadingDeleteCategory = false
      }
    },
    openEditModal(item) {
      this.editModal = true
      this.id = item?._id
      this.name = item?.name
    },
    async handleEdit() {
      this.loadingEdit = true
      const params = {
        id: this.id,
        name: this.name,
      }
      const res = await this.$store.dispatch('category/editCategory', params)
      if (res) {
        this.loadingEdit = false
        this.editModal = false
      } else {
        this.loadingEdit = false
      }
    },
  },
}
</script>
