export const useApi = () => {
  const config = useRuntimeConfig()

  const token = useCookie('access_token')

  const api = $fetch.create({
    baseURL: '/api/',
    onRequest({ options }) {
      const headers = new Headers((options.headers as HeadersInit) || {})
      if (!headers.has('Authorization') && token.value) {
        headers.set('Authorization', `Bearer ${token.value}`)
      }
      options.headers = headers
    },
    onResponseError({ response }) {
      const code = response?.status
      // useRoute() throws when this hook runs detached from setup
      // (e.g. during SSR), so fall back to empty route there.
      let routeName = ''
      let routePath = ''
      try {
        const route = useRoute()
        routeName = (route.name as string) || ''
        routePath = route.path as string
      } catch {
        // ignore - route-gated handling is skipped outside setup
      }
      if (code === 401 && routeName.includes('admin')) {
        console.error(response)
        return
      }
      if (code === 403 || code === 504) {
        if (routePath !== '/') {
          token.value = null
          navigateTo('/login')
        }
        return
      }
      console.error(response)
    },
  })

  return { api, apiBase: config.public.apiBaseUrl }
}
