import Link from "next/link";
import Product from "@/components/product";

interface ProductData {
  id: string;
  image: string;
  hover_image: string | null;
  title: string;
  slug: string;
  price: number;
  category: number;
  description: string | null;
  categories: {
    slug: string;
  };
}
export default async function NewArrivals() {
  // Fetch latest products
  let products: ProductData[] = [];

  try {
    // Use direct server-side call for better reliability
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: productData, error } = await supabase
      .from("products")
      .select(
        `
         id,
         image,
         hover_image,
         title,
         slug,
         price,
         category,
         description,
         categories!inner(slug)
       `,
      )
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
    } else {
      // Transform the data to match our interface
      products = (productData || []).map((product) => ({
        ...product,
        categories: Array.isArray(product.categories)
          ? product.categories[0]
          : product.categories,
      }));
    }
  } catch (_error) {
  }

  return (
    <section className="max-w-5xl mx-auto items-center">
      <div className="grid md:grid-cols-1 grid-cols-1 lg:grid-cols-7 flex-row items-center justify-between">
        <div className="flex max-w-5xl left-0 w-full lg:w-auto flex-col gap-6 col-span-1 lg:col-span-3">
          <h2 className="text-3xl font-defonte">NEW ARRIVALS</h2>
          <Link href="/shop" className="text-base font-serif mb-12">
            View shop
          </Link>
        </div>
        <div className="flex flex-col w-full md:w-full lg:w-auto gap-6 col-span-1 lg:col-span-4">
          {products.length > 0 ? (
            <>
              {/* Product 1 - top */}
              <div className="flex w-full lg:w-auto flex-row gap-4 justify-center lg:justify-center">
                <div className="w-full lg:w-72">
                  <Product
                    displayImage={products[0].image}
                    hoverImage={products[0].hover_image || undefined}
                    title={products[0].title}
                    slug={products[0].slug}
                    categorySlug={products[0].categories?.slug || "all"}
                    price={products[0].price.toString()}
                    width={96}
                    height={48}
                  />
                </div>
              </div>

              {/* Product 2 - mid */}
              {products[1] && (
                <div className="flex w-full lg:w-auto flex-col md:flex-row gap-4 lg:gap-6 justify-center lg:justify-end">
                  <div className="w-full lg:w-80">
                    <Product
                      displayImage={products[1].image}
                      hoverImage={products[1].hover_image || undefined}
                      title={products[1].title}
                      slug={products[1].slug}
                      categorySlug={products[1].categories?.slug || "all"}
                      price={products[1].price.toString()}
                      width={56}
                      height={56}
                    />
                  </div>
                  {products[2] && (
                    <div className="w-full lg:w-64">
                      <Product
                        displayImage={products[2].image}
                        hoverImage={products[2].hover_image || undefined}
                        title={products[2].title}
                        slug={products[2].slug}
                        categorySlug={products[2].categories?.slug || "all"}
                        price={products[2].price.toString()}
                        width={48}
                        height={48}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Fallback content if no products are found
            <div className="flex flex-col gap-8">
              <div className="flex flex-row gap-4 justify-end">
                <div className="w-80 h-80">
                  <Product
                    displayImage="/product-square.png"
                    hoverImage="/image-hover.png"
                    title="Sample Product"
                    slug="sample"
                    categorySlug="all"
                    price="299"
                    width={96}
                    height={48}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                No products found. Using sample data.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
