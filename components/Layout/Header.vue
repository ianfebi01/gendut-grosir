<template>
  <v-app-bar color="white" :elevation="0" :height="72">
    <div class="d-flex align-center" style="width: 100%">
      <v-app-bar-nav-icon
        color="gray_700"
        @click.stop="toggleDrawer"
      ></v-app-bar-nav-icon>

      <v-row
        class="brand d-flex flex-column align-center justify-center"
        no-gutters
      >
        <!-- Place your own logo here -->
        <img src="/logo.svg" alt="Logo GG" />
      </v-row>

      <v-badge
        v-if="router == '/'"
        bordered
        color="primary"
        :model-value="!!cart?.length"
        :content="cart?.length"
      >
        <v-btn
          v-if="router == '/'"
          icon
          size="small"
          density="compact"
          variant="text"
          @click="openCart"
        >
          <v-icon color="gray_700" size="20">$cart</v-icon>
        </v-btn>
      </v-badge>
    </div>
    <!-- <div class="d-flex align-center" style="width: 100%">gg</div> -->
  </v-app-bar>
</template>

<script>
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'

export default {
  name: 'HeaderApp',

  props: { logoutButton: { type: String, default: 'bottom' } },
  data() {
    return {
      search: '',
    }
  },
  computed: {
    drawer() {
      return useAppStore().drawer
    },
    user() {
      return useUserStore().profile
    },
    width() {
      return typeof window !== 'undefined' ? window.screen.width : 0
    },
    router() {
      return this.$route.path
    },
    cart() {
      return useOrderStore().cart
    },
  },
  mounted() {},
  methods: {
    toggleDrawer() {
      useAppStore().toggleDrawer()
    },
    openCart() {
      useOrderStore().setModalCart(true)
    },
  },
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/abstracts/mixins' as m;
/*
  If you don't need a global css, please don't add css in `assets` folder.
  Use this method instead, with `scoped` props.
  */

.small-btn {
  font-size: 12px;
}
</style>
