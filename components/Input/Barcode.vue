<template>
  <v-text-field
    id="barcode"
    ref="barcode"
    v-model="model"
    v-barcode
    background-color="#fff"
    outlined
    height="44px"
    dense
    flat
    :label="label && label"
    :placeholder="placeholder"
    :loading="loading"
    :error-messages="errorMessage"
    :success-messages="successMessage"
    @keyup.enter="$emit('handleBarcodeinput', value)"
  >
    <template #prepend-inner-icon>
      <v-icon size="25" class="mr-2">mdi-barcode</v-icon>
    </template>
    <template #prepend-inner>
      <v-icon size="25" class="mr-2">mdi-barcode</v-icon>
    </template></v-text-field
  >
</template>

<script>
import debounce from 'lodash/debounce'
import directive from '~/utils/directive'

export default {
  mixins: [directive],
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Cari',
    },
    label: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    successMessage: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
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
  methods: {
    debounceInput: debounce(function (event) {
      let q = event.target.value
      this.$emit('input', q)
    }, 500),
  },
}
</script>
<style lang="scss" scoped>
:deep(.v-label.v-label--active) {
  background: #fff;
  padding: 0 5px;
}
:deep(.v-label:not(v-label--active)) {
  transform: translateY(3px);
}
</style>
