export type MenuItem = {
  title: string
  href: string
  roles?: string[] // allowed roles (snake_case, e.g., 'admin', 'manager')
}

const menu: MenuItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Cars', href: '/cars' },
  { title: 'Bookings', href: '/bookings' },
  { title: 'Fleet Management', href: '/fleet', roles: ['manager', 'admin'] },
  { title: 'User Management', href: '/admin/users', roles: ['admin'] },
  { title: 'Settings', href: '/admin/settings', roles: ['admin'] },
]

export default menu
