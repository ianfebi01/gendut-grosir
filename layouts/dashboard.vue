<template>
  <div>
    <client-only>
      <v-overlay slot="placeholder" :value="true" opacity="1" color="#ffffff">
        <v-progress-circular
          indeterminate
          size="35"
          color="#7F56D9"
        ></v-progress-circular>
      </v-overlay>
      <v-app>
        <Sidebar />
        <HeaderApp />
        <v-main>
          <nuxt />
        </v-main>
      </v-app>
    </client-only>
  </div>
</template>
<script>
export default {
  name: 'DashboardLayout',
  components: {
    Sidebar: () => import('@/components/Layout/Sidebar'),
    HeaderApp: () => import('@/components/Layout/Header'),
  },
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
