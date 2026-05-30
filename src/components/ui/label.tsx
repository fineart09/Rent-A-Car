'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export default function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={cn('mb-1.5 block text-sm font-semibold text-slate-800', className)} {...props}>
      {children}
    </label>
  )
}
