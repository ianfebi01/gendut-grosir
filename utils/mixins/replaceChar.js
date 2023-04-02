export default {
  methods: {
    onlyNumber(text) {
      return text.replace(/\s|[^\d]/g, '')
    },
  },
}
