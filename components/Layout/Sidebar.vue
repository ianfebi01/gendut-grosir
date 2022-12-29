<template>
  <div>
    <v-navigation-drawer
      :value="drawer"
      app
      color="bg_sidebar"
      width="280"
      dark
    >
      <v-layout
        class="brand d-flex flex-column align-center justify-center"
        align-center
        justify-center
      >
        <!-- Place your own logo here -->
        <img src="/logo-light.svg" alt="Logo GG" />
      </v-layout>

      <v-divider></v-divider>

      <v-list class="list" dense>
        <v-list-item-group :value="menus.activeMenu" color="grey_100">
          <template v-for="menu in menus.filteredMenu">
            <template v-if="!menu.children">
              <v-list-item
                :id="menu.name"
                :key="menu.name"
                :value="menu.name"
                style="margin-top: 8px"
                :class="{ list__active: menus.activeMenu === menu.name }"
                link
                @click="
                  menu.name === 'Sign Out'
                    ? handleLogout()
                    : $router.push(menu.url)
                "
              >
                <v-list-item-action v-if="menu.name === 'Sign Out'">
                  <v-icon color="grey_300">{{ menu.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-action v-else>
                  <v-icon color="grey_300">{{ menu.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content v-if="menu.name === 'Sign Out'">
                  <v-list-item-title class="grey_100--text">{{
                    menu.name
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content v-else>
                  <v-list-item-title class="grey_100--text">{{
                    menu.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-group
                :key="menu.name"
                :value="isSubmenuOpen(menu.url)"
                no-action
                style="margin-top: 8px"
                color="grey_100"
              >
                <template #activator>
                  <v-list-item-action>
                    <v-icon color="grey_300">{{ menu.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title class="grey_100--text">{{
                      menu.name
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
                    <v-list-item-title class="grey_100--text">{{
                      submenu.name
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </template>
          </template>
        </v-list-item-group>
      </v-list>
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
      return filterMenu(this.role, menus, this.$route.path)
    },
    baseUrl() {
      return window.location.origin
    },
  },
  methods: {
    openNewTab(url) {
      window.open(this.baseUrl + url, '_blank')
    },
    isSubmenuOpen(url) {
      return this.$route.path.startsWith(url)
    },
    async handleLogout() {
      await this.$store.dispatch('admin/users/logOutUser')
      this.$cookiz.removeAll()
      this.$router.go(0)
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/abstracts/mixins.scss' as m;
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
}
</style>
