import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/utils/data/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        processingStates:
          "border border-statePending bg-statePending-foreground text-statePending inline-flex w-fit items-center p-1 rounded-md",
        anotherStates:
          "border border-[hsl(210,18%,80%)] bg-[hsl(210,18%,94%)] text-[hsla(217,9%,52%,1)] inline-flex w-fit items-center p-1 rounded-md",
        completedStates:
          "border border-stateComplete bg-stateComplete-foreground text-stateComplete inline-flex w-fit items-center p-1 rounded-md",
        errorStates:
          "border border-transparent bg-destructive text-destructive-foreground inline-flex w-fit items-center p-1 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
