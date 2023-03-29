export default {
  data() {
    return {
      gg: 'ian',
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
            maxLength,
          } = this.$v.form[key]
          if (!$dirty) return errors
          // required
          required === false && errors.push('Field Tidak Boleh Kosong')
          // email
          email === false && errors.push(`Format email tidak valid`)
          // minLength
          minLength === false &&
            errors.push(`Input minimal ${$params.minLength.min} karakter`)
          maxLength === false &&
            errors.push(`Input maximal ${$params.maxLength.max} karakter`)
          // minLength
          numeric === false && errors.push(`Input hanya boleh angka`)
          // sameAs
          sameAs === false &&
            errors.push(`Input harus sama dengan ${$params?.sameAs?.eq}`)
        }
      })
      return errors
    },
    error_message_single(param) {
      const errors = []

      const {
        $dirty,
        $params,
        required,
        email,
        minLength,
        numeric,
        sameAs,
        maxLength,
      } = this.$v[param]
      if (!$dirty) return errors
      // required
      required === false && errors.push('Field Tidak Boleh Kosong')
      // email
      email === false && errors.push(`Format email tidak valid`)
      // minLength
      minLength === false &&
        errors.push(`Input minimal ${$params.minLength.min} karakter`)
      maxLength === false &&
        errors.push(`Input maximal ${$params.maxLength.max} karakter`)
      // minLength
      numeric === false && errors.push(`Input hanya boleh angka`)
      // sameAs
      sameAs === false &&
        errors.push(`Input harus sama dengan ${$params?.sameAs?.eq}`)

      return errors
    },
  },
}
