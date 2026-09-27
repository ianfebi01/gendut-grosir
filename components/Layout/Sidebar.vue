<template>
  <!-- Persistent sidebar on desktop -->
  <aside
    v-show="drawer"
    class="fixed inset-y-0 left-0 z-30 hidden w-70 lg:block"
  >
    <SidebarNav />
  </aside>

  <!-- Slide-over drawer on mobile only -->
  <USlideover
    v-if="isMobile"
    v-model:open="drawer"
    side="left"
    :ui="{ content: 'w-70 p-0' }"
  >
    <template #content>
      <SidebarNav @navigate="drawer = false" />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import SidebarNav from '@/components/Layout/SidebarNav.vue'

defineOptions({ name: 'Sidebar' })

const appStore = useAppStore()

const drawer = computed({
  get: () => appStore.drawer,
  set: (v: boolean) => appStore.setDrawer(v),
})

// Slideover is mobile-only: rendering it on desktop would trap focus
// behind a modal overlay on top of the persistent sidebar.
const isMobile = useMediaQuery('(max-width: 1023.98px)')
</script>
