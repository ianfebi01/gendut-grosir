<template>
  <v-col class="pa-0" style="max-width: 400px">
    <div
      class="font-weight-medium mb-1 gray_700--text mt-2"
      style="font-size: 14px"
    >
      Date
    </div>
    <v-text-field
      v-model="model"
      background-color="#fff"
      outlined
      dense
      flat
      height="44"
      disabled
      hide-details
      placeholder="Enter Product name"
    >
      <template slot="prepend-inner">
        <v-icon color="red"> $date</v-icon>
      </template>
    </v-text-field>
  </v-col>
</template>
<script>
export default {
  name: 'InputDate',
  props: {
    value: {
      type: String,
      default: 'DD/MM/YYYY',
    },
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
