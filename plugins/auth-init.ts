import { getMe } from '~/api/generated/auth-users/auth-users'

export default defineNuxtPlugin(async () => {
  const token = useCookie('access_token')
  if (token.value) {
    try {
      const userStore = useUserStore()
      if (!userStore.profile?.role) {
        const result = await getMe()
        userStore.setProfile(result?._doc ?? result ?? {})
      }
    } catch {
      // Ignore - middleware will redirect to login if needed
    }
  }
})
