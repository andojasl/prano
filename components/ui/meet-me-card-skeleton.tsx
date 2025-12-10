import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

/**
 * Skeleton loading state for meet location cards
 *
 * Matches the layout of the MeetMeCard component with:
 * - Image area (h-64 fixed height)
 * - Title skeleton
 * - Location/date skeleton
 *
 * @param className - Additional CSS classes
 */
export interface MeetMeCardSkeletonProps {
  className?: string;
}

export function MeetMeCardSkeleton({ className }: MeetMeCardSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full bg-white rounded-lg flex flex-col border border-gray-200 h-full",
        className
      )}
    >
      {/* Image skeleton */}
      <Skeleton className="rounded-t-lg w-full h-64 flex-shrink-0" />

      {/* Content area */}
      <div className="px-4 pb-4 pt-4 flex-grow flex flex-col justify-between space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4" />

        {/* Location and date skeleton */}
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
