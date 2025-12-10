import { Metadata } from "next";
import { createClient } from "@/lib/supabase/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;


  try {
    const supabase = createClient();

    // Get category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id, name")
      .eq("slug", categorySlug)
      .single();


    if (!categoryData) {
      return { title: "Product Not Found - Prano" };
    }

    // Get product data
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", productSlug)
      .eq("category", categoryData.id)
      .single();


    if (!product) {
      return { title: "Product Not Found - Prano" };
    }

    // Clean the product title to remove any existing brand names
    const cleanTitle = product.title
      .replace(/\s*-\s*NEGAILA\s*STUDIO\s*/gi, '')
      .replace(/\s*-\s*Prano\s*/gi, '')
      .trim();


    const finalTitle = `${cleanTitle} - Handcrafted Jewelry - Prano`;

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