<template>
  <v-row class="px-6 mt-6">
    <template v-for="(item, i) in datas">
      <v-col :key="i" cols="12" lg="3" md="4" sm="6" class="py-0">
        <div
          style="font-size: 14px"
          class="font-weight-medium mb-1 gray_700--text mt-2"
        >
          {{ item.label }}
          <span v-if="item.required" style="color: red !important">*</span>
        </div>
        <v-text-field
          v-if="item.fieldType === 'textField'"
          v-model="form[item.valueName]"
          :type="item.type"
          outlined
          dense
          flat
          background-color="#fff"
          height="44"
          :placeholder="item.placeholder"
          hide-details
        ></v-text-field>
        <v-select
          v-else-if="item.fieldType === 'select'"
          v-model="form[item.valueName]"
          :items="item.items"
          item-text="name"
          item-value="value"
          outlined
          dense
          flat
          background-color="#fff"
          height="44"
          :placeholder="item.placeholder"
          hide-details
        ></v-select>
        <v-switch
          v-else-if="item.fieldType === 'switch'"
          v-model="form[item.valueName]"
          class="mt-3 ml-1"
          inset
          :label="item.required ? item.placeholder[0] : item.placeholder[1]"
        ></v-switch>

        <v-row v-else-if="item.fieldType === 'checkbox'">
          <v-col cols="12" sm="4" md="4">
            <v-checkbox
              v-model="form[item.valueName]"
              class="mt-0"
              label="red"
              color="red"
              value="red"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </template>
    <pre>{{ form }}</pre>
  </v-row>
</template>
<script>
import {
  required,
  minLength,
  maxLength,
  email,
  sameAs,
} from 'vuelidate/lib/validators'
export default {
  name: 'CustomField',
  props: {
    datas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {},
    }
  },
  watch: {
    '$v.form'(newVal) {
      console.log(newVal)
    },
  },
  validations() {
    return {}
  },
}
</script>
