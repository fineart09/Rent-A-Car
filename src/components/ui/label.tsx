'use client'

import React from 'react'

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export default function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 ${className}`} {...props}>
      {children}
    </label>
  )
}
