import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import ProductForm from "@/components/ProductForm";  // Fetch categories for the dropdown

interface Category {
  id: number;
  name: string;
  slug: string;
}


export default async function CreateProductPage() {

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");


    return (
        <div className="pt-8">
       {/* Create Product Form */}
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <h2 className="text-lg font-defonte text-gray-900">Create New Product</h2>
          </div>
          
          <ProductForm categories={categories || []} />
        </Card>
 
        </div>
    )
}