// New client-side Sidebar component
'use client'

import React from 'react'
import Link from 'next/link'

type Props = {
  user?: any
}

export default function Sidebar({ user }: Props) {
  // read snake_case or camelCase role fields that may exist on the session user
  const rawRoles = user?.roles ?? user?.role ?? user?.user_roles ?? []
  const roles = Array.isArray(rawRoles) ? rawRoles : (typeof rawRoles === 'string' ? [rawRoles] : [])

  const isAdmin = roles.some((r: string) => r.toLowerCase() === 'admin')
  const isManager = roles.some((r: string) => r.toLowerCase() === 'manager')

  const displayName = user?.name ?? user?.user_name ?? user?.email ?? 'Guest'

  return (
    <aside className="w-64 h-screen bg-white border-r p-4 hidden md:block">
      <div className="mb-6">
        <div className="font-bold text-lg">Rent Car App</div>
        <div className="text-sm text-gray-600 mt-1">{displayName}</div>
      </div>

      <nav className="flex flex-col gap-1">
        <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
        <Link href="/cars" className="px-3 py-2 rounded hover:bg-gray-100">Cars</Link>
        <Link href="/bookings" className="px-3 py-2 rounded hover:bg-gray-100">Bookings</Link>

        {isManager && (
          <Link href="/fleet" className="px-3 py-2 rounded hover:bg-gray-100">Fleet Management</Link>
        )}

        {isAdmin && (
          <>
            <div className="mt-4 text-xs font-semibold text-gray-500 uppercase">Admin</div>
            <Link href="/admin/users" className="px-3 py-2 rounded hover:bg-gray-100">User Management</Link>
            <Link href="/admin/settings" className="px-3 py-2 rounded hover:bg-gray-100">Settings</Link>
          </>
        )}
      </nav>
    </aside>
  )
}
