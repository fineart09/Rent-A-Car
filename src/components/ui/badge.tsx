"use client"

import React from 'react'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
}

export function Badge({ className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
