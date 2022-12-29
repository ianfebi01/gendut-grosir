import Vue from 'vue'
import Vuetify from 'vuetify/lib'
Vue.use(Vuetify)
/* registering custom icon to vuetify as components use vuetify can be use side by side with v-icons from vuetify */
export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: {
      discounts: {
        component: () => import('@/components/CustomIcons/Discount.vue'),
      },
      dashboard: {
        component: () => import('@/components/CustomIcons/Dashboard.vue'),
      },
    },
  },
})
