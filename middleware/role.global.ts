import menu from '~/menu'
import { getMe } from '~/api/generated/auth-users/auth-users'
import { filterMenu, findMenuTrail } from '~/utils/menu'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path === '/register') return

  const userStore = useUserStore()
  if (!userStore.profile?.role) {
    try {
      const result = await getMe()
      userStore.setProfile(result?._doc ?? result ?? {})
    } catch {
      // a 401 has already signed out via apiFetch
    }
  }

  const role = userStore.profile?.role
  if (!role) return navigateTo('/login')

  const allows: string[] = role.allows ?? []
  const trail = findMenuTrail(menu, to.path)
  // Pages outside the menu aren't access-controlled
  if (trail.every((item: { name: string }) => allows.includes(item.name)))
    return

  // Send the user to the first page they may open
  const { filteredMenu } = filterMenu(role.roleName, menu, to.path, allows)
  const first = filteredMenu[0]
  const fallback = first?.children?.[0]?.url ?? first?.url
  if (fallback && fallback !== to.path) return navigateTo(fallback)
  return abortNavigation({ statusCode: 403, statusMessage: 'Akses ditolak' })
})
