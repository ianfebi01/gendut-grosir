<template>
  <v-data-table
    :headers="headers"
    :items="datas"
    hide-default-footer
    no-data-text="No Data"
    class="data-table"
  >
    <template v-if="readOnly" #[`item.productName`]="item">
      <p class="ma-0">{{ item?.item?.product?.name }}</p>
    </template>
    <template #[`item.action`]="item">
      <div>
        <v-btn
          fab
          text
          depressed
          small
          color="gray_500"
          @click="$emit('deleteProduct', item?.item.product)"
        >
          <v-icon small>$trash</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: 'ProductTable',
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    datas: {
      type: Array,
      default: () => [],
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
