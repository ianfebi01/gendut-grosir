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
        <RegisterForm :loading="loading" />
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
import RegisterForm from '~/components/Form/RegisterForm.vue'
import { useRoleStore } from '~/stores/role'

export default {
  name: 'LoginPage',
  components: { RegisterForm },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    accessToken() {
      return this.$route.query.access_token
    },
    errorMessageUrl() {
      return this.$route.query.error_message
    },
  },
  mounted() {
    if (this.accessToken) {
      useCookie('access_token').value = this.accessToken
      this.$router.push('/')
    } else {
      this.getRoles()
    }
  },
  methods: {
    async getRoles() {
      await useRoleStore().getRoles()
    },
  },
}
</script>

<script setup>
import { useDisplay } from 'vuetify'

definePageMeta({ layout: 'default' })

const { xs, smAndDown, mdAndUp } = useDisplay()
</script>
