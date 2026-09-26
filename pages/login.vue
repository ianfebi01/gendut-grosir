<template>
  <v-container fluid style="height: 100vh; width: 100%" class="pa-0 ma-0">
    <v-row
      align="center"
      justify="center"
      style="height: 100% !important"
      class="px-0"
    >
      <v-col
        :cols="smAndDown ? '12' : '6'"
        align-self="center"
        :class="xs ? 'px-2' : 'px-16'"
        style="max-height:50vh,max-width:50vh"
      >
        <LoginForm
          :loading-props="loading"
          @setLoading="loading = $event"
          @handleLogin="handleLogin($event)"
        />
      </v-col>
      <v-col
        v-if="mdAndUp"
        cols="6"
        class="d-flex justify-center align-center bg-gray_100"
        style="background: $primary; height: 100%"
      >
        <v-img src="/shoping-cart.svg"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import LoginForm from '~/components/Form/LoginForm.vue'
import { useUserStore } from '~/stores/user'

export default {
  name: 'LoginPage',
  components: { LoginForm },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    accessToken() {
      return this.$route.query.access_token
    },
  },
  mounted() {
    if (this.accessToken) {
      useCookie('access_token').value = this.accessToken
      this.$router.push('/')
    }
  },
  methods: {
    async handleLogin(body) {
      this.loading = true
      const res = await useUserStore().login(body)
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

<script setup>
import { useDisplay } from 'vuetify'

definePageMeta({ layout: 'default' })

const { xs, smAndDown, mdAndUp } = useDisplay()
</script>
