import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline" | "get" | "post" | "put" | "delete" | "patch"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input",
    get: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
    post: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    put: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    delete: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    patch: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
