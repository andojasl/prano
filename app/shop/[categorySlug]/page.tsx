import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Product from "../../../components/product";
import SortDropdown from "../../../components/shop/SortDropdown";
import CategoryFilter from "../../../components/shop/CategoryFilter";

import {
  createPatternLayout,
  layoutConfigs,
} from "../../../lib/shop/shopLayout";

interface TextItem {
  id: string;
  text: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}
interface Product {
  id: string;
  image: string;
  hover_image: string | null;
  title: string;
  slug: string;
  price: number;
  category: number;
  description: string | null;
  ready: boolean | null;
  available_sizes: Array<{ size: string; quantity: number }>;
  images: string[] | null;
  categories?: {
    slug: string;
  };
}

interface PageProps {
  params: Promise<{
    categorySlug: string;
  }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { categorySlug } = resolvedParams;
  const { sort = "default" } = resolvedSearchParams;

  // Fetch data from separate API routes
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prano.vercel.app";

  const [categoriesResponse, productsResponse, textResponse] = await Promise.all([
    fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/products?category=${categorySlug}`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/texts`, { cache: "no-store" }),
  ]);

  if (!categoriesResponse.ok || !productsResponse.ok) {
    console.error("Failed to fetch data");
    notFound();
  }
  if (!textResponse.ok) {
    console.error("Failed to fetch texts");
    notFound();
  }

  const { categories: categoriesWithAll } = await categoriesResponse.json();
  const { products: rawProducts } = await productsResponse.json();
  const { texts: rawTexts } = await textResponse.json();

  // Shuffle texts randomly using Fisher-Yates algorithm
  const shuffleArray = (array: TextItem[]): TextItem[] => {
    const arr = [...array]; // Create a copy
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const texts = shuffleArray(rawTexts);

  // Sort products based on the sort parameter
  const filteredProducts = [...rawProducts];

  switch (sort) {
    case "price-low-high":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high-low":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name-a-z":
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-z-a":
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      // Keep original order
      break;
  }

  // Find the current category
  const currentCategory = categoriesWithAll.find(
    (cat: Category) => cat.slug === categorySlug,
  );

  if (!currentCategory) {
    notFound();
  }

  // Create layouts for different screen sizes
  const desktopLayout = createPatternLayout(
    filteredProducts,
    texts,
    layoutConfigs.desktop,
  );
  const tabletLayout = createPatternLayout(
    filteredProducts,
    texts,
    layoutConfigs.tablet,
  );
  const mobileLayout = createPatternLayout(
    filteredProducts,
    texts,
    layoutConfigs.mobile,
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation & Filters */}
      <section className="w-full py-6 border-b border-gray-200">
        <div className="mx-auto">
          <div className="flex flex-row justify-between items-center gap-8">
            {/* Category Filter */}
            <CategoryFilter
              categories={categoriesWithAll}
              currentCategory={categorySlug}
            />

            {/* Sort & Filter Options */}
            <div className="flex w-full font-argesta gap-2 justify-end md:justify-end">
              <SortDropdown currentSort={sort} categorySlug={categorySlug} />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-4">
        <div className="mx-auto">
          {/* Category Title */}
          <div className="text-left mb-4">
            {categorySlug !== "all" && (
              <p className="text-gray-600 text-argesta">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
                {sort !== "default" && (
                  <span className="ml-2">
                    • Sorted by{" "}
                    {sort === "price-low-high"
                      ? "Price (Low to High)"
                      : sort === "price-high-low"
                        ? "Price (High to Low)"
                        : sort === "name-a-z"
                          ? "Name (A-Z)"
                          : sort === "name-z-a"
                            ? "Name (Z-A)"
                            : "Default"}
                  </span>
                )}
              </p>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 font-text text-lg mb-6">
                No products found in this category.
              </p>
              <Link
                href="/shop/all"
                className="px-6 py-3 font-headline rounded-lg text-sm tracking-wider border border-black hover:bg-black hover:text-white transition-all duration-300"
              >
                View All Products
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Layout (4 columns) */}
              <div
                className="hidden lg:grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${layoutConfigs.desktop.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${Math.ceil(
                    desktopLayout.length / layoutConfigs.desktop.columns,
                  )}, auto)`,
                }}
              >
                {desktopLayout.map((item, index) => (
                  <div
                    key={`desktop-${index}`}
                    style={{
                      gridColumn: item.gridColumn,
                      gridRow: item.gridRow,
                    }}
                    className={
                      item.type === "spacer"
                        ? "opacity-0 pointer-events-none"
                        : ""
                    }
                  >
                    {item.type === "product" && (
                      <Product
                        displayImage={item.product.image}
                        hoverImage={item.product.hover_image || undefined}
                        title={item.product.title}
                        slug={item.product.slug}
                        categorySlug={
                          item.product.categories?.slug || categorySlug
                        }
                        price={item.product.price.toString()}
                        width={layoutConfigs.desktop.productSize.width}
                        height={layoutConfigs.desktop.productSize.height}
                      />
                    )}
                    {item.type === "text" && "text" in item && (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-center text-gray-700 font-argesta text-xs">
                          {item.text.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tablet Layout (2 columns) */}
              <div
                className="hidden md:grid lg:hidden gap-6"
                style={{
                  gridTemplateColumns: `repeat(${layoutConfigs.tablet.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${Math.ceil(
                    tabletLayout.length / layoutConfigs.tablet.columns,
                  )}, auto)`,
                }}
              >
                {tabletLayout.map((item, index) => (
                  <div
                    key={`tablet-${index}`}
                    style={{
                      gridColumn: item.gridColumn,
                      gridRow: item.gridRow,
                    }}
                    className={
                      item.type === "spacer"
                        ? "opacity-0 pointer-events-none"
                        : ""
                    }
                  >
                    {item.type === "product" && (
                      <Product
                        displayImage={item.product.image}
                        hoverImage={item.product.hover_image || undefined}
                        title={item.product.title}
                        slug={item.product.slug}
                        categorySlug={
                          item.product.categories?.slug || categorySlug
                        }
                        price={item.product.price.toString()}
                        width={layoutConfigs.tablet.productSize.width}
                        height={layoutConfigs.tablet.productSize.height}
                      />
                    )}
                    {item.type === "text" && "text" in item && (
                      <div className="flex items-center justify-center h-full p-4">
                        <p className="text-center text-gray-700 font-argesta text-xs">
                          {item.text.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Layout (1 column) */}
              <div className="grid md:hidden gap-4 grid-cols-1">
                {mobileLayout.map((item, index) => (
                  <div key={`mobile-${index}`}>
                    {item.type === "product" && (
                      <Product
                        displayImage={item.product.image}
                        hoverImage={item.product.hover_image || undefined}
                        title={item.product.title}
                        slug={item.product.slug}
                        categorySlug={
                          item.product.categories?.slug || categorySlug
                        }
                        price={item.product.price.toString()}
                        width={layoutConfigs.mobile.productSize.width}
                        height={layoutConfigs.mobile.productSize.height}
                      />
                    )}
                    {item.type === "text" && "text" in item && (
                      <div className="flex items-center justify-center h-full p-4">
                        <p className="text-center text-gray-700 font-argesta text-sm">
                          {item.text.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
