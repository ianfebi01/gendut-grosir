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
      magnify: {
        component: () => import('@/components/CustomIcons/Magnify.vue'),
      },
      cart: {
        component: () => import('@/components/CustomIcons/Cart.vue'),
      },
      plus: {
        component: () => import('@/components/CustomIcons/Plus.vue'),
      },
      trash: {
        component: () => import('@/components/CustomIcons/Trash.vue'),
      },
      category_primary: {
        component: () => import('@/components/CustomIcons/CategoryPrimary.vue'),
      },
      edit: {
        component: () => import('@/components/CustomIcons/Edit.vue'),
      },
      warning_discard: {
        component: () => import('~/components/CustomIcons/WarningDiscard.vue'),
      },
      warning_delete: {
        component: () => import('~/components/CustomIcons/WarningDelete.vue'),
      },
      upload: {
        component: () => import('~/components/CustomIcons/Upload.vue'),
      },
      money: {
        component: () => import('~/components/CustomIcons/Money.vue'),
      },
      success_600: {
        component: () => import('~/components/CustomIcons/Success600.vue'),
      },
      clock_600: {
        component: () => import('~/components/CustomIcons/Clock600.vue'),
      },
      x_600: {
        component: () => import('~/components/CustomIcons/X600.vue'),
      },
      date: {
        component: () => import('~/components/CustomIcons/Date.vue'),
      },
    },
  },
})
