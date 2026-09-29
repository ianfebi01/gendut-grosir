/**
 * Clear the session (token cookie, stores, cached server data) and go to
 * /login. Shared by the sign-out button and apiFetch's 401 handling.
 */
export async function logout() {
  useCookie('access_token').value = null
  useUserStore().clearProfile()
  useAppStore().setAccessToken('')
  useNuxtApp().$queryClient.clear()
  await navigateTo('/login')
}
