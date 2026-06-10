import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-blue-600/25 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-blue-700 text-white shadow-sm shadow-blue-700/20 hover:bg-blue-800",
        outline: "border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/50 hover:bg-slate-50 aria-expanded:bg-slate-50 aria-expanded:text-slate-950",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 aria-expanded:bg-slate-200 aria-expanded:text-slate-950",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-950 aria-expanded:bg-slate-100 aria-expanded:text-slate-950",
        destructive: "bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-600/20",
        link: "rounded-none text-blue-700 underline-offset-4 hover:underline",
        save: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 focus-visible:ring-emerald-600/25",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-lg px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-xs":
          "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export default Button
