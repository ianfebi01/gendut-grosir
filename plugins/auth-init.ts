export default defineNuxtPlugin(async () => {
  const token = useCookie('access_token')
  if (token.value) {
    try {
      const { api } = useApi()
      const userStore = useUserStore()
      if (!userStore.profile?.role) {
        const result: any = await api('me')
        userStore.setProfile(result?._doc ?? result?.data ?? result ?? {})
      }
    } catch {
      // Ignore - middleware will redirect to login if needed
    }
  }
})
