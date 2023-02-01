export default {
  directives: {
    // grabscroll: {
    //   bind(el) {
    //     el.scrollTop = 100
    //     el.scrollLeft = 150

    //     let pos = { top: 0, left: 0, x: 0, y: 0 }

    //     const mouseDownHandler = function (e) {
    //       el.style.cursor = 'grabbing'
    //       el.style.userSelect = 'none'

    //       pos = {
    //         // The current scroll
    //         left: el.scrollLeft,
    //         top: el.scrollTop,
    //         // Get the current mouse position
    //         x: e.clientX,
    //         y: e.clientY,
    //       }

    //       el.addEventListener('mousemove', mouseMoveHandler)
    //       el.addEventListener('mouseup', mouseUpHandler)
    //     }
    //     const mouseMoveHandler = function (e) {
    //       const dx = e.clientX - pos.x
    //       const dy = e.clientY - pos.y

    //       // Scroll the element
    //       el.scrollTop = pos.top - dy
    //       el.scrollLeft = pos.left - dx
    //     }
    //     const mouseUpHandler = function () {
    //       document.removeEventListener('mousemove', mouseMoveHandler)
    //       document.removeEventListener('mouseup', mouseUpHandler)

    //       el.style.cursor = 'grab'
    //       el.style.removeProperty('user-select')
    //     }
    //   },
    // },
    types: {
      bind(el, binding) {
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
          console.log('KUE', evt)
          const charCode = evt.which ? evt.which : evt.keyCode
          if (['tel', 'number'].includes(type)) {
            if (charCode < 48 || charCode > 57) evt.preventDefault()
          } else return true
        })
      },
    },
    numeric: {
      bind(el) {
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
      bind(el) {
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
      bind(el) {
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
      bind(el) {
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
      bind(el) {
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
  },
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
