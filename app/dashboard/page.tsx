import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const dashboardCard = (
    title: string,
    description: string,
    viewAllHref: string,
    addNewHref?: string,
    addNewText?: string,
  ) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          {addNewHref && (
            <Link href={addNewHref} className="flex-1">
              <Button className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-black-600 transition-colors">
                {addNewText || `Add ${title.slice(0, -1)}`}
              </Button>
            </Link>
          )}
          <Link href={viewAllHref} className="flex-1">
            <Button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              View All
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCard(
            "Products",
            "Manage your product catalog, inventory, and pricing",
            "/dashboard/products",
            "/dashboard/create-product",
            "Add Product",
          )}

          {dashboardCard(
            "Texts",
            "Manage website content and text elements",
            "/dashboard/texts",
            "/dashboard/create-text",
            "Add Text",
          )}

          {dashboardCard(
            "Meet Locations",
            "Manage upcoming events and meeting locations",
            "/dashboard/meet-locations",
            "/dashboard/create-meet-location",
            "Add Location",
          )}

          {dashboardCard(
            "Orders",
            "View and manage customer orders and fulfillment",
            "/dashboard/orders",
          )}

          {dashboardCard(
            "Custom Requests",
            "Handle custom order requests from customers",
            "/dashboard/custom-requests",
          )}

          {dashboardCard(
            "Categories",
            "Organize products into categories",
            "/dashboard/categories",
            "/dashboard/create-category",
            "Add Category",
          )}
        </div>
      </div>
    </div>
  );
}
