import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Base skeleton component for loading states
 *
 * Provides shimmer animation effect for a premium loading experience.
 * Follows Shadcn UI patterns with forwardRef and class name utilities.
 *
 * @param className - Additional CSS classes
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label="Loading content"
        className={cn("animate-shimmer rounded-md", className)}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
