'use client'

import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import Button from './ui/button'

export default function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
  }, [])

  return (
    <header className="w-full flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center space-x-3">
        <div className="text-lg font-bold text-primary">Car Rental Admin</div>
      </div>
      <div className="flex items-center gap-3">
        {user?.email ? <div className="text-sm text-slate-700 dark:text-slate-200">{user.email}</div> : null}
        <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/auth/signin' })}>Sign out</Button>
      </div>
    </header>
  )
}
