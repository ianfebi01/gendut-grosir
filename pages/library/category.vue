<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text"> Category </span>
      <v-spacer></v-spacer>
      <v-btn color="primary" height="44" dense depressed>
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Add Category</v-btn
      >
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
        See all category for your product
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
        :items-per-page="paginator?.perPage"
        hide-default-footer
        no-data-text="No Data"
        class="data-table"
      >
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
  </v-container>
</template>

<script>
import Search from '~/components/Input/Search.vue'

export default {
  name: 'Category',
  components: { Search },
  layout: 'dashboard',
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        { text: 'Total Product', value: 'totalProducts' },
        { text: 'Total Order', value: 'order' },
        { text: 'Action', value: 'action' },
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
  },
}
</script>
