<template>
  <div>
    <v-navigation-drawer
      :value="drawer"
      app
      color="bg_sidebar"
      width="280"
      dark
      style="height: 100svh"
    >
      <v-layout
        class="brand d-flex flex-column align-center justify-center"
        align-center
        justify-center
      >
        <!-- Place your own logo here -->
        <img src="/logo-light.svg" alt="Logo GG" />
      </v-layout>

      <!-- <v-divider></v-divider> -->

      <v-list class="list mt-4" dense>
        <v-list-item-group :value="menus.activeMenu" color="gray_100">
          <template v-for="menu in menus.filteredMenu">
            <template v-if="!menu.children">
              <v-list-item
                :id="menu.name"
                :key="menu.name"
                :value="menu.name"
                style="margin-top: 8px"
                :class="{ list__active: menus.activeMenu === menu.name }"
                link
                @click="$router.push(menu.url)"
              >
                <v-list-item-action v-if="menu.name === 'Sign Out'">
                  <v-icon color="gray_300">{{ menu.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-action v-else>
                  <v-icon color="gray_300" class="gray_300--text">{{
                    menu.icon
                  }}</v-icon>
                </v-list-item-action>
                <v-list-item-content v-if="menu.name === 'Sign Out'">
                  <v-list-item-title class="gray_100--text">{{
                    menu.title
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content v-else>
                  <v-list-item-title class="gray_100--text">{{
                    menu.title
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <template v-else-if="menu.children">
              <v-list-group
                :key="menu.name"
                :value="isSubmenuOpen(menu.url)"
                no-action
                style="margin-top: 8px"
                color="gray_100"
              >
                <template #activator>
                  <v-list-item-action>
                    <v-icon color="gray_300">{{ menu.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title class="gray_100--text">{{
                      menu.title
                    }}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item
                  v-for="submenu in menu.children"
                  :key="submenu.name"
                  :value="submenu.name"
                  style="margin-top: 8px; padding-left: 54px"
                  :class="{ list__active: menus.activeMenu === submenu.name }"
                  link
                  @click="$router.push(submenu.url)"
                >
                  <v-list-item-content>
                    <v-list-item-title class="gray_100--text">{{
                      submenu.title
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </template>
          </template>
        </v-list-item-group>
      </v-list>
      <div class="profile">
        <v-divider class="mx-4 mb-4"></v-divider>
        <!-- Profile -->
        <v-layout class="userinfo" align-center justify-start px-4>
          <div class="userinfo__container">
            <v-avatar class="userinfo__container--avatar" size="40" tile>
              <v-img :src="user.profilePicture"></v-img>
            </v-avatar>
          </div>
          <div>
            <p class="userinfo__name text-truncate">{{ user?.name }}</p>
            <p class="userinfo__role">
              {{ user?.role?.title }}
            </p>
          </div>
          <v-spacer />
          <v-btn depressed fab small text class="ml-2" @click="handleSignout">
            <v-icon size="40">$signout</v-icon>
          </v-btn>
        </v-layout>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
/**
 * @/menu : Routing configuration. You can find it in `menu/index.js`.
 * @/utils/menu : Routing filter configuration. You can find it in `utils/menu.js`.
 */
import menus from '@/menu'
import { filterMenu } from '@/utils/menu'

export default {
  name: 'Sidebar',
  computed: {
    drawer() {
      return this.$store.get('drawer')
    },
    role() {
      return this.$store.get('user/profile.role')
    },
    menus() {
      return filterMenu(
        this.role.roleName,
        menus,
        this.$route.path,
        this.role?.allows
      )
    },
    baseUrl() {
      return window.location.origin
    },
    user() {
      return this.$store.get('user/profile')
    },
  },

  methods: {
    openNewTab(url) {
      window.open(this.baseUrl + url, '_blank')
    },
    isSubmenuOpen(url) {
      return this.$route.path.startsWith(url)
    },
    async handleSignout() {
      // await this.$store.dispatch('admin/users/logOutUser')
      this.$cookiz.removeAll()
      this.$router.go(0)
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/abstracts/mixins.scss' as m;
@use '@/assets/scss/abstracts/variables.scss' as v;
.brand {
  width: 100%;
  height: 64px;
  margin: 24px 0;
}

.list {
  padding-top: 0;
  margin: 0px 16px;

  .v-list-item {
    height: 48px !important;
  }

  .v-list-item__title {
    font-weight: 500;
    font-size: 16px;
  }

  .v-list-item__action {
    margin-right: 14px !important;
  }

  .v-list-item--link:before {
    border-radius: 8px;
  }

  .v-list-group__header:before {
    border-radius: 8px !important;
  }

  .theme--light.v-divider {
    border-color: #505356 !important;
  }

  .v-list-item--active:before {
    background-color: transparent !important;
  }

  @include m.element('active') {
    background: #4e5456;
    border-radius: 8px;
    .v-list-item__title {
      font-weight: bold !important;
    }
  }
  .list__active {
    background: v.$gray-700;
  }
}

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
    padding-left: 0;

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
    color: v.$gray-100;
    font-weight: bold;
  }

  @include m.element('role') {
    margin-bottom: 0;
    font-size: 10px;
    color: v.$gray-100;
  }
}
.profile {
  position: absolute;
  bottom: 15px;
  width: 100%;
  :deep(.v-btn) {
    padding: 0;
    border-radius: 8px;
    @include m.on-event {
      background-color: v.$gray-700;
    }
  }
}
</style>
