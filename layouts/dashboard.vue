<template>
  <div class="min-h-screen">
    <LayoutSidebar v-model:open="drawer" />
    <div
      :class="[
        'min-h-screen transition-all',
        drawer ? 'lg:pl-[280px]' : 'lg:pl-0',
      ]"
    >
      <div
        class="min-h-screen grow lg:mx-4 bg-white lg:mt-4 lg:rounded-t-xl border overflow-hidden"
      >
        <LayoutHeader class="px-4" @toggle-drawer="toggleDrawer" />
        <main class="px-4 pb-10 md:px-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardLayout' })

const appStore = useAppStore()
const drawer = computed({
  get: () => appStore.drawer,
  set: (v: boolean) => appStore.setDrawer(v),
})

function toggleDrawer() {
  appStore.toggleDrawer()
}

// Open drawer by default on desktop
onMounted(() => {
  if (window.innerWidth >= 1024) appStore.setDrawer(true)
})
</script>
