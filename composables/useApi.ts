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
      const route = useRoute()
      const routePath = route.path as string
      if (code === 403 || code === 504) {
        if (routePath !== '/login' && routePath !== '/register') {
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
