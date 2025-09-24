import { Metadata } from "next";
import { createClient } from "@/lib/supabase/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;

  console.log('=== METADATA DEBUG ===');
  console.log('Category Slug:', categorySlug);
  console.log('Product Slug:', productSlug);

  try {
    const supabase = createClient();

    // Get category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .eq("slug", categorySlug)
      .single();

    console.log('Category Data:', categoryData);
    console.log('Category Error:', categoryError);

    if (!categoryData) {
      console.log('No category found, returning fallback metadata');
      return { title: "Product Not Found - Prano" };
    }

    // Get product data
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", productSlug)
      .eq("category", categoryData.id)
      .single();

    console.log('Product Data:', product);
    console.log('Product Error:', productError);

    if (!product) {
      console.log('No product found, returning fallback metadata');
      return { title: "Product Not Found - Prano" };
    }

    // Clean the product title to remove any existing brand names
    const cleanTitle = product.title
      .replace(/\s*-\s*NEGAILA\s*STUDIO\s*/gi, '')
      .replace(/\s*-\s*Prano\s*/gi, '')
      .trim();

    console.log('Original title:', product.title);
    console.log('Cleaned title:', cleanTitle);

    const finalTitle = `${cleanTitle} - Handcrafted Jewelry - Prano`;
    console.log('Final metadata title:', finalTitle);

    return {
      title: finalTitle,
      description: product.description
        ? `${product.description} Handcrafted with attention to detail. Price: ${product.price}€. Available at Prano.`
        : `Beautiful handcrafted ${cleanTitle} from Prano's contemporary jewelry collection. Price: ${product.price}€. Made with recycled materials and responsibly sourced stones.`,
      keywords: `${cleanTitle}, handcrafted jewelry, contemporary jewelry, ${categorySlug}, artisan jewelry, recycled materials, sustainable jewelry`,
      openGraph: {
        title: `${cleanTitle} - Prano`,
        description: product.description || `Beautiful handcrafted ${cleanTitle} from Prano's collection.`,
        type: "website",
        images: product.image ? [product.image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    console.error("Error details:", error);
    return {
      title: "Handcrafted Jewelry - Prano",
      description: "Discover unique handcrafted jewelry with contemporary forms by Prano.",
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}