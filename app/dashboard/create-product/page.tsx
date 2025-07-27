import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Package, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import ProductForm from "../../../components/ProductForm";

interface Category {
  id: number;
  name: string;
  slug: string;
}

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="mt-2 text-gray-600">Add a new product to your jewelry store</p>
        </div>

        {/* Create Product Form */}
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <Plus className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          </div>
          
          <ProductForm categories={categories || []} />
        </Card>
      </div>
    </div>
  );
}