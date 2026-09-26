export default defineNuxtPlugin(async () => {
  const token = useCookie('access_token')
  if (token.value) {
    try {
      const userStore = useUserStore()
      if (!userStore.profile?.role) {
        await userStore.getMe()
      }
    } catch {
      // Ignore - middleware will redirect to login if needed
    }
  }
})
