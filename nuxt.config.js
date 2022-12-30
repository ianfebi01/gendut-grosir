export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  // ssr: true,
  // target: 'server',

  router: {
    base: '/',
    middleware: 'authenticated',
  },
  head: {
    titleTemplate: '%s',
    title: 'Gendut Grosir',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/axios' },
    { src: '@/plugins/customIcon', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint

    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    ['cookie-universal-nuxt', { alias: 'cookiz', parseJSON: false }],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: { proxy: true },
  proxy: {
    '/api/': {
      target: process.env.API_BASE_URL,
      pathRewrite: { '^/api/': '/' },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    // customVariables: ['~/assets/scss/abstracts/variables.scss'],
    defaultAssets: {
      font: {
        family: 'Inter',
      },
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#7F56D9',
          secondary: '#667085',
          accent: '#D0D5DD',
          success: '#1BBF70',
          info: '#2881E9',
          gray_100: '#F2F4F7',
          gray_200: '#EAECF0',
          gray_300: '#D0D5DD',
          gray_400: '#98A2B3',
          gray_500: '#667085',
          gray_700: '#344054',
          white: '#fff',
          bg_sidebar: '#101828',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Port Dev
  server: {
    port: 3001,
  },
}
