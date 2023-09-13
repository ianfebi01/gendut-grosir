<template>
  <div>
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text">
        {{ title }}
      </span>
      <v-spacer></v-spacer>

      <slot name="actions" />
      <v-btn
        v-if="actions"
        color="primary"
        height="44"
        dense
        depressed
        @click="modal = true"
      >
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Tambah Customer
      </v-btn>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
        {{ subtitle }}
      </span>
    </v-row>
    <v-row class="px-6 pt-4">
      <Search
        v-model="search"
        style="max-width: 400px"
        @input="$emit('search', search)"
      />
    </v-row>
  </div>
</template>
<script>
import Search from '../Input/Search.vue'

export default {
  name: 'PageHeader',
  components: { Search },
  props: {
    actions: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'Title',
    },
    subtitle: {
      type: String,
      default: 'Subtitle',
    },
  },
  data() {
    return {
      search: '',
    }
  },
}
</script>
