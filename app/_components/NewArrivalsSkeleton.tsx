import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for NewArrivals section on home page
 *
 * Matches the asymmetric 3-product layout:
 * - Desktop: Product 1 (w-72 top), Products 2 & 3 (w-80 and w-64 side-by-side)
 * - Mobile: 3 stacked products
 */
export default function NewArrivalsSkeleton() {
  return (
    <section className="max-w-5xl mx-auto items-center">
      <div className="grid md:grid-cols-1 grid-cols-1 lg:grid-cols-7 flex-row items-center justify-between">
        {/* Left side: Title and link */}
        <div className="flex max-w-5xl left-0 w-full lg:w-auto flex-col gap-6 col-span-1 lg:col-span-3">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-24 mb-12" />
        </div>

        {/* Right side: Products */}
        <div className="flex flex-col w-full md:w-full lg:w-auto gap-6 col-span-1 lg:col-span-4">
          {/* Product 1 - top */}
          <div className="flex w-full lg:w-auto flex-row gap-4 justify-center lg:justify-center">
            <div className="w-full lg:w-72">
              <ProductCardSkeleton showMobileText={false} />
            </div>
          </div>

          {/* Products 2 & 3 - middle row */}
          <div className="flex w-full lg:w-auto flex-col md:flex-row gap-4 lg:gap-6 justify-center lg:justify-end">
            <div className="w-full lg:w-80">
              <ProductCardSkeleton showMobileText={false} />
            </div>
            <div className="w-full lg:w-64">
              <ProductCardSkeleton showMobileText={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
