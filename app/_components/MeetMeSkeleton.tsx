import { MeetMeCardSkeleton } from "@/components/ui/meet-me-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for MeetMe section on home page
 *
 * Matches the layout with:
 * - Section title
 * - Responsive grid: lg:grid-cols-3, md:grid-cols-2, grid-cols-1
 * - 3 meet location cards
 */
export default function MeetMeSkeleton() {
  return (
    <section className="w-full max-w-5xl py-24 flex flex-col items-start gap-16">
      {/* Section title */}
      <Skeleton className="h-9 w-32 mb-8" />

      {/* Grid of meet location cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <MeetMeCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
