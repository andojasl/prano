import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

/**
 * Generate a URL-friendly slug from a product title
 * @param title The product title
 * @returns A slugified string
 */
export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function getProductUrl(categorySlug: string, productSlug: string) {
  return `/shop/${categorySlug}/${productSlug}`;
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.NODE_ENV === 'development' 
      ? "http://localhost:3000" 
      : "https://prano.vercel.app");
}
