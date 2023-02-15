<template>
  <div>
    <div
      style="font-size: 14px"
      class="font-weight-medium mb-1 gray_700--text mt-2"
    >
      {{ item?.label }}
      <span v-if="item?.validations?.required" style="color: red !important"
        >*</span
      >
    </div>
    <v-text-field
      v-if="item?.fieldType === 'textField'"
      v-model="model"
      v-types="item?.type"
      :type="item?.type"
      outlined
      dense
      flat
      background-color="#fff"
      height="44"
      :hide-details="errorMessages == ''"
      :placeholder="item?.placeholder"
      :error-messages="errorMessages"
      @blur="$emit('blur')"
    ></v-text-field>
    <v-select
      v-else-if="item?.fieldType === 'select'"
      v-model="model"
      :items="item?.items"
      item-text="name"
      item-value="value"
      outlined
      dense
      flat
      background-color="#fff"
      height="44"
      :placeholder="item?.placeholder"
      :error-messages="errorMessages"
      @blur="$emit('blur')"
    ></v-select>
    <v-switch
      v-else-if="item?.fieldType === 'switch'"
      v-model="model"
      class="mt-3 ml-1"
      inset
      :label="
        item?.validations?.required
          ? item?.placeholder[0]
          : item?.placeholder[1]
      "
      :error-messages="errorMessages"
      @blur="$emit('blur')"
    ></v-switch>

    <v-row v-else-if="item?.fieldType === 'checkbox'">
      <v-col
        v-for="(item2, index) in item?.checkboxitem"
        :key="index"
        cols="12"
        sm="4"
        md="4"
      >
        <v-checkbox
          v-model="model"
          :label="item2.name"
          color="primary"
          :value="item2.value"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import directive from '@/utils/directive'

export default {
  name: 'CustomField',
  mixins: [directive],
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {},
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },
  },
  methods: {},
}
</script>
