// Authentication middleware
export default function Role({ app, route, redirect, store }) {
  const allow = [
    'login',
    'pos',
    'orders',
    'library',
    'category',
    'product',
    'stockOpname',
    'dashboard',
  ]
  console.log(store.get('user/profile'))
  console.log(route)
}

// export default function Authenticated() {}
