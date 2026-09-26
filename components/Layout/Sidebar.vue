<template>
  <v-navigation-drawer
    v-model="drawer"
    color="bg_sidebar"
    width="280"
    theme="dark"
    disable-resize-watcher
    style="height: 100svh"
  >
    <v-row
      class="brand d-flex flex-column align-center justify-center"
      no-gutters
    >
      <!-- Place your own logo here -->
      <img src="/logo-light.svg" alt="Logo GG" />
    </v-row>

    <!-- <v-divider></v-divider> -->

    <v-list
      v-model:selected="selectedMenu"
      v-model:opened="openedGroups"
      class="list mt-4"
      density="compact"
      color="gray_100"
    >
      <template v-for="menu in menus.filteredMenu" :key="menu.name">
        <template v-if="!menu.children">
          <v-list-item
            :id="menu.name"
            :value="menu.name"
            style="margin-top: 8px"
            :class="{ list__active: menus.activeMenu === menu.name }"
            @click="$router.push(menu.url)"
          >
            <template #prepend>
              <v-icon color="gray_300">{{ menu.icon }}</v-icon>
            </template>
            <v-list-item-title class="text-gray_100">
              {{ menu.title }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-group :value="menu.name" color="gray_100">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :value="menu.name"
                style="margin-top: 8px"
              >
                <template #prepend>
                  <v-icon color="gray_300">{{ menu.icon }}</v-icon>
                </template>
                <v-list-item-title class="text-gray_100">
                  {{ menu.title }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="submenu in menu.children"
              :key="submenu.name"
              :value="submenu.name"
              style="margin-top: 8px; padding-left: 54px"
              :class="{ list__active: menus.activeMenu === submenu.name }"
              @click="$router.push(submenu.url)"
            >
              <v-list-item-title class="text-gray_100">
                {{ submenu.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </template>
    </v-list>
    <div class="profile">
      <v-divider class="mx-4 mb-4"></v-divider>
      <!-- Profile -->
      <v-row class="userinfo px-4" align="center" justify="start" no-gutters>
        <div class="userinfo__container">
          <v-avatar class="userinfo__container--avatar" size="40" rounded="0">
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
        <v-btn
          variant="text"
          icon
          size="small"
          class="ml-2"
          @click="handleSignout"
        >
          <v-icon size="40">$signout</v-icon>
        </v-btn>
      </v-row>
    </div>
  </v-navigation-drawer>
</template>

<script>
/**
 * @/menu : Routing configuration. You can find it in `menu/index.js`.
 * @/utils/menu : Routing filter configuration. You can find it in `utils/menu.js`.
 */
import menus from '@/menu'
import { filterMenu } from '@/utils/menu'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Sidebar',
  data() {
    return {
      selectedMenu: [],
      openedGroups: [],
    }
  },
  computed: {
    drawer: {
      get() {
        return useAppStore().drawer
      },
      set(value) {
        useAppStore().setDrawer(value)
      },
    },
    role() {
      return useUserStore().profile?.role || {}
    },
    menus() {
      return filterMenu(
        this.role.roleName,
        menus,
        this.$route.path,
        this.role?.allows || []
      )
    },
    baseUrl() {
      return typeof window !== 'undefined' ? window.location.origin : ''
    },
    user() {
      return useUserStore().profile || {}
    },
  },
  watch: {
    menus: {
      immediate: true,
      handler() {
        this.syncMenuState()
      },
    },
  },

  methods: {
    syncMenuState() {
      const activeMenu = this.menus?.activeMenu
      this.selectedMenu = activeMenu ? [activeMenu] : []
      const path = this.$route.path
      this.openedGroups = (this.menus?.filteredMenu || [])
        .filter((menu) => menu.children && path.startsWith(menu.url))
        .map((menu) => menu.name)
    },
    openNewTab(url) {
      window.open(this.baseUrl + url, '_blank')
    },
    async handleSignout() {
      useUserStore().clearProfile()
      const accessToken = useCookie('access_token')
      accessToken.value = null
      await navigateTo('/login')
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
  padding-bottom: 110px;

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
  background: v.$gray-900;
  position: absolute;
  padding-bottom: 15px;
  bottom: 0;
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
