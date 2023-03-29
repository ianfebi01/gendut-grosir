/**
 * Routing configuration
 *
 * Default
 * `name`   : Menu title (String)
 * `url`    : Menu URL (String)
 * `icon`   : Menu icon (String)
 * `access` : Menu role-based access control (Array of String)
 *
 * Has Children
 * `name`     : Menu title (String)
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
    name: 'Point Of Sales',
    url: '/',
    icon: '$shoping_bag',
    access: ['super_admin', 'admin', 'customer'],
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: '$dashboard',
    access: ['super_admin'],
  },
  {
    name: 'Orders',
    url: '/orders',
    icon: '$orders',
    access: ['super_admin', 'admin'],
  },
  {
    name: 'Menu Library',
    url: '/library',
    icon: '$menulibrary',
    access: ['super_admin', 'admin'],
    children: [
      {
        name: 'Category',
        url: '/library/category',
        icon: '',
        access: ['super_admin', 'admin'],
      },
      {
        name: 'Product',
        url: '/library/product',
        icon: '',
        access: ['super_admin', 'admin'],
      },
      {
        name: 'Stock Opname',
        url: '/library/stockOpname',
        icon: '',
        access: ['super_admin', 'admin'],
      },
    ],
  },
  {
    name: 'Customers',
    url: '/customers',
    icon: '$customers',
    access: ['super_admin'],
  },
  {
    name: 'User Role Management',
    url: '/admin/role',
    icon: '$role',
    access: ['super_admin'],
  },
]
