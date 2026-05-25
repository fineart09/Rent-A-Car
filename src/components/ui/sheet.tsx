'use client'

import React from 'react'

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export default function Sheet({ open, onOpenChange, children }: SheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black opacity-40" onClick={() => onOpenChange(false)} />
      <div className="relative w-72 bg-white h-full p-4">
        {children}
      </div>
    </div>
  )
}
