export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('access_token')
  const routeName = (to.name as string) || ''
  const isLoginPage = routeName.includes('login')
  const isRegisterPage = routeName.includes('register')

  if (!isLoginPage && !isRegisterPage) {
    if (!token.value) {
      return navigateTo('/login')
    }
    return
  }

  if (isLoginPage && token.value) {
    return navigateTo('/')
  }
})
