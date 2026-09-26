import { h } from 'vue'
import Cart from '~/components/CustomIcons/Cart.vue'
import CategoryPrimary from '~/components/CustomIcons/CategoryPrimary.vue'
import Clock600 from '~/components/CustomIcons/Clock600.vue'
import Customers from '~/components/CustomIcons/Customers.vue'
import Dashboard from '~/components/CustomIcons/Dashboard.vue'
import DateIcon from '~/components/CustomIcons/Date.vue'
import Discount from '~/components/CustomIcons/Discount.vue'
import Edit from '~/components/CustomIcons/Edit.vue'
import Magnify from '~/components/CustomIcons/Magnify.vue'
import MenuLibrary from '~/components/CustomIcons/MenuLibrary.vue'
import Money from '~/components/CustomIcons/Money.vue'
import Orders from '~/components/CustomIcons/Orders.vue'
import Plus from '~/components/CustomIcons/Plus.vue'
import RoleIcon from '~/components/CustomIcons/RoleIcon.vue'
import ShopingBag from '~/components/CustomIcons/ShopingBag.vue'
import SignOut from '~/components/CustomIcons/SignOut.vue'
import Success600 from '~/components/CustomIcons/Success600.vue'
import Trash from '~/components/CustomIcons/Trash.vue'
import Upload from '~/components/CustomIcons/Upload.vue'
import WarningDelete from '~/components/CustomIcons/WarningDelete.vue'
import WarningDiscard from '~/components/CustomIcons/WarningDiscard.vue'
import X600 from '~/components/CustomIcons/X600.vue'

// Custom SVG icon set (replaces the Vuetify 2 `values` config from the old
// plugins/customIcon.js). Registered via the `vuetify:configuration` runtime
// hook so .vue SFC imports resolve through Vite (vuetify.config.ts is loaded
// in a Node context where .vue imports fail).
const customIcons: Record<string, any> = {
  discounts: Discount,
  dashboard: Dashboard,
  shoping_bag: ShopingBag,
  signout: SignOut,
  role: RoleIcon,
  customers: Customers,
  menulibrary: MenuLibrary,
  orders: Orders,
  magnify: Magnify,
  cart: Cart,
  plus: Plus,
  trash: Trash,
  category_primary: CategoryPrimary,
  edit: Edit,
  warning_discard: WarningDiscard,
  warning_delete: WarningDelete,
  upload: Upload,
  money: Money,
  success_600: Success600,
  clock_600: Clock600,
  x_600: X600,
  date: DateIcon,
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }: any) => {
    vuetifyOptions.icons = vuetifyOptions.icons || {}
    vuetifyOptions.icons.aliases = {
      ...(vuetifyOptions.icons.aliases || {}),
      // `$discounts` etc. keep working in templates and `icon="$..."` props
      ...Object.fromEntries(
        Object.keys(customIcons).map((name) => [name, `custom:${name}`])
      ),
    }
    vuetifyOptions.icons.sets = {
      ...(vuetifyOptions.icons.sets || {}),
      custom: {
        component: (props: any) => {
          const Cmp = customIcons[props.icon as string]
          return Cmp
            ? h(props.tag, [h(Cmp, { class: 'v-icon__svg' })])
            : h(props.tag, props.icon)
        },
      },
    }
  })
})
