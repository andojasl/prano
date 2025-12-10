import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

/**
 * Skeleton loading state for product cards
 *
 * Matches the layout of the Product component with responsive behavior:
 * - Desktop: Square image skeleton only (hover overlay pattern)
 * - Mobile: Square image + title and price text skeletons
 *
 * @param showMobileText - Show text skeletons on mobile (default: true)
 * @param className - Additional CSS classes
 */
export interface ProductCardSkeletonProps {
  showMobileText?: boolean;
  className?: string;
}

export function ProductCardSkeleton({
  showMobileText = true,
  className,
}: ProductCardSkeletonProps) {
  return (
    <div className={cn("rounded-lg w-full", className)}>
      {/* Square product image skeleton */}
      <div className="rounded-lg relative overflow-hidden aspect-[1/1] w-full">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Mobile text skeletons (title and price) */}
      {showMobileText && (
        <div className="pt-3 text-center md:hidden space-y-2">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      )}
    </div>
  );
}
