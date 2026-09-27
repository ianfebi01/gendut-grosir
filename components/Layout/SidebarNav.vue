<template>
  <div class="flex h-full flex-col bg-ink-100 shadow lg:shadow-none">
    <div class="mt-6 flex h-16 items-center justify-start px-4 gap-2">
      <img src="/logo-only.svg" alt="Logo GG" class="h-6" />
      <span class="font-semibold text-2xl tracking-tighter">Gendut Grosir</span>
    </div>

    <nav class="flex-1 overflow-y-auto px-4">
      <Search class="mb-2 mt-1" />
      <p v-if="!hasRole" class="px-3 py-4 text-sm text-gray-400">
        Memuat menu...
      </p>
      <p
        v-else-if="!menus.filteredMenu.length"
        class="px-3 py-4 text-sm text-gray-400"
      >
        Tidak ada menu
      </p>
      <template v-for="menu in menus.filteredMenu" :key="menu.name">
        <button
          v-if="!menu.children"
          :id="menu.name"
          type="button"
          class="mt-2 flex h-10 w-full cursor-pointer items-center gap-2 rounded-sm px-3 text-left text-sm tracking-tighter font-medium text-ink-600 hover:bg-white hover:text-ink-900 transition-colors duration-150 ease-in-out"
          :class="{
            'bg-white text-ink-900 shadow-sm border':
              menus.activeMenu === menu.name,
          }"
          @click="go(menu.url)"
        >
          <MenuIcon :icon="menu.icon" />
          <span>{{ menu.title }}</span>
        </button>

        <div v-else class="mt-2">
          <button
            type="button"
            class="flex h-10 w-full cursor-pointer items-center gap-2 rounded-sm px-3 text-left text-sm tracking-tighter font-medium text-ink-600 hover:bg-white hover:text-ink-900 transition-colors duration-150 ease-in-out"
            @click="toggle(menu.name)"
          >
            <MenuIcon :icon="menu.icon" />
            <span class="flex-1">{{ menu.title }}</span>
            <UIcon
              name="i-heroicons-chevron-down-20-solid"
              class="size-4 transition-transform"
              :class="{ 'rotate-180': openGroups[menu.name] }"
            />
          </button>
          <div v-if="openGroups[menu.name]">
            <button
              v-for="submenu in menu.children"
              :key="submenu.name"
              type="button"
              class="mt-2 flex h-10 w-full cursor-pointer items-center rounded-sm pl-10 pr-3 text-left text-sm tracking-tighter font-medium text-ink-600 hover:bg-white hover:text-ink-900 transition-colors duration-150 ease-in-out"
              :class="{
                'bg-white text-ink-900 shadow-sm border':
                  menus.activeMenu === submenu.name,
              }"
              @click="go(submenu.url)"
            >
              {{ submenu.title }}
            </button>
          </div>
        </div>
      </template>
    </nav>

    <div class="pb-4">
      <USeparator class="mx-4 mb-4" />
      <div class="flex items-center gap-2 px-4">
        <UAvatar
          :src="user.profilePicture"
          size="md"
          class="rounded-full bg-gray-100"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold">
            {{ user?.name }}
          </p>
          <p class="truncate text-[10px]">
            {{ user?.role?.title }}
          </p>
        </div>
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          @click="handleSignout"
        >
          <template #leading>
            <UIcon name="i-lucide-log-out" class="size-5" />
          </template>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import menuConfig from '@/menu'
import { filterMenu } from '@/utils/menu'
import MenuIcon from '@/components/Layout/MenuIcon.vue'
import Search from '../Input/Search.vue'

defineOptions({ name: 'SidebarNav' })

const emit = defineEmits(['navigate'])
const route = useRoute()
const userStore = useUserStore()

const openGroups = ref<Record<string, boolean>>({})

const role = computed(() => userStore.profile?.role || {})
const hasRole = computed(() => !!userStore.profile?.role)
const menus = computed(() =>
  filterMenu(
    role.value.roleName,
    menuConfig as any,
    route.path,
    role.value?.allows || [],
  ),
)
const user = computed(() => userStore.profile || {})

function toggle(name: string) {
  openGroups.value[name] = !openGroups.value[name]
}

async function go(url: string) {
  emit('navigate')
  await navigateTo(url)
}

async function handleSignout() {
  userStore.clearProfile()
  const accessToken = useCookie('access_token')
  accessToken.value = null
  await navigateTo('/login')
}

// Auto-expand the group containing the current route
watch(
  () => route.path,
  (path) => {
    for (const menu of (menus.value?.filteredMenu || []) as any[]) {
      if (menu.children && path.startsWith(menu.url))
        openGroups.value[menu.name] = true
    }
  },
  { immediate: true },
)
</script>
