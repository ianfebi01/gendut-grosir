/**
 * Shared input directives + helper methods.
 *
 * Migrated to Vue 3 / Nuxt 4:
 * - Vue 2 `bind` directive hook renamed to `beforeMount` (Vue 3 API).
 * - Default export keeps the old mixin shape (`{ directives, methods }`) so
 *   remaining Options-API consumers (`mixins: [directive]`) keep working.
 * - `inputDirectives` named export allows `<script setup>` components to
 *   register directives locally, e.g. `const vBarcode = inputDirectives.barcode`.
 */
export const inputDirectives = {
  types: {
    beforeMount(el, binding) {
      // this two prevent from copy&paste non-number text, including "e".
      // need to have both together to take effect.

      const { value: type } = binding
      el.type = ['tel', 'number'].includes(type) ? 'tel' : type
      el.addEventListener('input', () => {
        return el.validity?.valid || (el.value = '')
      })

      // this prevents from typing non-number text, including "e".
      el.addEventListener('keypress', (evt) => {
        evt = evt || window.event

        if (['tel', 'number'].includes(type)) {
          if (/^([0-9])/.test(evt.key)) {
            return true
          } else evt.preventDefault()
        } else return true
      })
    },
  },
  barcode: {
    beforeMount(el) {
      el.addEventListener('input', (e) => {
        // this prevents from typing non-number text, including "e".
        el.addEventListener('keypress', (evt) => {
          evt = evt || window.event

          if (/^([0-9])/.test(evt.key) && e.target.value.length < 13) {
            return true
          } else evt.preventDefault()
        })
      })
    },
  },
  numeric: {
    beforeMount(el) {
      // this two prevent from copy&paste non-number text, including "e".
      // need to have both together to take effect.
      el.type = 'tel'
      el.addEventListener('input', () => {
        return el.validity?.valid || (el.value = '')
      })

      // this prevents from typing non-number text, including "e".
      el.addEventListener('keypress', (evt) => {
        evt = evt || window.event
        const charCode = evt.which ? evt.which : evt.keyCode
        if (charCode < 48 || charCode > 57) evt.preventDefault()
        else return true
      })
    },
  },
  alphaName: {
    beforeMount(el) {
      el.addEventListener('input', () => {
        return el.validity?.valid || (el.value = '')
      })

      el.addEventListener('keypress', (evt) => {
        evt = evt || window.event
        const charCode = evt.which ? evt.which : evt.keyCode
        if (
          (charCode >= 65 && charCode <= 90) ||
          (charCode >= 95 && charCode <= 122) ||
          [32, 39, 46].includes(charCode)
        )
          return true
        else evt.preventDefault()
      })
    },
  },
  alpha: {
    beforeMount(el) {
      el.addEventListener('input', () => {
        return el.validity?.valid || (el.value = '')
      })

      el.addEventListener('keypress', (evt) => {
        evt = evt || window.event
        const charCode = evt.which ? evt.which : evt.keyCode
        if (
          (charCode >= 65 && charCode <= 90) ||
          (charCode >= 95 && charCode <= 122) ||
          charCode === 32
        )
          return true
        else evt.preventDefault()
      })
    },
  },
  alphaNumeric: {
    beforeMount(el) {
      el.addEventListener('input', () => {
        return el.validity?.valid || (el.value = '')
      })

      // this prevents from typing non-number text, including "e".
      el.addEventListener('keypress', (evt) => {
        evt = evt || window.event
        const charCode = evt.which ? evt.which : evt.keyCode
        const charStr = String.fromCharCode(charCode)
        if (/[a-z0-9]/i.test(charStr) || charCode === 32) return true
        else evt.preventDefault()
      })
    },
  },
  idCard: {
    beforeMount(el) {
      el.addEventListener('input', () => {
        return el.validity?.valid || (el.value = '')
      })

      // this prevents from typing non-number text, including "e".
      el.addEventListener('keypress', (evt) => {
        evt = evt || window.event
        const charCode = evt.which ? evt.which : evt.keyCode
        const charStr = String.fromCharCode(charCode)
        if (/[a-z0-9]/i.test(charStr)) return true
        else evt.preventDefault()
      })
    },
  },
}

export default {
  directives: inputDirectives,
  methods: {
    isNumber(evt) {
      evt = evt ? evt : window.event
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false
      } else {
        return true
      }
    },
    isText(evt) {
      evt = evt ? evt : window.event
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 65 || charCode > 90) &&
        (charCode < 97 || charCode > 122) &&
        charCode !== 32
      ) {
        return false
      } else {
        return true
      }
    },
    formatNumber(number = '') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      })
        .format(number || 0)
        .replace('Rp ', '')
    },
  },
}
