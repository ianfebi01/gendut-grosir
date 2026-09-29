export const hasAccess = (menu, role, allows) => {
  if (menu.access) {
    return allows.includes(menu.name)
  } else if (menu.blocked) {
    if (menu.blocked === '*') {
      if (menu.except) return menu.except.includes(role)

      return false
    }

    return menu.blocked.includes(role)
  }

  return true
}

export const filterMenu = (role, menus, url, allows) => {
  const filteredMenu = menus.reduce((result, menu) => {
    if (menu.hasOwnProperty('children')) {
      if (hasAccess(menu, role, allows)) {
        const children = menu.children.filter((submenu) =>
          hasAccess(submenu, role, allows),
        )

        if (children.length > 0) {
          result.push(Object.assign({}, menu, { children }))
        }
      }
    } else {
      if (hasAccess(menu, role, allows)) result.push(menu)
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

  // Longest menu url the path starts with, so /customers/create -> customers
  // and /library/product/1/edit -> product. '/' only matches exactly.
  const activeItem = flattenArray
    .filter(
      (item) =>
        item.url === url ||
        (item.url !== '/' && url.startsWith(item.url + '/')),
    )
    .sort((a, b) => b.url.length - a.url.length)[0]

  const activeMenu = activeItem ? activeItem.name : 'Dashboard'

  return { filteredMenu, activeMenu }
}

/**
 * Menu entries guarding `path`, parent first: the item with the longest url
 * the path equals or starts with, plus its parent group if it has one.
 * '/' only matches exactly, so it never swallows other routes.
 */
export const findMenuTrail = (menus, path) => {
  const matches = (url) =>
    !!url && (url === path || (url !== '/' && path.startsWith(url + '/')))

  let best = []
  let bestLength = -1
  for (const menu of menus) {
    const candidates = [[menu], ...(menu.children ?? []).map((c) => [menu, c])]
    for (const trail of candidates) {
      const url = trail[trail.length - 1].url
      if (matches(url) && url.length > bestLength) {
        best = trail
        bestLength = url.length
      }
    }
  }
  return best
}
