import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Custom Jewelry Orders - Prano",
  description: "Create your unique piece of jewelry with Prano. Commission custom rings, necklaces, earrings, and bracelets. Professional consultation and craftsmanship guaranteed.",
  keywords: "custom jewelry, bespoke jewelry, jewelry commission, custom rings, custom necklaces, personalized jewelry, jewelry design consultation",
  openGraph: {
    title: "Custom Jewelry Orders - Prano",
    description: "Create your unique piece of jewelry with Prano. Professional consultation and craftsmanship guaranteed.",
    type: "website",
  },
};

export default function CustomOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}