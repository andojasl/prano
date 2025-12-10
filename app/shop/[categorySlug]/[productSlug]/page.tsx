"use client";
import useCartStore from "@/app/store/cartStore";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// const expandableSections = [
//   { id: "size-guide", title: "Size guide", content: "Ring sizing information and measurement guide." },
//   { id: "materials", title: "Materials", content: "High-quality niobium and certified diamonds used in all pieces." },
//   { id: "delivery", title: "Delivery & Return", content: "Free shipping worldwide. 30-day return policy." },
//   { id: "care", title: "Jewelry care & Warranty", content: "Care instructions and lifetime warranty information." }
// ];

interface Product {
  id: number;
  title: string;
  slug: string;
  images: string[];
  description?: string;
  material_details?: string;
  care_details?: string;
  price: string;
  availability?: string;
  availableSizes?: string[];
  category: string;
}

interface Size {
  size: string;
  quantity: number;
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
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const addItem = useCartStore((state) => state.addItem);

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
          .from("categories")
          .select("id")
          .eq("slug", resolvedParams.categorySlug)
          .single();

        if (categoryError || !categoryData) {
          setProduct(null);
          return;
        }

        // Fetch product by slug and category ID
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", resolvedParams.productSlug)
          .eq("category", categoryData.id)
          .single();

        if (error) {
          setProduct(null);
        } else {
          // Combine all available images into one array
          const allImages: string[] = [];

          // Add images from the images array if it exists and has content
          if (
            data.images &&
            Array.isArray(data.images) &&
            data.images.length > 0
          ) {
            allImages.push(...data.images);
          } else {
            // Fallback: use image and hover_image if images array is empty/null
            if (data.image) {
              allImages.push(data.image);
            }
            if (data.hover_image && data.hover_image !== data.image) {
              allImages.push(data.hover_image);
            }
          }

          // Fallback to default images if no images found
          if (allImages.length === 0) {
            allImages.push("/product-square.png", "/image-hover.png");
          }

          // Process the product data
          const processedProduct: Product = {
            ...data,
            images: allImages,
            availableSizes: data.available_sizes || data.availableSizes,
          };

          setProduct(processedProduct);
        }
      } catch (_error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams]);

  // Fetch sizes from sizes table
  useEffect(() => {
    if (!product) return;

    const fetchSizes = async () => {
      try {
        const supabase = createClient();

        const { data: sizesData, error } = await supabase
          .from("sizes")
          .select("size, quantity")
          .eq("product_id", product.id);

        if (error) {
          setSizes([]);
        } else {
          const sizeValues = sizesData.map((item) => ({
            size: item.size,
            quantity: item.quantity || 0,
          }));
          setSizes(sizeValues);
        }
      } catch (_error) {
        setSizes([]);
      }
    };

    fetchSizes();
  }, [product]);

  const expandableSections = [
    {
      id: "size-guide",
      title: "Size guide",
      content: "sizing information and measurement guide.",
    },
    { id: "materials", title: "Materials", content: product?.material_details },
    {
      id: "delivery",
      title: "Delivery & Return",
      content: "Free shipping worldwide. 30-day return policy.",
    },
    {
      id: "care",
      title: "Jewelry care & Warranty",
      content: product?.care_details,
    },
  ];
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen">
      {/* Main product content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-16">
          {/* Product Images */}
          <div className="lg:col-span-4">
            <div className="flex gap-4">
              {/* Image thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-col space-y-4">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        selectedImage === index
                          ? "border-black"
                          : "border-gray-200"
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

              {/* Main Image */}
              <div className="bg-gray-50 rounded-lg aspect-[1/1] overflow-hidden flex-1">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4 lg:col-span-3">
            {/* Title */}
            <h1 className="text-xl font-headline tracking-wide mb-12">
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

            {/* Pricing */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Price</span>
              <span className="text-sm font-medium">{product.price} €</span>
            </div>

            {/* Size Selection */}
            {sizes && sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm flex flex-row items-center text-gray-600">
                  Available sizes:
                  <div className="pl-3">
                    {sizes.map((sizeObj: Size) => (
                      <button
                        key={sizeObj.size}
                        onClick={() =>
                          sizeObj.quantity > 0
                            ? setSelectedSize(sizeObj.size)
                            : null
                        }
                        disabled={sizeObj.quantity === 0}
                        className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          sizeObj.quantity === 0
                            ? "text-gray-400 cursor-not-allowed line-through"
                            : selectedSize === sizeObj.size
                              ? "underline text-black"
                              : "text-gray-700 hover:text-black hover:underline"
                        }`}
                        title={
                          sizeObj.quantity === 0
                            ? "Out of stock"
                            : `${sizeObj.quantity} available`
                        }
                      >
                        {sizeObj.size}{" "}
                        {sizeObj.quantity === 0 && "(Out of stock)"}
                      </button>
                    ))}
                  </div>
                </span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded border bg-white border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Image
                    src="/icons/minus.svg"
                    alt="-"
                    width={12}
                    height={12}
                  ></Image>
                </button>
                <span className="text-sm font-medium min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                  className="w-8 h-8 rounded border bg-white border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Image
                    src="/icons/plus.svg"
                    alt="+"
                    width={12}
                    height={12}
                  ></Image>
                </button>
              </div>
            </div>

            {/* Availability */}
            {product.availability && (
              <div className="text-sm text-gray-600">
                {product.availability}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={() => {
                  addItem(
                    {
                      id: product.id.toString(),
                      name: product.title,
                      price: parseFloat(product.price),
                      image: product.images[0],
                      size: selectedSize || undefined,
                      size_quantity:
                        sizes.find((size) => size.size === selectedSize)
                          ?.quantity || undefined,
                    },
                    quantity,
                  );
                }}
                className="w-full py-3 rounded-lg px-6 bg-black text-white font-headline text-sm tracking-wider hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center flex-row gap-2"
              >
                <Image
                  src="/icons/add-to-cart.svg"
                  alt="Add to cart"
                  width={32}
                  height={32}
                  className="brightness-0 invert"
                />{" "}
                Add to cart
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
                    <Image
                      src="/icons/arrow-down.svg"
                      alt="Arrow"
                      width={16}
                      height={10}
                      className={`transform transition-transform duration-200 ${
                        expandedSections.includes(section.id)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
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
    </div>
  );
}
