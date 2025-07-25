'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const expandableSections = [
  { id: "size-guide", title: "Size guide", content: "Ring sizing information and measurement guide." },
  { id: "materials", title: "Materials", content: "High-quality niobium and certified diamonds used in all pieces." },
  { id: "delivery", title: "Delivery & Return", content: "Free shipping worldwide. 30-day return policy." },
  { id: "care", title: "Jewelry care & Warranty", content: "Care instructions and lifetime warranty information." }
];

interface Product {
  id: number;
  title: string;
  slug: string;
  images: string[];
  description?: string;
  specifications?: string;
  craftsmanship?: string;
  fromPrice?: string;
  price: string;
  availability?: string;
  availableSizes?: string[];
  category: string;
}

interface PageProps {
  params: Promise<{
    categorySlug: string;
    productSlug: string;
  }>;
}

export default function ProductPage({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<{
    categorySlug: string;
    productSlug: string;
  } | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Fetch product data
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchProduct = async () => {
      try {
        const supabase = createClient();
        
        // First get category ID from category slug
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', resolvedParams.categorySlug)
          .single();

        if (categoryError || !categoryData) {
          console.error('Error fetching category:', categoryError);
          setProduct(null);
          return;
        }
        
        // Fetch product by slug and category ID
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', resolvedParams.productSlug)
          .eq('category', categoryData.id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          setProduct(null);
        } else {
          // Process the product data
          const processedProduct: Product = {
            ...data,
            images: data.images || [data.image || "/product-square.png", data.hover_image || "/image-hover.png"],
            availableSizes: data.availableSizes || ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]
          };
          setProduct(processedProduct);
        }
      } catch (error) {
        console.error('Error:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main product content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-4">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
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
              {product.title}
            </h1>

            {/* Description */}
            {product.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div className="space-y-2">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.specifications}
                </p>
              </div>
            )}

            {/* Craftsmanship */}
            {product.craftsmanship && (
              <div className="space-y-2">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.craftsmanship}
                </p>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-2">
              {product.fromPrice && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">From Price</span>
                  <span className="text-sm font-medium">{product.fromPrice}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-medium">{product.price}</span>
              </div>
            </div>

            {/* Product Details */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Ring size:</span>
                  <span className="text-sm font-medium">{product.availableSizes.join("   ")}</span>
                </div>
              </div>
            )}

            {/* Availability */}
            {product.availability && (
              <div className="text-sm text-gray-600">
                {product.availability}
              </div>
            )}

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