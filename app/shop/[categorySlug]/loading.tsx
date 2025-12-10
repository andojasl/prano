import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for shop category pages
 *
 * Displayed automatically by Next.js while the page component loads data.
 * Matches the layout with filters, product count, and responsive product grid.
 */
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navigation & Filters */}
      <section className="w-full py-6 bg-white border-b border-gray-200">
        <div className="mx-auto">
          <div className="flex flex-row justify-between items-center gap-8">
            {/* Category filter skeleton */}
            <Skeleton className="h-10 w-32" />

            {/* Sort dropdown skeleton */}
            <div className="flex w-full font-argesta gap-2 justify-end md:justify-end">
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-4">
        <div className="mx-auto">
          {/* Product count skeleton */}
          <div className="text-left mb-4">
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Desktop Layout - 4 columns */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={`desktop-${i}`} showMobileText={false} />
            ))}
          </div>

          {/* Tablet Layout - 2 columns */}
          <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={`tablet-${i}`} showMobileText={false} />
            ))}
          </div>

          {/* Mobile Layout - 2 columns */}
          <div className="grid md:hidden grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={`mobile-${i}`} showMobileText={true} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
