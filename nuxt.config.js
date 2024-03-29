export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  // ssr: true,
  // target: 'server',

  router: {
    base: '/',
    middleware: ['authenticated', 'role'],
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
    { src: '@plugins/main', mode: 'client' },
    { src: '@/plugins/chart.js', mode: 'client' },
    { src: '@/plugins/formatRupiah.js' },
    { src: '@/plugins/formatDate.js' },
    { src: '@/plugins/changeImageSize.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint

    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
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
          primary_50: '#f9f5ff',
          primary_100: '#f4ebff',
          primary_300: '#d6bbfb',
          secondary: '#667085',
          accent: '#D0D5DD',
          gray_100: '#F2F4F7',
          gray_200: '#EAECF0',
          gray_300: '#D0D5DD',
          gray_400: '#98A2B3',
          gray_500: '#667085',
          gray_700: '#344054',
          gray_900: '#101828',
          error: '#F04438',
          error_50: '#FEF3F2',
          error_100: '#FEE4E2',
          error_600: '#D92D20',
          success_600: '#32D583',
          success_100: '#d1fadf',
          success_50: '#ECFDF3',
          'blue-100': '#D1E9FF',
          'blue-600': '#1570EF',
          'red-100': '#FFE4E8',
          'red-600': '#E31B54',
          white: '#fff',
          bg_sidebar: '#101828',
          neutral_80: '#6F7173',
          'orange-100': '#FFEAD5',
          'orange-300': '#FEB273',
          'orange-500': '#FB6514',
          'orange-600': '#EC4A0A',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Port Dev
  server: {
    port: 3001,
    host: '0.0.0.0',
  },
}
