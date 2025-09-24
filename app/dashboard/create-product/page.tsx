import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import ProductForm from "../../../components/ProductForm";

export default async function CreateProductPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch categories for the dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-defonte text-gray-900">
            Create New Product
          </h1>
        </div>

        {/* Create Product Form */}
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Details</h2>
          </div>

          <ProductForm categories={categories || []} />
        </Card>
      </div>
    </div>
  );
}
