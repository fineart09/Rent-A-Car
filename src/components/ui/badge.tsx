"use client"

import React from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
}

export function Badge({ className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
