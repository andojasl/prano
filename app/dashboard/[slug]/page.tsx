import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import EditProductForm from "@/components/EditProductForm";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  image: string;
  hover_image?: string;
  price: number;
  ready?: boolean;
  category: number;
  material_details?: string;
  care_details?: string;
  deliver_details?: string;
  images?: string[];
  available_sizes?: any;
  slug: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function EditProductPage({ params }: PageProps) {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch the product by slug
  const { data: product, error: productError } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      image,
      hover_image,
      price,
      ready,
      category,
      material_details,
      care_details,
      deliver_details,
      images,
      slug
    `)
    .eq('slug', params.slug)
    .single();

  if (productError || !product) {
    console.error('Error fetching product:', productError);
    notFound();
  }

  // Fetch available sizes for this product
  const { data: sizes } = await supabase
    .from('sizes')
    .select('size, quantity')
    .eq('product_id', product.id);

  // Add sizes to product data
  const productWithSizes: Product = {
    ...product,
    available_sizes: sizes || []
  };

  // Fetch categories for the dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information and settings</p>
        </div>

        {/* Edit Product Form */}
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <Edit className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Editing: {product.title}
            </h2>
          </div>
          
          <EditProductForm 
            categories={categories || []} 
            product={productWithSizes}
          />
        </Card>
      </div>
    </div>
  );
}
