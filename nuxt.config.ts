// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },

  // Full SPA — no SSR for this app
  ssr: false,

  devServer: {
    port: 3001,
    host: '0.0.0.0',
  },

  css: ['~/assets/css/main.css'],

  components: true,

  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxt/eslint'],

  eslint: {
    config: { stylistic: false },
  },

  ui: {
    // Light-only app (matches the old Vuetify light theme):
    // guarantees white surfaces (#fff) and readable slate text.
    colorMode: false,
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    },
  },

  vite: {
    optimizeDeps: {
      // Pre-bundle deps that are only imported by lazily loaded pages.
      // Otherwise Vite discovers them on first navigation, re-optimizes, and the
      // in-flight import fails ("Failed to fetch dynamically imported module").
      include: ['vue-chartjs', 'chart.js', 'dayjs', '@vueuse/core', '@tanstack/vue-query'],
    },
  },

  nitro: {
    // /api/users -> ${API_BASE_URL}/users (prefix is stripped; works in dev and prod)
    routeRules: {
      '/api/**': {
        proxy: `${process.env.API_BASE_URL || 'http://localhost:8000'}/**`,
      },
    },
  },

  app: {
    head: {
      title: 'Gendut Grosir',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap',
        },
      ],
    },
  },
})
