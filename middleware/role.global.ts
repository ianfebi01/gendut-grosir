import menu from '~/menu'

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/login' || to.path === '/register') return

  const userStore = useUserStore()
  const allows: string[] = userStore.profile?.role?.allows || []
  // Allow through while profile is still loading (auth-init will fetch it);
  // role check re-runs on next navigation once profile exists.
  if (!userStore.profile?.role) return

  const flattenMenus: any[] = []
  menu.forEach((item: any) => {
    if (item?.children) {
      item.children.forEach((child: any) => flattenMenus.push(child))
    } else {
      flattenMenus.push(item)
    }
  })

  const menuRightNow = flattenMenus.find((item) => item.url && to.path.includes(item.url))

  if (menuRightNow && !allows.includes(menuRightNow?.name)) {
    return navigateTo(from?.path && from.path !== to.path ? from.path : '/')
  }
})
