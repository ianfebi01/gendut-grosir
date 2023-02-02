<template>
  <v-container
    fluid
    style="height: 100vh; width: 100%"
    class="pa-0 ma-0"
    fill-height
  >
    <v-row
      align="center"
      justify="center"
      style="height: 100% !important"
      class="px-0"
    >
      <v-col
        :cols="$vuetify.breakpoint.smAndDown ? '12' : '6'"
        align-self="center"
        :class="$vuetify.breakpoint.xs ? 'px-2' : 'px-16'"
        style="max-height:50vh,max-width:50vh"
      >
        <LoginForm
          :loading-props="loading"
          @setLoading="loading = $event"
          @handleLogin="handleLogin($event)"
        />
      </v-col>
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="6"
        class="d-flex justify-center align-center gray_100"
        style="background: $primary; height: 100%"
      >
        <v-img src="/shoping-cart.svg"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import LoginForm from '~/components/Form/LoginForm.vue'
export default {
  name: 'LoginPage',
  components: { LoginForm },
  layout: 'default',
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    accessToken() {
      return this.$route.query.access_token
    },

    tes() {
      return this.$store.get('user/name')
    },
  },
  mounted() {
    if (this.accessToken) {
      this.$cookiz.set('access_token', this.accessToken)
      this.$router.push('/')
    }
  },
  methods: {
    async handleLogin(body) {
      this.loading = true
      const res = await this.$store.dispatch('user/login', body)
      if (res) {
        this.loading = false
        this.$router.push('/')
      } else {
        this.loading = false
      }
    },
  },
}
</script>
