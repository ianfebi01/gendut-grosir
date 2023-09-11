/**
 * Routing configuration
 *
 * Default
 * `title`   : Menu title (String)
 * `url`    : Menu URL (String)
 * `icon`   : Menu icon (String)
 * `access` : Menu role-based access control (Array of String)
 *
 * Has Children
 * `title`     : Menu title (String)
 * `url`      : Menu URL (String)
 * `icon`     : Menu icon (String)
 * `access`   : Menu role-based access control (Array of String)
 * `children` : Submenu (Children) (Array of Default)
 *
 * Note :
 * For the `access` field, you should discuss with the backend engineers. Because it depends on the API you're using.
 * If you want to find more icons for the `icon` field, see https://materialdesignicons.com.
 */
export default [
  {
    title: 'Point Of Sales',
    name: 'pos',
    url: '/',
    icon: '$shoping_bag',
    access: ['super_admin', 'admin', 'customer'],
  },
  {
    title: 'Dashboard',
    name: 'dashboard',
    url: '/dashboard',
    icon: '$dashboard',
    access: ['super_admin'],
  },
  {
    title: 'Orders',
    name: 'orders',
    url: '/orders',
    icon: '$orders',
    access: ['super_admin', 'admin'],
  },
  {
    title: 'Menu Library',
    name: 'library',
    url: '/library',
    icon: '$menulibrary',
    access: ['super_admin', 'admin'],
    children: [
      {
        title: 'Category',
        name: 'category',
        url: '/library/category',
        icon: '',
        access: ['super_admin', 'admin'],
      },
      {
        title: 'Product',
        name: 'product',
        url: '/library/product',
        icon: '',
        access: ['super_admin', 'admin'],
      },
      {
        title: 'Stock Opname',
        name: 'stockOpname',
        url: '/library/stockOpname',
        icon: '',
        access: ['super_admin', 'admin'],
      },
    ],
  },
  {
    title: 'Customers',
    name: 'customers',
    url: '/customers',
    icon: '$customers',
    access: ['super_admin'],
  },
  {
    title: 'User Role Management',
    url: '/role',
    name: 'role',
    icon: '$role',
    access: ['super_admin'],
  },
]
