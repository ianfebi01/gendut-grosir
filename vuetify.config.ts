import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
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
  defaults: {
    // Shared Untitled UI look: 8px radius everywhere, no uppercase buttons.
    // Heights: buttons and inputs both 44px (see VTextField/VSelect/
    // VAutocomplete height + the height="44"/size="large" used on buttons).
    VBtn: {
      rounded: 'xs',
      elevation: '0',
      height: 40
    },
    VTextField: {
      rounded: 'xs',
      variant: 'solo',
      density: 'compact',
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})
