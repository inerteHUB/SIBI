import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

function Card({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({ variant }), 
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

const cardVariants = cva(
  "flex flex-col gap-1 rounded-xl shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-card border text-foreground shadow-xs hover:bg-card/90",
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
          "border-2 border-standard-base bg-background shadow-xs text-standard-foreground dark:bg-input/30 dark:border-input",
        outlineSuccess:
          "border-2 border-success-base bg-background shadow-xs text-success-foreground dark:bg-input/30 dark:border-input",
        outlineDestructive:
          "border-2 border-destructive-base bg-background shadow-xs text-destructive-foreground dark:bg-input/30 dark:border-input",
        outlineWarning:
          "border-2 border-warning-base bg-background shadow-xs text-warning-foreground dark:bg-input/30 dark:border-input",
        outlineInfo:
          "border-2 border-info-base bg-background shadow-xs text-info-foreground dark:bg-input/30 dark:border-input",
        gradientStandard:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
        outline:
          "border-2 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export {
  Card,
  cardVariants, 
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
