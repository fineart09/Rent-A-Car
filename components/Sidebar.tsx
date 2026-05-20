'use client'

import React from 'react'
import { userHasAnyRole } from '../src/utils/auth'

type Props = {
  userRoles?: string[]
}

const menu = [
  { key: 'dashboard', label: 'Dashboard', path: '/' },
  { key: 'fleet', label: 'Fleet Management', path: '/fleet', roles: ['ADMIN', 'MANAGER', 'AGENT'] },
  { key: 'customers', label: 'Customer Management', path: '/customers', roles: ['ADMIN', 'MANAGER', 'AGENT'] },
  { key: 'bookings', label: 'Bookings', path: '/bookings', roles: ['ADMIN', 'MANAGER', 'AGENT'] },
  { key: 'payments', label: 'Payments & Reports', path: '/payments', roles: ['ADMIN', 'MANAGER'] },
  { key: 'settings', label: 'Settings', path: '/settings', roles: ['ADMIN'] }
]

export default function Sidebar({ userRoles }: Props) {
  return (
    <aside className="h-full p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Admin</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menu.map((m) => {
            if (m.roles && !userHasAnyRole(userRoles, m.roles)) return null
            return (
              <li key={m.key}>
                <a href={m.path} className="block rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {m.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
