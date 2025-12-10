import { Skeleton } from "./skeleton";

/**
 * Skeleton loading state for checkout success / order detail page
 *
 * Matches the layout of the CheckoutSuccessContent component with:
 * - Top success card with icon, title, and order info
 * - Two-column grid (lg:grid-cols-2):
 *   - Left: Order items card with product rows
 *   - Right: Order summary card with pricing
 */
export function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success header card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-4">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
          <Skeleton className="h-8 w-64 mx-auto mb-6" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />

            {/* Order number area */}
            <div className="bg-gray-100 p-4 rounded-lg mt-6">
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-6 w-48 mx-auto mb-3" />
              <Skeleton className="h-6 w-24 mx-auto" />
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-6 space-y-4">
              {/* Order item rows */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-6 space-y-4">
              {/* Summary lines */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}

              {/* Total line */}
              <div className="flex justify-between border-t pt-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>

              {/* What's Next section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Skeleton className="h-11 w-full sm:w-40" />
            <Skeleton className="h-11 w-full sm:w-32" />
          </div>
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
      </div>
    </div>
  );
}
