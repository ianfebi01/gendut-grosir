<template>
  <v-data-table
    :headers="headers"
    :items="datas"
    :items-per-page="paginator?.limit"
    :loading="loading"
    hide-default-footer
    no-data-text="No Data"
    disable-sort
    class="data-table fixed-non-select-col"
  >
    <template #[`item.product`]="item">
      <div>
        <v-btn
          depressed
          small
          outlined
          @click="$emit('clickProduct', item?.item?.product)"
          >{{ item?.item?.product?.length + ' Produk' }}</v-btn
        >
      </div>
    </template>
    <template #[`item.date`]="item">
      {{ $formatDate(item?.item?.createdAt, 'with-clock') }}
    </template>
    <template #[`item.action`]="item">
      <div>
        <v-btn
          depressed
          small
          color="primary"
          :disabled="item?.item?.apply"
          :loading="loadingApply === item?.item?._id"
          @click="$emit('apply', item?.item?._id)"
        >
          Sesuaikan
        </v-btn>
      </div>
    </template>
    <template #footer>
      <div class="d-flex align-center text-14 my-4 mx-4">
        <span class="gray_700--text font-weight-medium">{{
          'Page ' + paginator?.page + ' of ' + paginator?.totalPages
        }}</span>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          height="36"
          depressed
          dense
          :disabled="!paginator.hasPrevPage"
          @click="$emit('previous')"
          >Previous</v-btn
        >
        <v-btn
          class="ml-2"
          outlined
          height="36"
          depressed
          dense
          :disabled="!paginator.hasNextPage"
          @click="$emit('next')"
          >Next</v-btn
        >
      </div>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: 'StockOpnameDataTable',
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    datas: {
      type: Array,
      default: () => [],
    },
    paginator: {
      type: Object,
      default: () => {},
    },
    loadingApply: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
