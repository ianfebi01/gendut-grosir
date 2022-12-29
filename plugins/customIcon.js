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
      shoping_bag: {
        component: () => import('@/components/CustomIcons/ShopingBag.vue'),
      },
      signout: {
        component: () => import('@/components/CustomIcons/SignOut.vue'),
      },
      role: {
        component: () => import('@/components/CustomIcons/RoleIcon.vue'),
      },
      customers: {
        component: () => import('@/components/CustomIcons/Customers.vue'),
      },
      menulibrary: {
        component: () => import('@/components/CustomIcons/MenuLibrary.vue'),
      },
      orders: {
        component: () => import('@/components/CustomIcons/Orders.vue'),
      },
    },
  },
})
