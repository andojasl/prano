import Product from "../components/product";
import { createClient } from '@/utils/supabase/server';

// Sample product data - replace with your actual product data
const products = [
  {
    id: 1,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Minimalist Silver Ring",
    price: "120",
    category: "rings",
    featured: true,
  },
  {
    id: 2,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Amber Trip Necklace",
    price: "280",
    category: "necklaces",
    featured: true,
  },
  {
    id: 3,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Organic Gold Earrings",
    price: "195",
    category: "earrings",
    featured: false,
  },
  {
    id: 4,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Textured Silver Bracelet",
    price: "165",
    category: "bracelets",
    featured: false,
  },
  {
    id: 5,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Mixed Metal Pendant",
    price: "220",
    category: "necklaces",
    featured: true,
  },
  {
    id: 6,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Sculptural Gold Ring",
    price: "340",
    category: "rings",
    featured: false,
  },
  {
    id: 7,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Asymmetric Silver Earrings",
    price: "145",
    category: "earrings",
    featured: false,
  },
  {
    id: 8,
    displayImage: "/product-square.png",
    hoverImage: "/image-hover.png",
    title: "Natural Stone Necklace",
    price: "195",
    category: "necklaces",
    featured: true,
  },
];

// Layout configuration using pattern-based system
const layoutConfig = {
  rows: [
    'S P P S', 
    'P S P P', 
    'S S P S', 
    'P P S P', 
  ],
  
  productSize: {
    width: 80, 
    height: 48, 
  },
  
  fixedGap: 30, 
  betweenRows: 16,      
  containerPadding: 14, 
};

// Function to create pattern-based layout
const createPatternLayout = (products: any[], config: typeof layoutConfig) => {
  const layout = [];
  let productIndex = 0;
  let rowPatternIndex = 0;
  
  while (productIndex < products.length) {
    const pattern = config.rows[rowPatternIndex % config.rows.length];
    const slots = pattern.split(' '); 
    
    const rowProducts = [];
    const positions = [];
    
    // Go through each slot in the pattern
    for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
      const slot = slots[slotIndex];
      
      if (slot === 'P' && productIndex < products.length) {
        rowProducts.push(products[productIndex]);
        positions.push(slotIndex); 
        productIndex++;
      } else if (slot === 'S') {
        // Empty space slot - do nothing
      }
    }
    
    layout.push({
      products: rowProducts,
      positions: positions,
      pattern: pattern,
    });
    
    rowPatternIndex++;
  }
  
  return layout;
};

export default async function Shop() {
  // Fetch categories from Supabase (Server Component)
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  // Fallback categories if Supabase fails
  const displayCategories = categories || [
    { id: "all", name: "All", slug: "all" },
    { id: "rings", name: "Rings", slug: "rings" },
    { id: "necklaces", name: "Necklaces", slug: "necklaces" },
    { id: "earrings", name: "Earrings", slug: "earrings" },
    { id: "bracelets", name: "Bracelets", slug: "bracelets" },
  ];

  // Add "All" category if not present
  const categoriesWithAll = [
    { id: "all", name: "All", slug: "all" },
    ...displayCategories.filter(cat => cat.slug !== "all")
  ];

  const layoutPattern = createPatternLayout(products, layoutConfig);

  if (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation & Filters */}
      <section className="w-full py-12 border-b border-gray-200">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-4">
              {categoriesWithAll.map((category) => (
                <button
                  key={category.id}
                  className="px-6 py-3 font-headline rounded-lg text-sm tracking-wider border border-black hover:bg-black hover:text-white transition-all duration-300 first:bg-black first:text-white"
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort & Filter Options */}
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 font-headline rounded-lg text-sm">
                <option>Sort by: Featured</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
                <option>Sort by: Newest</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 font-headline rounded-lg text-sm hover:bg-gray-50">
                Filter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid-Based Products Layout */}
      <section className={`w-full py-16 bg-gray-50`}>
        <div className=" mx-auto">
          {layoutPattern.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="relative"
              style={{ 
                height: `${layoutConfig.productSize.height * 4}px`,
                width: '100%',
                marginBottom: rowIndex < layoutPattern.length - 1 ? `${layoutConfig.betweenRows}px` : '0'
              }}
            >
              {row.products.map((product, productIndex) => (
                <div
                  key={product.id}
                  className="absolute"
                  style={{
                    left: `${(row.positions[productIndex] / 4) * 100}%`,
                    width: `${(1 / 4) * 96}%`, // Each product takes 1/4 of the row
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'end',
                    gap: `${layoutConfig.fixedGap}px`,
                  }}
                >
                  <Product
                    displayImage={product.displayImage}
                    hoverImage={product.hoverImage}
                    title={product.title}
                    price={product.price}
                    width={layoutConfig.productSize.width}
                    height={layoutConfig.productSize.height}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 