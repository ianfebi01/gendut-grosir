<template>
  <div>
    <span>gg</span>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'dashboard',
  mounted() {
    this.loginSuccess()
  },
  methods: {
    async loginSuccess() {
      this.loading = true
      const res = await this.$store.dispatch('user/getMe')
      if (res) {
        this.loading = false
      } else {
        this.loading = false
      }
    },
  },
}
</script>
