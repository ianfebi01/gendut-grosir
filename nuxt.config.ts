// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },

  devServer: {
    port: 3001,
    host: '0.0.0.0',
  },

  css: ['@/assets/scss/main.scss', '@mdi/font/css/materialdesignicons.css'],

  components: true,

  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],

  vuetify: {
    moduleOptions: {
      styles: { configFile: 'assets/scss/abstracts/vuetify-settings.scss' },
      // useLayout collides with Nuxt's built-in useLayout auto-import;
      // prefix only Vuetify's copy (no code uses it, so nothing else changes).
      prefixComposables: ['useLayout'],
    },
    vuetifyOptions: './vuetify.config.ts',
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    },
  },

  nitro: {
    devProxy: {
      '/api/': {
        target: `${process.env.API_BASE_URL || 'http://localhost:8000'}/`,
        changeOrigin: true,
        prependPath: true,
        rewrite: (path: string) => path.replace(/^\/api\//, '/'),
      },
    },
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
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        },
      },
    },
  },
})
