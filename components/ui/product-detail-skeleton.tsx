import { Skeleton } from "./skeleton";

/**
 * Skeleton loading state for product detail page
 *
 * Matches the layout of the ProductPage component with:
 * - Left side (4 cols): Thumbnail column + main image
 * - Right side (3 cols): Product info, price, sizes, quantity, add to cart, expandable sections
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-16">
          {/* Left: Product Images */}
          <div className="lg:col-span-4">
            <div className="flex gap-4">
              {/* Thumbnails column */}
              <div className="flex flex-col space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>

              {/* Main image */}
              <Skeleton className="flex-1 aspect-[1/1] rounded-lg" />
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="space-y-4 lg:col-span-3">
            {/* Title */}
            <Skeleton className="h-6 w-3/4" />

            {/* Description lines */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Price */}
            <Skeleton className="h-5 w-32" />

            {/* Size buttons */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-12" />
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>

            {/* Add to cart button */}
            <Skeleton className="h-12 w-full rounded-lg" />

            {/* Expandable sections */}
            <div className="space-y-2 pt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
