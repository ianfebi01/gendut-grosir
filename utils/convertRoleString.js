export const convertRoleString = (role) => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'user':
      return 'User'
  }
}
