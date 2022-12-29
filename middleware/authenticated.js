// Authentication middleware
export default function Authenticated({ app, route, redirect }) {
  const token = app.$cookiz.get('access_token')
  const loggedIn = !(route?.name || '').includes('login')
  const notLogin = (route?.name || '').includes('login')

  if (loggedIn) {
    if (!token) {
      return redirect('/login')
    }
    return true
  } else if (notLogin) {
    if (token) {
      return redirect('/')
    }
    return true
  }
  return true
}

// export default function Authenticated() {}
