// Sample product data - replace with your actual product data
export const products = [
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

// Sample categories data
export const sampleCategories = [
  { id: "all", name: "All", slug: "all" },
  { id: "rings", name: "Rings", slug: "rings" },
  { id: "necklaces", name: "Necklaces", slug: "necklaces" },
  { id: "earrings", name: "Earrings", slug: "earrings" },
  { id: "bracelets", name: "Bracelets", slug: "bracelets" },
];

// Product type definition
export type Product = {
  id: number;
  displayImage: string;
  hoverImage: string;
  title: string;
  price: string;
  category: string;
  featured: boolean;
};

// Category type definition
export type Category = {
  id: string;
  name: string;
  slug: string;
}; 