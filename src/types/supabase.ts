// Database types
export interface Category {
  id: string;
  name: string;           // Display name: "Necklaces & Pendants"
  slug: string;          // URL slug: "necklaces-pendants"
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category_id?: string;
  images?: string[];
  featured?: boolean;
  availability?: string;
  created_at?: string;
  updated_at?: string;
}

// API Response types
export interface SupabaseResponse<T> {
  data: T[] | null;
  error: any;
}

// Utility function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Example usage:
// generateSlug("Necklaces & Pendants") → "necklaces-pendants"
// generateSlug("Men's Rings") → "mens-rings" 