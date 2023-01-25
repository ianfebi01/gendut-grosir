<template>
  <form @submit.prevent>
    <v-row class="px-6 mt-6">
      <v-col v-for="(item, i) in datas" :key="i" cols="12" sm="6" class="py-0">
        <div
          style="font-size: 14px"
          class="font-weight-medium mb-1 gray_700--text mt-2"
        >
          {{ item.label }}
          <span v-if="item.validations?.required" style="color: red !important"
            >*</span
          >
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
          :error-messages="error_message(item?.valueName)"
          @blur="$v.form[item.valueName].$touch()"
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
          :label="
            item.validations?.required
              ? item.placeholder[0]
              : item.placeholder[1]
          "
        ></v-switch>

        <v-row v-else-if="item.fieldType === 'checkbox'">
          <v-col
            v-for="(item2, index) in item.checkboxItem"
            :key="index"
            cols="12"
            sm="4"
            md="4"
          >
            <v-checkbox
              v-model="form[item.valueName]"
              class="mt-0"
              :label="item2.name"
              color="primary"
              :value="item2.value"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-btn
          type="submit"
          height="44"
          color="primary"
          depressed
          block
          :disabled="$v.form.$invalid"
          @click="$emit('handleSubmit', form)"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>
<script>
import directive from '@/utils/directive'
import {
  required,
  minLength,
  numeric,
  email,
  sameAs,
} from 'vuelidate/lib/validators'
export default {
  name: 'CustomField',
  mixins: [directive],
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
  methods: {
    error_message(param) {
      const errors = []

      Object.entries(this.$v.form).forEach((entry) => {
        const [key] = entry

        if (key === param) {
          const {
            $dirty,
            $params,
            required,
            email,
            minLength,
            numeric,
            sameAs,
          } = this.$v.form[key]

          if (!$dirty) return errors

          // required
          required === false && errors.push('Field Tidak Boleh Kosong')
          // email
          email === false && errors.push(`Format email tidak valid`)
          // minLength
          minLength === false &&
            errors.push(`Input minimal ${$params.minLength.min} karakter`)
          // minLength
          numeric === false && errors.push(`Input hanya boleh angka`)
          // sameAs
          sameAs === false &&
            errors.push(`Input harus sama dengan ${$params?.sameAs?.eq}`)
        }
      })

      return errors
    },
  },
  validations() {
    const form = {}
    let rule = {}
    this.datas.forEach((item) => {
      rule = {}
      const { validations, valueName } = item

      if (validations?.required === true) rule.required = required
      if (validations?.email) rule.email = email
      if (validations?.minLength) {
        rule.minLength = minLength(validations.minLength)
      }
      if (validations?.numeric) {
        rule.numeric = numeric
      }
      if (validations?.sameAs) {
        rule.sameAs = sameAs(validations?.sameAs)
      }

      form[valueName] = rule
    })

    return { form }
  },
}
</script>
