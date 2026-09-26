<template>
  <v-app>
    <ClientOnly>
      <template #fallback>
        <v-overlay :model-value="true" opacity="1" color="#ffffff">
          <v-progress-circular
            indeterminate
            :size="35"
            color="#7F56D9"
          ></v-progress-circular>
        </v-overlay>
      </template>
      <Sidebar />
      <HeaderApp />
    </ClientOnly>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>
<script>
import Sidebar from '@/components/Layout/Sidebar.vue'
import HeaderApp from '@/components/Layout/Header.vue'

export default {
  name: 'DashboardLayout',
  components: {
    Sidebar,
    HeaderApp,
  },
}
</script>
