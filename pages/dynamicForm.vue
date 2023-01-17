<template>
  <v-container fluid class="full-width-height gray_100">
    <v-row class="px-6 pt-4">
      <span class="text-30 font-weight-medium gray_900--text">
        Dynamic Form
      </span>
      <v-spacer></v-spacer>
      <v-btn color="primary" height="44" dense depressed @click="modal = true">
        <v-icon size="13" class="mr-2">$plus</v-icon>
        Tambah Customer
      </v-btn>
    </v-row>
    <v-row class="px-6">
      <span class="text-14 font-weight-normal gray_500--text">
        Membuat multiple row dengan object
      </span>
    </v-row>
    <CustomField :datas="defaultFields" />
  </v-container>
</template>
<script>
import CustomField from '~/components/CustomField.vue'
export default {
  name: 'DynamicForm',
  components: { CustomField },
  layout: 'dashboard',
  data() {
    return {
      defaultFields: [
        {
          valueName: 'valueName',
          fieldType: 'textField',
          type: 'text',
          label: 'Value Name',
          placeholder: 'Enter Value Name',
        },
        {
          valueName: 'type',
          fieldType: 'textField',
          type: 'text',
          label: 'Type',
          placeholder: 'Enter Field Type',
        },
        {
          valueName: 'placeholder',
          fieldType: 'textField',
          type: 'text',
          label: 'Placeholder',
          placeholder: 'Enter Placeholder',
        },
        {
          valueName: 'textField',
          fieldType: 'textField',
          type: 'text',
          label: 'Label',
          placeholder: 'Enter Label',
        },
        {
          valueName: 'required',
          fieldType: 'switch',
          label: 'Required',

          placeholder: ['Required', 'Not Required'],
        },
        {
          valueName: 'email',
          fieldType: 'switch',
          label: 'Email Validation',
          placeholder: ['Active', 'Not Active'],
        },
        {
          valueName: 'minLength',
          fieldType: 'textField',
          type: 'number',
          label: 'Min Length',
          placeholder: 'Enter Min Length',
          minLength: 6,
        },
        {
          valueName: 'fieldType',
          fieldType: 'select',
          items: [
            {
              name: 'Text Field',
              value: 'textField',
            },
            {
              name: 'Selector',
              value: 'select',
            },
            {
              name: 'Switch',
              value: 'switch',
            },
          ],
          type: 'text',
          label: 'Field Type',
          placeholder: 'Enter Field Type',
        },
      ],
    }
  },
}
</script>
