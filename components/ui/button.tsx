'use client'

import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost'
}

export default function Button({ variant = 'default', className = '', ...props }: Props) {
  const base = 'inline-flex items-center px-3 py-1.5 rounded text-sm font-medium'
  const variants: Record<string, string> = {
    default: 'bg-primary text-white hover:opacity-95',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200'
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
