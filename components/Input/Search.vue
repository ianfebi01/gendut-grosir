<template>
  <v-text-field
    id="search"
    :value="value"
    :placeholder="placeholder"
    background-color="#fff"
    hide-details
    outlined
    height="44px"
    dense
    flat
    @keyup="debounceInput($event)"
  >
    <template #prepend-inner-icon>
      <v-icon size="15" class="mr-2">$magnify</v-icon>
    </template>
    <template #prepend-inner>
      <v-icon size="15" class="mr-2">$magnify</v-icon>
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
  },
  methods: {
    debounceInput: debounce(function (event) {
      let q = event.target.value
      this.$emit('input', q)
    }, 500),
  },
}
</script>
