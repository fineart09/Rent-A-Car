'use client'

import React, { useState, ReactNode, useRef, useEffect } from 'react'

type DropdownMenuProps = {
  trigger: ReactNode
  children: ReactNode
}

export default function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
          <div className="p-1">{children}</div>
        </div>
      )}
    </div>
  )
}
