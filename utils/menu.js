export const hasAccess = (menu, role) => {
  if (menu.access) {
    if (menu.access === '*') {
      if (menu.except) return menu.except.includes(role)

      return true
    }

    return menu.access.includes(role)
  } else if (menu.blocked) {
    if (menu.blocked === '*') {
      if (menu.except) return menu.except.includes(role)

      return false
    }

    return menu.blocked.includes(role)
  }

  return true
}

export const filterMenu = (role, menus, url) => {
  const filteredMenu = menus.reduce((result, menu) => {
    if (menu.hasOwnProperty('children')) {
      if (hasAccess(menu, role)) {
        const children = menu.children.filter((submenu) =>
          hasAccess(submenu, role)
        )

        if (children.length > 0) {
          result.push(Object.assign({}, menu, { children }))
        }
      }
    } else {
      if (hasAccess(menu, role)) result.push(menu)
    }

    return result
  }, [])

  const flattenArray = filteredMenu.reduce((result, menu) => {
    result.push({ name: menu.name, url: menu.url })

    if (menu.hasOwnProperty('children')) {
      menu.children.forEach((item) => {
        result.push({ name: item.name, url: item.url })
      })
    }

    return result
  }, [])

  const getUrl = () => {
    // get url if there's url not registered in menus.js

    const arr = url.split('/')
    const len = arr.length > 4 ? 4 : arr.length
    let res = ''
    if (arr.includes('role')) {
      res = '/admin/role'
    } else {
      for (let i = 1; i < len; i++) {
        res = res + '/' + arr[i]
      }
    }
    return res
  }

  const activeMenu = flattenArray.find((item) => item.url === getUrl())
    ? flattenArray.find((item) => item.url === getUrl()).name
    : 'Dashboard'
  return { filteredMenu, activeMenu }
}
