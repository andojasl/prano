import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Package } from "lucide-react";

export default async function ViewProductsPage() {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch all products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      id, 
      image, 
      hover_image, 
      title, 
      slug, 
      price, 
      category, 
      description, 
      ready, 
      available_sizes, 
      images,
      categories!inner(slug)
    `)
    .order('title');

  if (productsError) {
    console.error('Error fetching products:', productsError);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">View Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products?.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Product Image */}
                  <div className="w-1/3 relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="w-2/3 p-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-xl font-bold text-gray-900">
                        €{product.price}
                      </p>
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${
                          product.ready ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.ready ? 'Ready' : 'Made to order'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/dashboard/${product.slug}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      
                  
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(!products || products.length === 0) && (
          <Card className="p-12 text-center">
            <div className="text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-sm">
                Start by creating your first product.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/create-product">
                  Create Product
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
