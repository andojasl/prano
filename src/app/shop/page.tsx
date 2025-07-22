import Product from "../components/product";

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

const categories = [
  { id: "all", name: "All" },
  { id: "rings", name: "Rings" },
  { id: "necklaces", name: "Necklaces" },
  { id: "earrings", name: "Earrings" },
  { id: "bracelets", name: "Bracelets" },
];

// Layout configuration using pattern-based system
const layoutConfig = {
  // Each row has 4 slots. Use patterns to define what goes in each slot:
  // 'P' = Product, 'S' = Space (empty slot)
  // Examples:
  // 'P P P P' = 4 products side by side
  // 'S P S P' = space, product, space, product  
  // 'P S P P' = product, space, product, product
  rows: [
    'S P P S',  // space, product, product, space (centered 2 products)
    'P S P P',  // product, space, product, product 
    'S S P S',  // space, space, product, space (centered 1 product)
    'P P S P',  // product, product, space, product
  ],
  
  // Fixed product size
  productSize: {
    width: 80,  // Base product width in Tailwind units
    height: 48, // Base product height in Tailwind units
  },
  
  // Fixed gap between all products (always 30px)
  fixedGap: 30, // 30px gap between products
  
  // General spacing
  betweenRows: 16,       // Space between rows (mb-16)
  containerPadding: 14,  // Side padding (px-14)
};

// Function to create pattern-based layout
const createPatternLayout = (products: any[], config: typeof layoutConfig) => {
  const layout = [];
  let productIndex = 0;
  let rowPatternIndex = 0;
  
  while (productIndex < products.length) {
    const pattern = config.rows[rowPatternIndex % config.rows.length];
    const slots = pattern.split(' '); // ['P', 'S', 'P', 'P']
    
    const rowProducts = [];
    const positions = [];
    
    // Go through each slot in the pattern
    for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
      const slot = slots[slotIndex];
      
      if (slot === 'P' && productIndex < products.length) {
        // Place a product in this slot
        rowProducts.push(products[productIndex]);
        positions.push(slotIndex); // Slot 0, 1, 2, or 3
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

export default function Shop() {
  const layoutPattern = createPatternLayout(products, layoutConfig);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation & Filters */}
      <section className="w-full py-12 border-b border-gray-200">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
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
              className={`relative ${
                rowIndex < layoutPattern.length - 1 ? `mb-${layoutConfig.betweenRows}` : ''
              }`}
              style={{ 
                height: `${layoutConfig.productSize.height * 4}px`,
                width: '100%'
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