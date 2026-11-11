import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        standard:
          "bg-standard text-standard-foreground shadow-xs hover:bg-standard/90",
        success:
          "bg-success text-success-foreground shadow-xs hover:bg-success/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        warning:
          "bg-warning text-warning-foreground shadow-xs hover:bg-warning/90",
        info:
          "bg-info text-info-foreground shadow-xs hover:bg-info/90",
        outlineStandard:
          "border bg-background shadow-xs hover:bg-input/50 text-standard-base dark:bg-input/30 dark:border-input",
        outlineSuccess:
          "border bg-background shadow-xs hover:bg-input/50 text-success-base dark:bg-input/30 dark:border-input",
        outlineDestructive:
          "border bg-background shadow-xs hover:bg-input/50 text-destructive-base dark:bg-input/30 dark:border-input",
        outlineWarning:
          "border bg-background shadow-xs hover:bg-input/50 text-warning-base dark:bg-input/30 dark:border-input",
        outlineInfo:
          "border bg-background shadow-xs hover:bg-input/50 text-info-base dark:bg-input/30 dark:border-input",
        gradientStandard:
          "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
