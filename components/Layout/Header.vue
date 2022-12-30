<template>
  <div>
    <v-app-bar app color="white" flat height="70px">
      <div class="d-flex align-center" style="width: 100%">
        <v-app-bar-nav-icon
          color="gray_700"
          tile
          @click.stop="$store.set('drawer', !drawer)"
        ></v-app-bar-nav-icon>
        <v-list
          width="100%"
          class="py-0 ml-2 d-flex flex-column justify-center align-center"
        >
          <v-list-item-group
            class="d-flex align-center"
            style="gap: 8px; width: 100%; max-width: 800px"
          >
            <Search v-model="search" @input="handleSearch($event)" />
            <v-btn fab dense small depressed text
              ><v-icon color="gray_700" size="20">$cart</v-icon></v-btn
            >
          </v-list-item-group>
        </v-list>
      </div>
      <!-- <div class="d-flex align-center" style="width: 100%">gg</div> -->
    </v-app-bar>
  </div>
</template>

<script>
import Search from '../Input/Search.vue'
export default {
  name: 'HeaderApp',
  components: { Search },
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
  },
  mounted() {},
  methods: {
    handleSearch(search) {
      console.log(search)
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
