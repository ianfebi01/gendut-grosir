<template>
  <div>
    <v-app-bar
      app
      color="white"
      style="box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.06) !important"
    >
      <div class="d-flex justify-center px-4">
        <v-app-bar-nav-icon
          color="#292E30"
          tile
          @click.stop="$store.set('drawer', !drawer)"
        ></v-app-bar-nav-icon>
      </div>

      <template v-if="logoutButton === 'bottom'">
        <v-layout class="userinfo pl-8" justify-end>
          <div class="userinfo__container">
            <v-avatar class="userinfo__container--avatar" size="40" tile>
              <v-img :src="user.profilePicture"></v-img>
            </v-avatar>
          </div>
          <div class="mt-3">
            <p class="userinfo__name">{{ user?.name }}</p>
            <p class="userinfo__role">{{ user?.role }}</p>
          </div>
        </v-layout>
      </template>

      <template v-else-if="logoutButton === 'top'">
        <v-spacer />
        <v-list color="transparent">
          <v-menu bottom offset-y>
            <template #activator="{ on, attrs }">
              <v-list-item
                link
                v-bind="attrs"
                style="border-left: 1px solid #d9d9d9; margin: 0px 10px"
                max-width="265"
                v-on="on"
              >
                <div
                  class="userinfo d-flex justify-center"
                  @click="$router.push('/admin/profile')"
                >
                  <div class="userinfo__container">
                    <v-avatar
                      class="userinfo__container--avatar"
                      size="40"
                      rounded
                    >
                      <span class="black--text">
                        {{ String(profile.username).substring(0, 3) }}
                      </span>
                    </v-avatar>
                  </div>
                  <div class="mt-3">
                    <p class="userinfo__name text-center">{{ profile.name }}</p>
                    <p class="userinfo__role">{{ profile.role }}</p>
                  </div>
                </div>
              </v-list-item>
            </template>
          </v-menu>
        </v-list>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'HeaderApp',
  filters: {
    /**
     * Get first character from user's firstname & middlename / lastname.
     */
    getFirstChar(char) {
      let returnChar = ''

      if (char !== '') {
        const splitChar = char.split(' ')
        if (splitChar.length === 1) {
          returnChar = splitChar[0][0]
        } else if (splitChar.length > 1) {
          returnChar = `${splitChar[0][0]}${splitChar[1][0]}`
        } else {
          returnChar = ''
        }
      } else {
        returnChar = ''
      }

      return returnChar
    },
  },
  props: { logoutButton: { type: String, default: 'bottom' } },
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
    profile() {
      return this.$store.get('admin.users/profile')
    },
  },
  mounted() {
    this.getProfile()
  },
  methods: {
    handleLogout() {
      this.$logout('/admin')
      window.location.replace(this.$config.logoutUrl)
    },
    async getProfile() {
      await this.$store.dispatch('admin/users/getProfile')
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
.userinfo {
  width: 100%;
  /* max-width: 265px; */
  /* border-left: 1px solid #d9d9d9; */
  /* padding: 0px 20px;
    margin: 0 12px; */
  /* padding-left: 20px !important; */

  @include m.element('container') {
    /* border-left: 1px solid #e6e6e6; */
    padding: 10px;

    @include m.modifier('avatar') {
      /* background: linear-gradient(
          104deg,
          rgb(61, 141, 233) 0%,
          rgb(119, 194, 238) 35%,
          rgb(6, 90, 185) 100%
        ); */
      background: #f3f3f3;
      /* border-radius: 8px; */
      border-radius: 50% !important;
    }
  }

  @include m.element('name') {
    margin-bottom: 0;
    font-size: 14px;
    color: #333333;
    font-weight: bold;
  }

  @include m.element('role') {
    margin-bottom: 0;
    font-size: 10px;
    color: #828282;
  }
}
</style>
