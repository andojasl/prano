import Image from "next/image";
import Product from "../components/product";

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

function Landing() {
  return (
    <div
      className="w-full h-[calc(100vh-135px)] md:h-[calc(100vh-135px)] rounded-lg"
      style={{
        backgroundImage: 'url(/hero-image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );
}

async function NewArrivals() {
  // Fetch latest products
  let products: ProductData[] = [];
  
  try {
    // Use direct server-side call for better reliability
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
         const { data: productData, error } = await supabase
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
         categories!inner(slug)
       `)
       .order('id', { ascending: false })
       .limit(3);

     if (error) {
       console.error('Error fetching latest products:', error);
     } else {
       // Transform the data to match our interface
       products = (productData || []).map(product => ({
         ...product,
         categories: Array.isArray(product.categories) ? product.categories[0] : product.categories
       }));
     }
  } catch (error) {
    console.error('Failed to fetch latest products:', error);
  }

  // Layout variations for visual appeal (similar to original hardcoded layout)
  const layoutVariations = [
    { width: 96, height: 48, justify: 'justify-end' },
    { width: 112, height: 56, justify: '' },
    { width: 104, height: 48, justify: 'justify-end' },
  ];



  return (
    <section className="w-full max-w-5xl flex flex-row max-h-screen items-center py-16 px-14 justify-between">
      <div className="flex left-0 flex-col gap-6">
        <h2 className="text-3xl font-defonte">NEW ARRIVALS</h2>
        <a href="/shop" className="text-base font-serif underline">View shop</a>
      </div>
      <div className="flex flex-col gap-8 max-w-4xl">
        {products.length > 0 ? (
          <>
            {/* Product 1 - Right aligned */}
            <div className="flex flex-row gap-4 justify-end">
              <div className="w-80">
                <Product
                  displayImage={products[0].image}
                  hoverImage={products[0].hover_image || undefined}
                  title={products[0].title}
                  slug={products[0].slug}
                  categorySlug={products[0].categories?.slug || 'all'}
                  price={products[0].price.toString()}
                  width={96}
                  height={48}
                />
              </div>
            </div>
            
            {/* Product 2 - Center */}
            {products[1] && (
              <div className="w-96">
                <Product
                  displayImage={products[1].image}
                  hoverImage={products[1].hover_image || undefined}
                  title={products[1].title}
                  slug={products[1].slug}
                  categorySlug={products[1].categories?.slug || 'all'}
                  price={products[1].price.toString()}
                  width={112}
                  height={56}
                />
              </div>
            )}
            
            {/* Product 3 - Right aligned */}
            {products[2] && (
              <div className="flex flex-row gap-4 justify-end">
                <div className="w-72">
                  <Product
                    displayImage={products[2].image}
                    hoverImage={products[2].hover_image || undefined}
                    title={products[2].title}
                    slug={products[2].slug}
                    categorySlug={products[2].categories?.slug || 'all'}
                    price={products[2].price.toString()}
                    width={104}
                    height={48}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          // Fallback content if no products are found
          <div className="flex flex-col gap-8">
            <div className="flex flex-row gap-4 justify-end">
              <div className="w-80 h-80">
                <Product displayImage="/product-square.png" hoverImage="/image-hover.png" title="Sample Product" slug="sample" categorySlug="all" price="299" width={96} height={48} />
              </div>
            </div>
            <p className="text-sm text-gray-500">No products found. Using sample data.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function MeetMe() {
  return (
    <section className="w-full max-w-5xl flex flex-col items-start py-32 px-14 gap-16">
      <h2 className="text-3xl font-serif mb-8">MEET ME</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Event 1 */}
        <div className="flex-1 bg-[#B7C5CE] rounded-lg flex flex-row gap-4">
          <div className="h-full w-full rounded-l-lg mb-2" style={{backgroundImage: 'url(/amber.png)', backgroundSize: 'cover'}} />
          <div className="flex flex-col gap-2 p-6">
            <h3 className="text-2xl font-serif text-white">Amber Trip 2025</h3>
            <span className="text-base font-headline">LITEXPO, Vilnius ⋅ 13-15/02</span>
            <a href="#" className="text-white font-headline">Read more</a>
          </div>
        </div>
         <div className="flex-1 bg-[#B7C5CE] rounded-lg flex flex-row gap-4">
          <div className="h-full w-full rounded-l-lg mb-2" style={{backgroundImage: 'url(/kaziukas.png)', backgroundSize: 'cover'}} />
          <div className="flex flex-col gap-2 p-6">
            <h3 className="text-2xl font-serif text-white">Kaziukas Fair</h3>
            <span className="text-base font-headline">Vilnius ⋅ 7-9/03</span>
            <a href="#" className="text-white font-headline">Read more</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPrano() {
  return (
    <section className="w-full max-w-5xl flex flex-col items-start py-32 px-14 gap-16">
      <h2 className="text-3xl font-serif mb-8">ABOUT PRANO</h2>
    </section>
  );
}
export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center w-full bg-white">
      <Landing />
      <NewArrivals />
      <MeetMe />
      <AboutPrano />
    </div>
  );
}
