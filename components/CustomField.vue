<template>
  <form @submit.prevent>
    <v-row class="px-6 mt-6">
      <v-col v-for="(item, i) in datas" :key="i" cols="12" sm="6" class="py-0">
        <div
          style="font-size: 14px"
          class="font-weight-medium mb-1 text-gray_700 mt-2"
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
          variant="outlined"
          density="compact"
          bg-color="#fff"
          height="44"
          :placeholder="item.placeholder"
          :error-messages="error_message(item?.valueName)"
          @blur="v$.form[item.valueName]?.$touch()"
        ></v-text-field>
        <v-select
          v-else-if="item.fieldType === 'select'"
          v-model="form[item.valueName]"
          :items="item.items"
          item-title="name"
          item-value="value"
          variant="outlined"
          density="compact"
          bg-color="#fff"
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
          variant="flat"
          block
          :disabled="v$.form.$invalid"
          @click="emit('handleSubmit', form)"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>
<script setup>
import { reactive, computed, toRef } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  minLength,
  numeric,
  email,
  sameAs,
} from '@vuelidate/validators'

defineOptions({ name: 'CustomField' })

const props = defineProps({
  datas: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['handleSubmit'])

const form = reactive({})

// Rules are derived from the `datas` field configs, mirroring the old
// Vuelidate 0.7 `validations()` builder. `sameAs` binds to the sibling
// field via `toRef` on the reactive form.
const rules = computed(() => {
  const fields = {}
  props.datas.forEach((item) => {
    const rule = {}
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
      rule.sameAs = sameAs(toRef(form, validations.sameAs))
    }

    fields[valueName] = rule
  })

  return { form: fields }
})
const v$ = useVuelidate(rules, { form })

function error_message(param) {
  const errors = []

  const field = v$.value.form?.[param]
  if (!field) return errors
  if (!field.$dirty) return errors

  // required
  field.required?.$invalid && errors.push('Field Tidak Boleh Kosong')
  // email
  field.email?.$invalid && errors.push(`Format email tidak valid`)
  // minLength
  field.minLength?.$invalid &&
    errors.push(`Input minimal ${field.minLength.$params?.min} karakter`)
  // numeric
  field.numeric?.$invalid && errors.push(`Input hanya boleh angka`)
  // sameAs
  field.sameAs?.$invalid && errors.push(`Input harus sama`)

  return errors
}
</script>
