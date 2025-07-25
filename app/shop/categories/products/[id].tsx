'use client';

import { useState } from 'react';
import Image from 'next/image';

// Sample product data - replace with actual product data or fetch from API
const productData = {
  id: 1,
  title: "Product",
  images: [
    "/product-square.png",
    "/image-hover.png",
  ],
  description: "This minimalist diamond ring explores form and function through a modern aesthetic that marries with visual elegance and harmony of proportions. The tension setting breathes space between the matte anthracite ring base and the precious gemstone, allowing a stunning play of light and sparkle. Geometric, luminous, perfectly cut brilliant juxtaposed by textured, organic tempered niobium with a polished interior surface.",
  specifications: "VS1, F+, excellent cut & polish, certified diamond tension set in niobium. Custom made to size upon request, diamond type and specific colours shall be picked upon request.",
  craftsmanship: "Each piece is unique and entirely handcrafted by the artist. Patinated using self-developed undisclosed technology. Artisanal metalwork techniques are combined with experimental practices. There is no glue, artificial colouring or chemicals used in the process.",
  fromPrice: "1500,00 €",
  price: "2600,00 €",
  availability: "Available on backorder",
  availableSizes: ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
  category: "Earrings",
  breadcrumb: ["Store", "Earrings", "Product"]
};

const expandableSections = [
  { id: "size-guide", title: "Size guide", content: "Ring sizing information and measurement guide." },
  { id: "materials", title: "Materials", content: "High-quality niobium and certified diamonds used in all pieces." },
  { id: "delivery", title: "Delivery & Return", content: "Free shipping worldwide. 30-day return policy." },
  { id: "care", title: "Jewelry care & Warranty", content: "Care instructions and lifetime warranty information." }
];

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="min-h-screen bg-white">


      {/* Main product content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={productData.images[selectedImage]}
                alt={productData.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image thumbnails */}
            {productData.images.length > 1 && (
              <div className="flex space-x-4">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${productData.title} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            
            {/* Title */}
            <h1 className="text-3xl font-headline tracking-wide">
              {productData.title}
            </h1>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-sm">
                {productData.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <p className="text-gray-700 text-sm leading-relaxed">
                {productData.specifications}
              </p>
            </div>

            {/* Craftsmanship */}
            <div className="space-y-2">
              <p className="text-gray-700 text-sm leading-relaxed">
                {productData.craftsmanship}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">From Price</span>
                <span className="text-sm font-medium">{productData.fromPrice}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-medium">{productData.price}</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Ring size:</span>
                <span className="text-sm font-medium">{productData.availableSizes.join("   ")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Diamond size:</span>
                <span className="text-sm font-medium">3.8mm (0.2ct)</span>
              </div>
            </div>

            {/* Availability */}
            <div className="text-sm text-gray-600">
              {productData.availability}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button className="w-full py-3 px-6 bg-black text-white font-headline text-sm tracking-wider hover:bg-gray-800 transition-colors duration-300">
                Add to cart
              </button>
              <button className="w-full py-3 px-6 border border-gray-300 text-black font-headline text-sm tracking-wider hover:bg-gray-50 transition-colors duration-300">
                Enquire
              </button>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-2 pt-8">
              {expandableSections.map((section) => (
                <div key={section.id} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-4 flex justify-between items-center text-left text-sm text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    <span>{section.title}</span>
                    <span className={`transform transition-transform duration-200 ${
                      expandedSections.includes(section.id) ? 'rotate-180' : ''
                    }`}>
                      ↓
                    </span>
                  </button>
                  {expandedSections.includes(section.id) && (
                    <div className="pb-4">
                      <p className="text-sm text-gray-700">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Breadcrumb */}
            <div className="pt-8 border-t border-gray-100">
              <nav className="text-sm text-gray-500">
                {productData.breadcrumb.map((crumb, index) => (
                  <span key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    <button className="hover:text-black transition-colors duration-200">
                      {crumb}
                    </button>
                  </span>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Cart indicator */}
      <div className="fixed bottom-8 right-8">
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-headline text-sm">
          0
        </div>
      </div>
    </div>
  );
}