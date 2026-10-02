/**
 * Vuelidate 2 (`@vuelidate/core` + `@vuelidate/validators`) error helpers.
 *
 * Migrated from Vuelidate 0.7 (`this.$v`):
 * - Each validator node is now an object (`field.required.$invalid`,
 *   `field.minLength.$params.min`, ...) instead of a boolean.
 * - Methods accept the validation tree explicitly as the last argument and
 *   fall back to `this.v$` (Options API) so existing callers keep working
 *   once their component exposes `v$` from `useVuelidate()`.
 */
export default {
  methods: {
    error_message(param, v$ = this.v$?.form) {
      const errors = []

      if (!v$ || !v$[param]) return errors

      const field = v$[param]

      if (!field.$dirty) return errors

      // required
      field.required?.$invalid && errors.push('Field Tidak Boleh Kosong')
      // email
      field.email?.$invalid && errors.push(`Format email tidak valid`)
      // minLength
      field.minLength?.$invalid &&
        errors.push(
          `Input minimal ${field.minLength.$params?.min} karakter`
        )
      // maxLength
      field.maxLength?.$invalid &&
        errors.push(
          `Input maximal ${field.maxLength.$params?.max} karakter`
        )
      // numeric
      field.numeric?.$invalid && errors.push(`Input hanya boleh angka`)
      // sameAs
      field.sameAs?.$invalid && errors.push(`Input harus sama`)

      return errors
    },
    error_message_single(param, v$ = this.v$) {
      const errors = []

      if (!v$ || !v$[param]) return errors

      const field = v$[param]

      if (!field.$dirty) return errors

      // required
      field.required?.$invalid && errors.push('Field Tidak Boleh Kosong')
      // email
      field.email?.$invalid && errors.push(`Format email tidak valid`)
      // minLength
      field.minLength?.$invalid &&
        errors.push(
          `Input minimal ${field.minLength.$params?.min} karakter`
        )
      // maxLength
      field.maxLength?.$invalid &&
        errors.push(
          `Input maximal ${field.maxLength.$params?.max} karakter`
        )
      // numeric
      field.numeric?.$invalid && errors.push(`Input hanya boleh angka`)
      // sameAs
      field.sameAs?.$invalid && errors.push(`Input harus sama`)

      return errors
    },
  },
}
