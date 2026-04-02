import type { HTMLAttributes } from "react"

import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("animate-pulse rounded-md bg-muted/50", className)} 
      aria-busy="true"
      aria-live="polite"
      {...props} 
    />
  )
}

export { Skeleton }
