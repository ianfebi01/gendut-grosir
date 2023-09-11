import menu from '~/menu'
// Authentication middleware
export default function Role({ route, redirect, store, from }) {
  if (route.path === '/login' || route.path === '/register') return true
  const allow = store.get('user/profile')?.role?.allow
  const flattenMenus = []
  menu.map((item) => {
    if (item?.children) {
      item.children.map((child) => {
        flattenMenus.push(child)
      })
    } else {
      flattenMenus.push(item)
    }
  })

  const menuRighNow = flattenMenus.find((item) => item.url.includes(route.path))

  if (!allow.includes(menuRighNow?.name)) {
    if (from !== undefined) {
      redirect(from.path)
    } else {
      redirect('/')
    }
  }
}

// export default function Authenticated() {}
