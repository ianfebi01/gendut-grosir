<template>
  <div class="min-h-screen">
    <LayoutSidebar />
    <div
      :class="[
        'min-h-screen transition-all',
        drawer ? 'lg:pl-[280px]' : 'lg:pl-0',
      ]"
    >
      <div class="flex items-start lg:gap-4 lg:px-4">
        <div
          class="min-h-screen min-w-0 flex-1 bg-white lg:mt-4 lg:rounded-t-xl border overflow-hidden"
        >
          <LayoutHeader class="px-4" @toggle-drawer="toggleDrawer" />
          <main class="px-4 pb-10 md:px-6">
            <slot />
          </main>
        </div>

        <!-- Right card for pages with definePageMeta({ aside: true }); filled via <Teleport to="#layout-aside"> -->
        <!-- Always in the DOM so the teleport target exists on client-side navigation -->
        <aside
          id="layout-aside"
          class="sticky top-4 mt-4 hidden h-[calc(100vh-1rem)] w-90 shrink-0 overflow-hidden rounded-t-xl border bg-white xl:w-100"
          :class="{ 'xl:block': route.meta.aside }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardLayout' })

const route = useRoute()
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
