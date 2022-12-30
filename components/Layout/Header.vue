<template>
  <div>
    <v-app-bar app color="white" flat height="72px">
      <div class="d-flex align-center" style="width: 100%">
        <v-app-bar-nav-icon
          color="gray_700"
          tile
          @click.stop="$store.set('drawer', !drawer)"
        ></v-app-bar-nav-icon>

        <v-layout
          class="brand d-flex flex-column align-center justify-center"
          align-center
          justify-center
        >
          <!-- Place your own logo here -->
          <img src="/logo.svg" alt="Logo GG" />
        </v-layout>
        <v-btn v-if="router == '/'" fab dense small depressed text
          ><v-icon color="gray_700" size="20">$cart</v-icon></v-btn
        >
      </div>
      <!-- <div class="d-flex align-center" style="width: 100%">gg</div> -->
    </v-app-bar>
  </div>
</template>

<script>
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
      return this.$store.get('drawer')
    },
    user() {
      return this.$store.get('user/profile')
    },
    width() {
      return screen.width
    },
    router() {
      return this.$route.path
    },
  },
  mounted() {},
  methods: {},
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
