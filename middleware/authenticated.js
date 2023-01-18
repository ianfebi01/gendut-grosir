// Authentication middleware
export default function Authenticated({ app, route, redirect }) {
  // const token = app.$cookiz.get('access_token')
  // const notLoginPage = !(route?.name || '').includes('login')
  // const loginPage = (route?.name || '').includes('login')
  // const registerPage = (route?.name || '').includes('register')

  // if (notLoginPage && !registerPage) {
  //   if (!token) {
  //     return redirect('/login')
  //   }
  //   return true
  // } else if (loginPage) {
  //   if (token) {
  //     return redirect('/')
  //   }
  //   return true
  // }
  return true
}

// export default function Authenticated() {}
