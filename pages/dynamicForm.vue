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
    <CustomField :datas="defaultFields" @handleSubmit="handleSubmit($event)" />
    <v-row class="px-6 pt-4">
      <v-col cols="6"
        ><div
          style="font-size: 14px"
          class="font-weight-medium mb-1 gray_700--text mt-2"
        >
          Object field
        </div>
        <pre>{{ defaultFields }}</pre>
      </v-col>
      <v-col cols="6">
        <div
          style="font-size: 14px"
          class="font-weight-medium mb-1 gray_700--text mt-2"
        >
          Hasil Form
        </div>
        <pre>{{ form }}</pre>
      </v-col>
    </v-row>
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
      form: {},
      defaultFields: [
        {
          valueName: 'name',
          fieldType: 'textField',
          type: 'text',
          label: 'Name',
          placeholder: 'Masukkan Nama',
          validations: {
            required: true,
            minLength: 6,
          },
        },
        {
          valueName: 'email',
          fieldType: 'textField',
          type: 'email',
          label: 'Email',
          placeholder: 'Masukkan Email',
          validations: {
            required: true,
            minLength: 6,
            email: true,
          },
        },
        {
          valueName: 'noHp',
          fieldType: 'textField',
          type: 'number',
          label: 'Nomor Hp',
          placeholder: 'Masukkan Nomor Hp Anda',
          validations: {
            required: true,
            minLength: 9,
            numeric: true,
          },
        },
        {
          valueName: 'gender',
          fieldType: 'select',
          label: 'Gender',
          placeholder: 'Pilih Gender',
          items: [
            {
              name: 'Pria',
              value: 'pria',
            },
            {
              name: 'Wanita',
              value: 'wanita',
            },
          ],
          validations: {
            required: true,
          },
        },
        {
          valueName: 'password',
          fieldType: 'textField',
          type: 'password',
          label: 'Password',
          placeholder: 'Enter Password',
          validations: {
            required: true,
            minLength: 6,
          },
        },
        {
          valueName: 'confirmPassword',
          fieldType: 'textField',
          type: 'password',
          label: 'Confirm Password',
          placeholder: 'Enter Confirm Password',
          validations: {
            required: true,
            minLength: 6,
            sameAs: 'password',
          },
        },
        {
          valueName: 'activate',
          fieldType: 'switch',
          label: 'Activate Acount',
          placeholder: ['Active', 'Not Active'],
        },
        {
          valueName: 'followUpdate',
          fieldType: 'checkbox',
          label: 'Pilih Layanan',
          checkboxItem: [
            {
              name: 'Pinjaman',
              value: 'pinjaman',
            },
            {
              name: 'Pinjol',
              value: 'pinjol',
            },
            {
              name: 'Kredit',
              value: 'kredit',
            },
          ],
        },
      ],
    }
  },
  methods: {
    handleSubmit(form) {
      this.form = form
    },
  },
}
</script>
