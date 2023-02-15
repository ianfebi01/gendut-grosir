export const addCustomer = [
  {
    valueName: 'name',
    fieldType: 'textField',
    type: 'text',
    label: 'Name',
    placeholder: 'Masukkan Nama',
    validations: {
      required: true,
      minLength: 3,
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
      email: true,
    },
  },
  {
    valueName: 'role',
    fieldType: 'select',
    label: 'Role',
    placeholder: 'Pilih Role',
    items: [
      { name: 'Super Admin', value: 'super_admin' },
      { name: 'Admin', value: 'admin' },
      { name: 'Customer', value: 'customer' },
    ],
    validations: {
      required: true,
    },
  },
  {
    valueName: 'status',
    fieldType: 'select',
    label: 'Status',
    placeholder: 'Pilih status Customer',
    items: [
      { name: 'Sales', value: 'wholesaler' },
      { name: 'Retail', value: 'retail' },
    ],
  },
  {
    valueName: 'password',
    fieldType: 'textField',
    type: 'password',
    label: 'Password',
    placeholder: 'Masukan Password',
    validations: {
      required: true,
      minLength: 6,
    },
  },
  {
    valueName: 'confirmPassword',
    fieldType: 'textField',
    type: 'password',
    label: 'Konfirmasi Password',
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
    label: 'Aktifkan Akun?',
    placeholder: ['Aktif', 'Tidak Aktif'],
  },
]
export const editCustomer = [
  {
    valueName: 'name',
    fieldType: 'textField',
    type: 'text',
    label: 'Name',
    placeholder: 'Masukkan Nama',
    validations: {
      required: true,
      minLength: 3,
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
      email: true,
    },
  },
  {
    valueName: 'role',
    fieldType: 'select',
    label: 'Role',
    placeholder: 'Pilih Role',
    items: [
      { name: 'Super Admin', value: 'super_admin' },
      { name: 'Admin', value: 'admin' },
      { name: 'Customer', value: 'customer' },
    ],
    validations: {
      required: true,
    },
  },
  {
    valueName: 'status',
    fieldType: 'select',
    label: 'Status',
    placeholder: 'Pilih status Customer',
    items: [
      { name: 'Sales', value: 'wholesaler' },
      { name: 'Retail', value: 'retail' },
    ],
  },
  {
    valueName: 'activate',
    fieldType: 'switch',
    label: 'Aktifkan Akun?',
    placeholder: ['Aktif', 'Tidak Aktif'],
  },
]
