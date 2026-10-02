import { getSetupStatus } from '~/api/generated/auth-users/auth-users'

/**
 * Runs before the auth middlewares. Asks the backend once per app load
 * whether any user exists; while none does, every route leads to /register,
 * where the first account is created as an activated super admin.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const appStore = useAppStore()

  if (appStore.needsSetup === null) {
    try {
      const result = await getSetupStatus()
      appStore.setNeedsSetup(!!result?.data?.needsSetup)
    } catch {
      // Don't lock the app out if the check itself fails
      appStore.setNeedsSetup(false)
    }
  }

  if (!appStore.needsSetup) return

  // A token left over from a wiped database can't be valid any more
  useCookie('access_token').value = null
  useUserStore().clearProfile()
  useAppStore().setAccessToken('')

  if (to.path !== '/register') return navigateTo('/register')
})
